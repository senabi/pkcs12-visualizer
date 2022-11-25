import { Certificate, Pkcs12, Pkey } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const PKCS12Data: React.FC<{
  data: Pkcs12 & { privateKeys: Pkey[]; certificates: Certificate[] };
}> = (props) => {
  return <>{JSON.stringify(props.data)}</>;
};

const PKCS12Content: React.FC<{ id: string }> = (props) => {
  // const
  const { data, isLoading } = trpc.p12.getOne.useQuery({ id: props.id });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>PKCS not found</div>;
  }

  return <PKCS12Data data={data} />;
};

const PKCS12Page = () => {
  const { query } = useRouter();
  const { id } = query;
  if (!id || typeof id !== "string") {
    return <div>Invalid pkcs12 ID</div>;
  }
  return <PKCS12Content id={id} />;
};

export default PKCS12Page;
