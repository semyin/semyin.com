export { Page, loader };

import { QueryClient, useQuery } from "@tanstack/react-query";
import { LoaderFunction } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { api } from "@/utils/request";
import { Layout } from "@/components";
import styles from './index.module.css';

interface AboutData {
  name: string;
  avatar?: string;
  introduction: string;
  description: string;
  skills: string[];
  contact: {
    email: string;
    github: string;
    twitter: string;
    linkedin: string;
  };
  stats: {
    articles: number;
    tags: number;
    categories: number;
    since: number;
  };
  timeline: {
    date: string;
    title: string;
    content: string;
  }[];
}

function Page() {
  const { data: aboutData, isLoading, isError, error } = useQuery({
    queryKey: aboutQueryKey,
    queryFn: fetchAbout,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  // 提供默认数据以防API未返回完整数据
  const about: AboutData = aboutData || {
    name: "简约博客",
    introduction: "Hello, world!",
    description: "这里是一个专注于简约设计和优质内容的个人博客。我相信，最好的设计往往是最简单的，最有价值的内容往往来自于深度思考。",
    skills: ["技术分享", "设计思考", "生活感悟", "学习笔记"],
    contact: {
      email: "hello@example.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "#"
    },
    stats: {
      articles: 12,
      tags: 8,
      categories: 4,
      since: 2024
    },
    timeline: [
      {
        date: "2024.08",
        title: "博客诞生",
        content: "开始构建这个简约博客，专注于内容创作"
      },
      {
        date: "2024.08",
        title: "功能完善",
        content: "添加搜索功能、标签系统、分类页面"
      },
      {
        date: "未来",
        title: "持续更新",
        content: "继续优化用户体验，分享更多优质内容"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>关于 - 简约博客</title>
        <meta name="description" content={about.description} />
        <meta property="og:title" content="关于 - 简约博客" />
        <meta property="og:description" content={about.description} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Layout>
        <div className="container">
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>关于我</h2>
            <p className={styles.pageDescription}>{about.introduction}</p>
          </div>

          <div className={styles.aboutContent}>
            <div className={styles.aboutCard}>
              <div className={styles.avatar}>
                <div className={styles.avatarPlaceholder}>👨‍💻</div>
              </div>
              
              <div className={styles.aboutText}>
                <h3>欢迎来到我的数字花园</h3>
                <p>{about.description}</p>
                
                <h4>关于这个博客</h4>
                <p>这个博客建立于 2024 年，主要分享以下内容：</p>
                <ul>
                  {about.skills.map((skill, index) => (
                    <li key={index}><strong>{skill}</strong></li>
                  ))}
                </ul>

                <h4>设计理念</h4>
                <p>这个博客的设计遵循极简主义原则：</p>
                <ul>
                  <li>内容为王，减少干扰元素</li>
                  <li>响应式设计，适配各种设备</li>
                  <li>优雅的排版，舒适的阅读体验</li>
                  <li>暗色模式支持，保护眼部健康</li>
                </ul>

                <h4>技术栈</h4>
                <p>这个博客使用现代技术构建：</p>
                <ul>
                  <li>React + TypeScript</li>
                  <li>NestJS 后端</li>
                  <li>CSS Modules</li>
                  <li>响应式设计</li>
                </ul>

                <h4>联系方式</h4>
                <div className={styles.contactLinks}>
                  <a href={`mailto:${about.contact.email}`} className={styles.contactLink}>📧 Email</a>
                  <a href={about.contact.github} className={styles.contactLink} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
                  <a href={about.contact.twitter} className={styles.contactLink} target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
                  <a href={about.contact.linkedin} className={styles.contactLink}>💼 LinkedIn</a>
                </div>
              </div>
            </div>

            <div className={styles.statsSection}>
              <h4>博客统计</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{about.stats.articles}</div>
                  <div className={styles.statLabel}>文章总数</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{about.stats.tags}</div>
                  <div className={styles.statLabel}>标签数量</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{about.stats.categories}</div>
                  <div className={styles.statLabel}>分类数量</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{about.stats.since}</div>
                  <div className={styles.statLabel}>建站年份</div>
                </div>
              </div>
            </div>

            <div className={styles.timelineSection}>
              <h4>博客历程</h4>
              <div className={styles.timeline}>
                {about.timeline.map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineDate}>{item.date}</div>
                    <div className={styles.timelineContent}>
                      <h5>{item.title}</h5>
                      <p>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

const aboutQueryKey = ['about'];

const fetchAbout = async (): Promise<AboutData> => {
  return await api.get<AboutData>('/articles/about');
}

const loader = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.prefetchQuery({
    queryKey: aboutQueryKey,
    queryFn: fetchAbout,
  });
}
