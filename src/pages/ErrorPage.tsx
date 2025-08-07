import { useEffect, useState } from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';

// pre样式
const preStyle: React.CSSProperties = {
  marginTop: '10px',
  fontSize: '14px',
  textAlign: 'left',
  background: '#eee',
  borderRadius: '4px',
  // fontWeight: '600',
  lineHeight: '1.2',
  color: '#333',
  padding: '10px',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  fontFamily: 'Source Code Pro,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
}

const backHomeButtonStyle: React.CSSProperties = {
  color: 'blue',
  textDecoration: 'underline',
  cursor: 'pointer',
  marginTop: '20px',

}

export default function ErrorPage() {

  const navigate = useNavigate();

  // useRouteError() 可以获取到 loader 中 throw 的任何东西
  const error = useRouteError();

  console.error(error);

  let errorMessage: string;
  let errorData: any;
  let errorStatus: number | undefined;

  // isRouteErrorResponse 是一个类型守卫，用于检查 error 是否是我们抛出的 Response 对象
  if (isRouteErrorResponse(error)) {

    // 这种情况，我们可以获取到 status 和 statusText
    errorStatus = error.status;
    errorData = decodeURIComponent(error.data);

    errorMessage = error.statusText || error.data; // error.data 是 Response body
  } else if (error instanceof Error) {
    // 如果抛出的是 new Error('message')
    errorMessage = error.message;
  } else {
    // 其他未知错误
    errorMessage = 'An unknown error occurred';
  }

  const [errorStack, setErrorStack] = useState<string | null>(null);

  useEffect(() => {
    // useEffect 只在客户端运行
    // 在组件挂载后，如果错误是 Error 实例，我们才更新 stack state
    if (error instanceof Error) {
      setErrorStack(error.stack || null);
    }
  }, [error]); // 依赖于 error 对象

  return (
    <div id="error-page" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Oops!</h1>
      {errorStatus && <h2>{errorStatus}</h2>}
      {errorData && <p>{errorData}</p>}
      <a style={backHomeButtonStyle} onClick={() => navigate('/', { replace: true })}>Go back home</a>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
      {errorStack && <pre style={preStyle}>
        {errorStack}
      </pre>}
    </div>
  );
}
