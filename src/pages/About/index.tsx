export { Page, loader };

import { QueryClient, useQuery } from "@tanstack/react-query";
import { LoaderFunction } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { api } from "@/utils/request";
import { Layout } from "@/components";
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import styles from './index.module.css';

interface ContactMethod {
  type: string;
  label: string;
  value: string;
  icon?: string;
}

interface BlogJourneyItem {
  date: string;
  title: string;
  description: string;
  milestone?: boolean;
}

interface AboutData {
  id: number;
  title: string;
  content: string;
  summary?: string;
  authorId: number;
  coverImage?: string;
  isPublished?: boolean;
  viewCount?: number;
  contactMethods?: ContactMethod[];
  blogJourney?: BlogJourneyItem[];
  createdAt: string;
  updatedAt: string;
  metas?: Array<{
    id: number;
    name?: string;
    property?: string;
    content: string;
  }>;
}

function Page() {
  const { data: aboutData, isLoading, isError, error } = useQuery({
    queryKey: aboutQueryKey,
    queryFn: fetchAbout,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!aboutData) return <div>No data found</div>;

  const about = aboutData;

  return (
    <>
      <Helmet>
        <title>{about.title} - 简约博客</title>
        <meta name="description" content={about.summary || about.title} />
        <meta property="og:title" content={`${about.title} - 简约博客`} />
        <meta property="og:description" content={about.summary || about.title} />
        <meta property="og:type" content="website" />
        {about.metas?.map((meta, index) => (
          <meta key={index} name={meta.name} property={meta.property} content={meta.content} />
        ))}
      </Helmet>

      <Layout>
        <div className="container">
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>{about.title}</h2>
            <p className={styles.pageDescription}>{about.summary}</p>
          </div>

          <div className={styles.aboutContent}>
            <div className={styles.aboutCard}>
              {about.coverImage && (
                <div className={styles.avatar}>
                  <img src={about.coverImage} alt={about.title} />
                </div>
              )}

              <div className={styles.aboutText}>
                <MarkdownRenderer content={about.content} />
              </div>
            </div>

            {about.contactMethods && about.contactMethods.length > 0 && (
              <>
                <h4>联系方式</h4>
                <div className={styles.contactLinks}>
                  {about.contactMethods.map((contact, index) => (
                    <a
                      key={index}
                      href={contact.type === 'email' ? `mailto:${contact.value}` : contact.value}
                      className={styles.contactLink}
                      target={contact.type !== 'email' ? '_blank' : undefined}
                      rel={contact.type !== 'email' ? 'noopener noreferrer' : undefined}
                    >
                      {contact.icon && `${contact.icon} `}{contact.label}
                    </a>
                  ))}
                </div>
              </>
            )}

            {about.blogJourney && about.blogJourney.length > 0 && (
              <div className={styles.timelineSection}>
                <h4>博客历程</h4>
                <div className={styles.timeline}>
                  {about.blogJourney.map((item, index) => (
                    <div key={index} className={`${styles.timelineItem} ${item.milestone ? styles.milestone : ''}`}>
                      <div className={styles.timelineDate}>{item.date}</div>
                      <div className={styles.timelineContent}>
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

const aboutQueryKey = ['about'];

const fetchAbout = async (): Promise<AboutData> => {
  return await api.get<AboutData>('/about');
}

const loader = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.prefetchQuery({
    queryKey: aboutQueryKey,
    queryFn: fetchAbout,
  });
}
