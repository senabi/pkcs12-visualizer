import { Certificate, Pkcs12, Pkey } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const PKCS12Data: React.FC<{
  data: Pkcs12 & { privateKeys: Pkey[]; certificates: Certificate[] };
}> = (props) => {
  return (
    <div
      // className="h-screen min-h-screen w-screen"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"
    >
      <div className="m-auto flex max-w-[50%] flex-col gap-4 rounded-xl bg-white/10 p-4 py-4 text-white hover:bg-white/20">
        <div>Private Keys</div>
        <div>
          {props.data.privateKeys.map((key) => (
            <div id={key.id} className="flex flex-col gap-2">
              <div>
                <div>Asymetric Key Type</div>
                <div>{key.asymmetricKeyType}</div>
              </div>
              <div>
                <div>Type</div>
                <div>{key.type}</div>
              </div>
              <div>
                <div>Type</div>
                <div>{key.type}</div>
              </div>
              <div>
                <div>Modulus</div>
                <div>{key.modulusLength}</div>
              </div>
              <div>
                <div>Public Exponent</div>
                <div className="break-words">{key.publicExponent}</div>
              </div>
              <div>
                <div>Private Exponent</div>
                <div className="break-words">{key.privateExponent}</div>
              </div>
              <div>
                <div>First Prime Factor</div>
                <div className="break-words">{key.firstPrimeFactor}</div>
              </div>
              <div>
                <div>Second Prime Factor</div>
                <div className="break-words">{key.secondPrimeFactor}</div>
              </div>
              <div>
                <div>First Exponent</div>
                <div className="break-words">{key.firstExponent}</div>
              </div>
              <div>
                <div>Second Exponent</div>
                <div className="break-words">{key.secondExponent}</div>
              </div>
              <div>
                <div>Raw</div>
                <div className="flex max-h-[400px] overflow-y-auto whitespace-pre ">
                  {key.raw}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>Certificates</div>
        <div>
          {props.data.certificates.map((cert) => (
            <div id={cert.id} className="flex flex-col gap-2">
              <div>
                <div>Issuer</div>
                <div>{cert.issuer}</div>
              </div>
              <div>
                <div>Subject</div>
                <div>{cert.subject}</div>
              </div>
              <div>
                <div>Valid From</div>
                <div>{cert.validFrom}</div>
              </div>
              <div>
                <div>Valid To</div>
                <div>{cert.validTo}</div>
              </div>
              <div>
                <div>Key Type</div>
                <div>{cert.publicKey}</div>
              </div>
              <div>
                <div>Raw</div>
                <div className="flex max-h-[400px] overflow-y-auto whitespace-pre ">
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
