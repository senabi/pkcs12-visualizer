import { z } from "zod";

export const p12Validator = z.object({
  contents:
    typeof window === "undefined"
      ? z.string()
      : z.instanceof(FileList).transform(async (fileList, ctx) => {
          const f = fileList.item(0);
          if (f === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "No file specified",
            });
            return z.NEVER;
          }
          const isPemFile = f.name.includes(".p12");
          if (!isPemFile) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Not a .p12 file",
            });
            return z.NEVER;
          }
          const getBinaryString = () =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsBinaryString(f);
              reader.onload = () => {
                const binaryString = reader.result;
                if (binaryString === null) {
                  reject("Error");
                }
                resolve(binaryString!);
              };
            });
          const binary = (await getBinaryString()) as string;
          return binary;
        }),
  password: z.string(),
});

export type P12FileValidator = z.infer<typeof p12Validator>;
