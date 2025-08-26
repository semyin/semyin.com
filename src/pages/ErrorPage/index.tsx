import { useEffect, useState } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Layout } from '@/components';
import styles from './index.module.css';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  console.error('[ErrorPage]', error);

  let errorMessage: string;
  let errorData: any;
  let errorStatus: number | undefined;
  let errorTitle: string;

  // isRouteErrorResponse 是一个类型守卫，用于检查 error 是否是我们抛出的 Response 对象
  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorData = decodeURIComponent(error.data);
    errorMessage = error.statusText;
    
    // 根据状态码设置不同的标题
    switch (error.status) {
      case 404:
        errorTitle = '页面未找到';
        break;
      case 500:
        errorTitle = '服务器错误';
        break;
      case 403:
        errorTitle = '访问被拒绝';
        break;
      default:
        errorTitle = '出错了';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorTitle = '出错了';
  } else {
    errorMessage = 'An unknown error occurred';
    errorTitle = '未知错误';
  }

  const [errorStack, setErrorStack] = useState<string | null>(null);

  useEffect(() => {
    if (error instanceof Error) {
      setErrorStack(error.stack || null);
    }
  }, [error]);

  const getErrorDescription = () => {
    if (errorStatus === 404) {
      return '抱歉，您访问的页面不存在或已被删除。';
    } else if (errorStatus === 500) {
      return '服务器遇到了一些问题，请稍后再试。';
    } else if (errorStatus === 403) {
      return '您没有权限访问此页面。';
    }
    return '很抱歉，发生了意外错误。我们正在努力修复这个问题。';
  };

  const getErrorIcon = () => {
    if (errorStatus === 404) return '🔍';
    if (errorStatus === 500) return '⚠️';
    if (errorStatus === 403) return '🚫';
    return '😵';
  };

  return (
    <>
      <Helmet>
        <title>{errorTitle} - 简约博客</title>
        <meta name="description" content={getErrorDescription()} />
      </Helmet>
      
      <Layout>
        <div className="container">
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>{getErrorIcon()}</div>
            
            <h1 className={styles.errorTitle}>{errorTitle}</h1>
            
            {errorStatus && (
              <div className={styles.errorCode}>{errorStatus}</div>
            )}
            
            <p className={styles.errorDescription}>{getErrorDescription()}</p>
            
            {errorData && (
              <div className={styles.errorDetails}>
                <strong>错误详情：</strong> {errorData}
              </div>
            )}

            <div className={styles.errorActions}>
              <button 
                className={styles.primaryButton}
                onClick={() => navigate('/', { replace: true })}
              >
                🏠 返回首页
              </button>
              
              <button 
                className={styles.secondaryButton}
                onClick={() => window.history.back()}
              >
                ← 返回上页
              </button>
              
              <button 
                className={styles.secondaryButton}
                onClick={() => window.location.reload()}
              >
                🔄 重新加载
              </button>
            </div>

            {/* 开发环境下显示错误堆栈 */}
            {process.env.NODE_ENV === 'development' && (
              <details className={styles.errorDebug}>
                <summary className={styles.debugSummary}>调试信息</summary>
                <div className={styles.debugContent}>
                  <p><strong>错误消息：</strong> {errorMessage}</p>
                  {errorStack && (
                    <>
                      <p><strong>错误堆栈：</strong></p>
                      <pre className={styles.errorStack}>{errorStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
