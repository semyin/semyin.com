export { Page, loader };

import { QueryClient, useQuery } from "@tanstack/react-query";
import { LoaderFunction } from "react-router";

function Page() {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: aboutQueryKey,
    queryFn: fetchAbout,
  });
  
 
  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>About Page</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

const aboutQueryKey = ['about'];

const fetchAbout = async () => {
  const res = await fetch('http://localhost:5173/api/about');
  return res.json();
}

const loader = (queryClient: QueryClient): LoaderFunction => async () => {
  return queryClient.prefetchQuery({
    queryKey: aboutQueryKey,
    queryFn: fetchAbout,
  });
}
