import { interceptors } from './interceptors';
import { appEnv } from '@/environment';

// --- 请求拦截器：添加认证 Token ---
const authInterceptor = (config: RequestInit): RequestInit => {
  // 假设 token 存储在 localStorage 或其他地方
  // 注意：在服务端，你可能需要从请求 cookie 或其他上下文获取 token
  const token = appEnv.isSSR ? null : localStorage.getItem('token');
 
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  console.log('[Request Interceptor]:', config);
  return config;
};
 
// --- 响应拦截器：打印日志 ---
const logInterceptor = (response: Response): Response => {
  console.log('[Response Interceptor] - Status:', response.status);
  // 你可以在这里做更多事情，比如解构数据，但通常保持响应对象完整性更好
  return response;
};
 
// --- 错误拦截器：统一处理 401 未授权 ---
const unauthorizedInterceptor = (error: any) => {
  if (error.response && error.response.status === 401) {
    console.error('Unauthorized! Redirecting to login...');
    // 在客户端，可以重定向到登录页
    if (appEnv.isDev) {
      // 
    }
  }
  // 必须重新抛出错误，以便调用处的 catch 块能捕获到它
  throw error;
};
 
 
// 注册拦截器
interceptors.useRequest(authInterceptor);
interceptors.useResponse(logInterceptor);
interceptors.useError(unauthorizedInterceptor);


// 定义我们自己封装的请求配置类型，继承自原生的 RequestInit
export interface CustomRequestInit extends RequestInit {
  // 可以在这里添加自定义配置，比如 'data' 用于 POST/PUT 请求
  data?: any;
}

// 服务端 API 地址，从环境变量读取，提供一个默认值
const SERVER_API_URL = 'http://' + appEnv.host + ':' + appEnv.port + appEnv.apiPrefix;

/**
 * 封装的通用 fetch 函数
 * @param url 请求的相对路径，如 /posts/1
 * @param options 自定义的请求配置
 * @returns Promise<T> - 解析后的 JSON 数据
 */
export async function request<T>(url: string, options: CustomRequestInit = {}): Promise<T> {

  // 1. 确定完整的请求 URL
  const fullUrl = appEnv.isSSR ? SERVER_API_URL + url : appEnv.apiPrefix + url;

  // 2. 准备请求配置
  let config: RequestInit = {
    method: 'GET', // 默认方法
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // 处理 POST, PUT, PATCH 等带有 body 的请求
  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    // 3. 应用请求拦截器
    config = await interceptors.applyRequestInterceptors(config);

    // 4. 发送请求
    const response = await fetch(fullUrl, config);

    // 5. 应用响应拦截器
    const interceptedResponse = await interceptors.applyResponseInterceptors(response);

    // 6. 检查响应状态
    if (!interceptedResponse.ok) {
      // 如果响应状态码不是 2xx，则构造一个错误对象并抛出
      const errorData = await interceptedResponse.json().catch(() => ({
        message: interceptedResponse.statusText
      }));
      
      const error = new Error(errorData.message || 'Request failed') as any;
      error.response = interceptedResponse;
      error.status = interceptedResponse.status;
      error.data = errorData;
      error.statusText = JSON.stringify(errorData);
      throw new Response(errorData.message, error);
    }

    // 7. 解析 JSON 数据
    // 如果响应是 204 No Content，则 body 为空，直接返回 null
    if (interceptedResponse.status === 204) {
      return null as T;
    }
    return await interceptedResponse.json() as T;

  } catch (error) {
    // 8. 应用错误拦截器
    // 错误拦截器负责处理或重新抛出错误
    return await interceptors.applyErrorInterceptors(error);
  }
}

// 封装常用的 HTTP 方法，提供便捷调用
export const http = {

  get: <T>(url: string, options?: CustomRequestInit) =>
    request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data: any, options?: CustomRequestInit) =>
    request<T>(url, { ...options, method: 'POST', data }),

  put: <T>(url: string, data: any, options?: CustomRequestInit) =>
    request<T>(url, { ...options, method: 'PUT', data }),

  patch: <T>(url: string, data: any, options?: CustomRequestInit) =>
    request<T>(url, { ...options, method: 'PATCH', data }),

  delete: <T>(url: string, options?: CustomRequestInit) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};
