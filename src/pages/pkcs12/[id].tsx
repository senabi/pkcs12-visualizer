import { Certificate, Pkcs12, Pkey } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const PKCS12Data: React.FC<{
  data: Pkcs12 & { privateKeys: Pkey[]; certificates: Certificate[] };
}> = (props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="m-auto flex max-w-[50%] flex-col gap-4 bg-white/10 p-4 py-4 ">
        <div className="py-2 text-xl">Private Keys</div>
        <div className="flex flex-col gap-4">
          {props.data.privateKeys.map((key) => (
            <div id={key.id} className="flex flex-col gap-3 border-t-2 py-2">
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Asymetric Key Type</div>
                <div>{key.asymmetricKeyType}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Type</div>
                <div>{key.type}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Modulus</div>
                <div>{key.modulusLength}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Public Exponent</div>
                <div className="break-words">{key.publicExponent}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Private Exponent</div>
                <div className="break-words">{key.privateExponent}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">First Prime Factor</div>
                <div className="break-words">{key.firstPrimeFactor}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Second Prime Factor</div>
                <div className="break-words">{key.secondPrimeFactor}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">First Exponent</div>
                <div className="break-words">{key.firstExponent}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Second Exponent</div>
                <div className="break-words">{key.secondExponent}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Coefficient</div>
                <div className="break-words">{key.coefficient}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Raw</div>
                <div className="flex max-h-[400px] overflow-y-auto whitespace-pre">
                  {key.raw}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="py-2 text-xl">Certificates</div>
        <div className="flex flex-col gap-4">
          {props.data.certificates.map((cert) => (
            <div id={cert.id} className="flex flex-col gap-3 border-t-2 py-2">
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Issuer</div>
                <div>{cert.issuer}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Subject</div>
                <div>{cert.subject}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Valid From</div>
                <div>{cert.validFrom}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Valid To</div>
                <div>{cert.validTo}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Key Type</div>
                <div>{cert.publicKey}</div>
              </div>
              <div className="rounded-lg bg-white/20 p-2">
                <div className="pb-2">Raw</div>
                <div className="flex max-h-[400px] overflow-y-auto whitespace-pre">
                  {cert.raw}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
