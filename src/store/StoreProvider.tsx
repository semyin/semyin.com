import React from "react";
import { AppState, StoreContext } from ".";
import { proxy } from "valtio";

export const StoreProvider = ({ initialState, children }: { initialState: AppState, children: React.ReactNode }) => {
  const store = React.useMemo(() => proxy(initialState), [initialState]);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}