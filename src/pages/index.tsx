import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { P12FileValidator, p12Validator } from "../shared/pkcs12";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const methods = useForm<P12FileValidator>({
    resolver: zodResolver(p12Validator),
  });

  const router = useRouter();

  const p12mutation = trpc.p12.addP12.useMutation({
    onSuccess: (data) => {
      router.push(`/pkcs12/${data.id}`);
    },
  });
  const onSubmit = async (data: P12FileValidator) => {
    console.log(">>>", data);
    p12mutation.mutate(data);
  };

  console.log(methods.formState.errors["contents"]);

  return (
    <>
      <Head>
        <title>PKSC12</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            PKSC12
          </h1>
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"> */}
          <div
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            // href="https://create.t3.gg/en/usage/first-steps"
          >
            <h3 className="text-2xl font-bold">Load .p12 file</h3>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="text-lg">
                  <input
                    type="file"
                    accept=".p12"
                    {...methods.register("contents")}
                  />
                </div>
                <div className="text-lg text-black">
                  <input
                    {...methods.register("password")}
                    placeholder="password"
                  />
                </div>
                <button
                  className={`${
                    // rsaMutation.isLoading ? "pointer-events-none" : ""
                    ""
                  } flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2`}
                  type="submit"
                >
                  <svg
                    className={`h-5 w-5 animate-spin ${
                      // !rsaMutation.isLoading ? "hidden" : ""
                      ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                  Analize key
                </button>
              </form>
            </FormProvider>
          </div>
          {/* </div> */}
        </div>
      </main>
    </>
  );
};

export default Home;
