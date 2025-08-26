export { Page, loader };

import { QueryClient, useQuery } from "@tanstack/react-query";
import { LoaderFunction } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { api } from "@/utils/request";
import { Layout } from "@/components";
import styles from './index.module.css';
import { useState } from "react";

interface Tag {
  id: number;
  name: string;
  articleCount?: number;
}

interface ArticleListItem {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
  tags?: Array<{
    id: number;
    name: string;
  }>;
}

function Page() {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const { data: tags, isLoading: tagsLoading, isError: tagsError, error: tagsErrorInfo } = useQuery({
    queryKey: tagsQueryKey,
    queryFn: fetchTags,
  });

  const { data: tagArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['tagArticles', selectedTag?.id],
    queryFn: () => fetchTagArticles(selectedTag!.id),
    enabled: !!selectedTag,
  });

  if (tagsLoading) return <div>Loading tags...</div>;
  if (tagsError) return <div>Error: {(tagsErrorInfo as Error).message}</div>;

  const handleTagClick = (tag: Tag) => {
    setSelectedTag(tag);
    // 平滑滚动到文章列表
    setTimeout(() => {
      const postsSection = document.getElementById('tag-posts');
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <>
      <Helmet>
        <title>标签云 - 简约博客</title>
        <meta name="description" content="按标签查看文章，发现感兴趣的内容主题" />
        <meta property="og:title" content="标签云 - 简约博客" />
        <meta property="og:description" content="按标签查看文章，发现感兴趣的内容主题" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Layout>
        <div className="container">
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>标签云</h2>
            <p className={styles.pageDescription}>按标签查看文章</p>
          </div>

          <section className={styles.tagsCloud}>
            {tags?.map((tag: Tag) => (
              <div
                key={tag.id}
                className={`${styles.tagItem} ${selectedTag?.id === tag.id ? styles.active : ''}`}
                onClick={() => handleTagClick(tag)}
                data-count={tag.articleCount || 0}
              >
                <span className={styles.tagName}>{tag.name}</span>
                <span className={styles.tagCount}>{tag.articleCount || 0}</span>
              </div>
            ))}
          </section>

          <section className={styles.posts} id="tag-posts">
            {selectedTag && (
              <>
                <div className={styles.tagPostsHeader}>
                  <h3>标签：{selectedTag.name}</h3>
                  <p>
                    {articlesLoading 
                      ? '加载中...' 
                      : `${tagArticles?.length || 0} 篇文章`
                    }
                  </p>
                </div>

                {articlesLoading ? (
                  <div className={styles.loading}>加载文章中...</div>
                ) : tagArticles && tagArticles.length > 0 ? (
                  tagArticles.map((article: ArticleListItem) => (
                    <article key={article.id} className={styles.postItem}>
                      <h3 className={styles.postTitle}>
                        <a href={`/article/${article.id}`} className={styles.postLink}>
                          {article.title}
                        </a>
                      </h3>
                      <div className={styles.postMeta}>
                        <time className={styles.postDate}>
                          {formatDate(article.createdAt)}
                        </time>
                        {article.category && (
                          <span className={styles.postCategory}>
                            {article.category.name}
                          </span>
                        )}
                        {article.tags && article.tags.length > 0 && (
                          <span className={styles.postTags}>
                            {article.tags.map(tag => (
                              <span key={tag.id} className={styles.tag}>
                                #{tag.name}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🏷️</div>
                    <p>此标签下暂无文章</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </Layout>
    </>
  );
}

const tagsQueryKey = ['tags'];

const fetchTags = async (): Promise<Tag[]> => {
  return await api.get<Tag[]>('/tags');
}

const fetchTagArticles = async (tagId: number): Promise<ArticleListItem[]> => {
  return await api.get<ArticleListItem[]>(`/tags/${tagId}/articles`);
}

const loader = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.ensureQueryData({
    queryKey: tagsQueryKey,
    queryFn: fetchTags,
  });
}