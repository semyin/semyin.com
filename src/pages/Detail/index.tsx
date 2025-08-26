import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, useLoaderData, useParams } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { api } from "@/utils/request";
import { Layout, MarkdownRenderer } from "@/components";
import styles from './index.module.css';

export { Page, loader };

interface ArticleDetail {
  id: number;
  title: string;
  content: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  tags?: Array<{
    id: number;
    name: string;
  }>;
  category?: {
    id: number;
    name: string;
  };
}

function Page() {
  const initialData = useLoaderData() as ArticleDetail;
  const params = useParams();
  
  if (!initialData) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.errorContainer}>
            <h1>文章未找到</h1>
            <p>抱歉，您访问的文章不存在或已被删除。</p>
            <a href="/" className={styles.backLink}>返回首页</a>
          </div>
        </div>
      </Layout>
    );
  }

  const article = initialData;
  const formattedDate = new Date(article.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>{article.title} - 简约博客</title>
        <meta name="description" content={article.summary || article.title} />
        
        {/* Open Graph / Twitter Card data */}
        <meta property="og:title" content={`${article.title} - 简约博客`} />
        <meta property="og:description" content={article.summary || article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/article/${article.id}` : `/article/${article.id}`} />
        <meta property="article:published_time" content={article.createdAt} />
        <meta property="article:modified_time" content={article.updatedAt} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${article.title} - 简约博客`} />
        <meta name="twitter:description" content={article.summary || article.title} />
      </Helmet>
      
      <Layout>
        <div className="container">
          <article className={styles.article}>
            {/* 文章头部 */}
            <header className={styles.articleHeader}>
              <h1 className={styles.articleTitle}>{article.title}</h1>
              <div className={styles.articleMeta}>
                <time className={styles.postDate}>{formattedDate}</time>
                {article.viewCount && (
                  <span className={styles.postViews}>阅读 {article.viewCount}</span>
                )}
                {article.category && (
                  <span className={styles.postCategory}>{article.category.name}</span>
                )}
              </div>
            </header>

            {/* 文章内容 */}
            <div className={styles.articleContent}>
              <MarkdownRenderer content={article.content} />
            </div>
          </article>
        </div>
      </Layout>
    </>
  );
}

const detailQueryKey = ['detail'];

const fetchDetail = async (id: string): Promise<ArticleDetail> => {
  return await api.get<ArticleDetail>(`/articles/${id}`);
}

const loader = (queryClient: QueryClient): LoaderFunction => async ({ params }) => {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }
  
  try {
    return await queryClient.ensureQueryData({
      queryKey: [detailQueryKey, params.id],
      queryFn: () => fetchDetail(params.id as string),
    });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}
