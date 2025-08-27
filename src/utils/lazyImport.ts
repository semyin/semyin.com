import React, { ComponentType, LazyExoticComponent } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunction, LoaderFunctionArgs } from 'react-router-dom';

// 描述一个页面模块必须导出的内容
export interface PageModule {
  Page: ComponentType<any>;
  loader?: (queryClient: QueryClient) => LoaderFunction; // loader 是可选的
}

/**
 * 封装一个懒加载函数，用于 react-router，并提供完整的 TypeScript 支持。
 * 它接收一个动态 import 函数，返回一个包含懒加载组件和 loader 的对象。
 *
 * @param factory - 一个返回模块 Promise 的函数, e.g., () => import('@/pages/Home')
 * @returns 一个包含懒加载 Page 组件和 loader 工厂函数的对象
 */
export function lazyImport<T extends PageModule>(
  factory: () => Promise<T>
): {
  Page: LazyExoticComponent<ComponentType<any>>;
  loader: (queryClient: QueryClient) => LoaderFunction;
} {
  // 1. 为组件创建一个懒加载版本
  const Page = React.lazy(() =>
    factory().then((module) => {
      if (!module.Page) {
        // 在开发时提供有用的错误信息
        throw new Error("Module does not export a 'Page' component.");
      }
      // 将命名导出的 'Page' 组件包装为 'default' 导出，以满足 React.lazy 的要求
      return { default: module.Page };
    })
  );

  // 2. 为 loader 创建一个异步函数包装器
  const loader =
    (queryClient: QueryClient): LoaderFunction =>
      async (args: LoaderFunctionArgs) => {
        // 等待模块加载完成
        const module = await factory();

        // 如果模块导出了 loader, 则执行它
        if (module.loader) {
          // 执行原始的 loader 工厂函数，并将 router 的参数和 queryClient 传入
          return module.loader(queryClient)(args);
        }

        // 如果模块没有 loader, 返回 null
        return null;
      };

  return { Page, loader };
}
