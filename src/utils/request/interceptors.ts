// 定义拦截器函数的类型
export type RequestInterceptor = (config: RequestInit) => Promise<RequestInit> | RequestInit;
export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;
export type ErrorInterceptor = (error: any) => Promise<any> | any;

class InterceptorManager {
  // 使用 Set 确保不会重复添加同一个拦截器实例
  private requestInterceptors: Set<RequestInterceptor> = new Set();
  private responseInterceptors: Set<ResponseInterceptor> = new Set();
  private errorInterceptors: Set<ErrorInterceptor> = new Set();

  // 添加请求拦截器
  useRequest(interceptor: RequestInterceptor): void {
    this.requestInterceptors.add(interceptor);
  }

  // 添加响应拦截器
  useResponse(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.add(interceptor);
  }
  
  // 添加错误拦截器
  useError(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.add(interceptor);
  }

  // 移除拦截器
  ejectRequest(interceptor: RequestInterceptor): void {
    this.requestInterceptors.delete(interceptor);
  }

  ejectResponse(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.delete(interceptor);
  }

  ejectError(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.delete(interceptor);
  }

  // 应用所有请求拦截器
  async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let newConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      newConfig = await interceptor(newConfig);
    }
    return newConfig;
  }

  // 应用所有响应拦截器
  async applyResponseInterceptors(response: Response): Promise<Response> {
    let newResponse = response;
    for (const interceptor of this.responseInterceptors) {
      newResponse = await interceptor(newResponse);
    }
    return newResponse;
  }
  
  // 应用所有错误拦截器
  async applyErrorInterceptors(error: any): Promise<any> {
    let newError = error;
    for (const interceptor of this.errorInterceptors) {
      newError = await interceptor(newError);
    }
    // 如果拦截器处理了错误并返回了一个非错误值，我们就不再抛出
    // 但通常错误拦截器会重新抛出错误
    throw newError;
  }
}

// 导出一个单例，方便全局使用
export const interceptors = new InterceptorManager();
