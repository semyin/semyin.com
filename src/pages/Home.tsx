export { Page, loader };

import { StoreContext, useStore } from "@/store";
import { useAppContext } from "@/renderer/AppContext";
import { QueryClient, useQuery } from "@tanstack/react-query";
import React from "react";
import { LoaderFunction } from "react-router";

function Page() {

  const { state, dispatch } = useAppContext();

  const store = React.useContext(StoreContext);
  const snap = useStore();

  const updateTitle = () => {
    if (store) {
      store.title = 'new title updated at:' + new Date().getTime();
    }
  }

  const updateContext = () => {
    dispatch({ type: 'SET_CONTEXT', payload: 'new context updated at:' + new Date().getTime() })
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: homeQueryKey,
    queryFn: fetchHome,
  });

  if (isLoading) return <div>Loading posts...</div>;
  
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Home Page</h1>
      <p>=====valtio state=====</p>
      <p>{snap.theme}</p>
      <p>{snap.title} <button onClick={updateTitle}>Set Title</button> </p>
      <p>=====app context state=====</p>
      <p>{state.context} <button onClick={updateContext}>Set Context</button></p>
      <p>=====query state=====</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

const homeQueryKey = ['home'];

const fetchHome = async () => {
  const res = await fetch('http://localhost:5173/api/home');
  return res.json();
}

const loader  = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.prefetchQuery({
    queryKey: homeQueryKey,
    queryFn: fetchHome,
  });
}
