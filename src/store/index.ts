import React from 'react';
import { proxy, useSnapshot } from 'valtio'

export type AppState = {
  theme: 'light' | 'dark';
  title: string;
}

export const state = proxy<AppState>({
  theme: 'light',
  title: 'Default Title',
})

export const createInitialState = (initialValues: Partial<AppState>): AppState => ({
  theme: 'light',
  title: 'Default Title',
  ...initialValues
})

export const StoreContext = React.createContext<AppState | null>(null);

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return useSnapshot(store);
}

export { StoreProvider } from './StoreProvider';
