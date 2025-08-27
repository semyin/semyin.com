export { Page, loader };

import { QueryClient, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { LoaderFunction } from "react-router";
import { api } from "@/utils/request";
import { Layout } from "@/components";
import styles from './index.module.css';

interface Tag {
  id: number;
  name: string;
}

interface ArticleListItem {
  id: number;
  title: string;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  // const articles: ArticleListItem[] = [];

  const { data: articles } = useSuspenseQuery({
    queryKey: articleListQueryKey,
    queryFn: fetchArticleList,
  })

  // const { data: articles, isLoading, isError, error } = useQuery({
  //   queryKey: articleListQueryKey,
  //   queryFn: fetchArticleList,
  // });

  // if (isLoading) return <div>Loading posts...</div>;
  
  // if (isError) return <div>Error: {(error as Error).message}</div>;

  const filteredArticles = searchQuery && articles
    ? articles.filter((article: ArticleListItem) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles || [];

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            padding: '0.1rem 0.2rem',
            borderRadius: '3px'
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Layout articles={articles}>
      <div className="container">
        <section className={styles.posts}>
          {filteredArticles.map((article: ArticleListItem) => (
            <article key={article.id} className={styles.postItem}>
              <h3 className={styles.postTitle}>
                <a href={`/detail/${article.id}`} className={styles.postLink}>
                  {searchQuery ? highlightSearchTerm(article.title, searchQuery) : article.title}
                </a>
              </h3>
              <div className={styles.postMeta}>
                <time className={styles.postDate}>
                  {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                </time>
                {article.tags && article.tags.length > 0 && (
                  <div className={styles.postTags}>
                    {article.tags.map((tag) => (
                      <span key={tag.id} className={styles.tag}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
          {filteredArticles.length === 0 && searchQuery && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem', fontStyle: 'italic' }}>
              未找到匹配 "{searchQuery}" 的文章
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

const articleListQueryKey = ['articleList'];

const fetchArticleList = async (): Promise<ArticleListItem[]> => {
  return await api.get<ArticleListItem[]>('/articles');
}

const loader = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.ensureQueryData({
    queryKey: articleListQueryKey,
    queryFn: fetchArticleList,
  });
}
