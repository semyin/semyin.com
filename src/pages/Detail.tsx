import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, useLoaderData } from "react-router";
import { Helmet } from '@dr.pogodin/react-helmet'; 

export { Page, loader };

type IDetailData = {
  msg: string
}

function Page() {
  
  const initialData = useLoaderData() as IDetailData;

  console.log(initialData);
  
  // const params = useParams();

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: detailQueryKey,
  //   queryFn: () => fetchDetail(params.id as string),
  // });
  
 
  // if (isLoading) return <div>Loading posts...</div>;
  // if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <>
    <Helmet>
        <title>{initialData.msg}</title>
        <meta name="description" content={initialData.msg} />
        
        {/* Open Graph a/ Twitter Card data */}
        <meta property="og:title" content={initialData.msg} />
        <meta property="og:description" content={initialData.msg} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={initialData.msg} />
      </Helmet>
      <div>
        <h1>detail</h1>
        <p>{initialData.msg}</p>
      </div>
    </>
    
  );
}

const detailQueryKey = ['detail'];

const fetchDetail = async (id: string) => {
  const res = await fetch(`http://localhost:5173/api/detail/${id}`);
  return res.json();
}

const loader = (queryClient: QueryClient): LoaderFunction => async ({ params }) => {
  return queryClient.ensureQueryData ({
    queryKey: [detailQueryKey, params.id],
    queryFn: () => fetchDetail(params.id as string),
  });
}
