export { Page, loader };

import { QueryClient, useQuery } from "@tanstack/react-query";
import { LoaderFunction } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet';
import { api } from "@/utils/request";
import { Layout } from "@/components";
import styles from './index.module.css';
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError, error: categoriesErrorInfo } = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
  });

  const { data: categoryArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['categoryArticles', selectedCategory?.id],
    queryFn: () => fetchCategoryArticles(selectedCategory!.id),
    enabled: !!selectedCategory,
  });

  if (categoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError) return <div>Error: {(categoriesErrorInfo as Error).message}</div>;

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    // 平滑滚动到文章列表
    setTimeout(() => {
      const postsSection = document.getElementById('category-posts');
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      '技术': '💻',
      '设计': '🎨',
      '生活': '🌱',
      '学习': '📚',
      '前端': '🌐',
      '后端': '⚙️',
      '移动开发': '📱',
      '数据库': '🗄️',
      '算法': '🧮',
      '工具': '🔧',
    };
    return iconMap[categoryName] || '📁';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <>
      <Helmet>
        <title>文章分类 - 简约博客</title>
        <meta name="description" content="按分类浏览文章，探索不同主题的精彩内容" />
        <meta property="og:title" content="文章分类 - 简约博客" />
        <meta property="og:description" content="按分类浏览文章，探索不同主题的精彩内容" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Layout>
        <div className="container">
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>文章分类</h2>
            <p className={styles.pageDescription}>按分类浏览文章</p>
          </div>

          <section className={styles.categoriesGrid}>
            {categories?.map((category: Category) => (
              <div
                key={category.id}
                className={`${styles.categoryCard} ${selectedCategory?.id === category.id ? styles.active : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className={styles.categoryIcon}>
                  {category.icon || getCategoryIcon(category.name)}
                </div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                {category.description && (
                  <p className={styles.categoryDescription}>{category.description}</p>
                )}
                <div className={styles.categoryCount}>
                  {category.articleCount || 0} 篇文章
                </div>
              </div>
            ))}
          </section>

          <section className={styles.posts} id="category-posts">
            {selectedCategory && (
              <>
                <div className={styles.categoryPostsHeader}>
                  <h3>分类：{selectedCategory.name}</h3>
                  <p>
                    {articlesLoading 
                      ? '加载中...' 
                      : `${categoryArticles?.length || 0} 篇文章`
                    }
                  </p>
                </div>

                {articlesLoading ? (
                  <div className={styles.loading}>加载文章中...</div>
                ) : categoryArticles && categoryArticles.length > 0 ? (
                  categoryArticles.map((article: ArticleListItem) => (
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
                    <div className={styles.emptyIcon}>📝</div>
                    <p>此分类下暂无文章</p>
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

const categoriesQueryKey = ['categories'];

const fetchCategories = async (): Promise<Category[]> => {
  return await api.get<Category[]>('/categories');
}

const fetchCategoryArticles = async (categoryId: number): Promise<ArticleListItem[]> => {
  // 暂时使用文章列表接口过滤，后续可以优化为专门的分类文章接口
  const allArticles = await api.get<ArticleListItem[]>('/articles');
  return allArticles.filter(article => article.category?.id === categoryId);
}

const loader = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.ensureQueryData({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategories,
  });
}