import { z } from "zod";
import { p12Validator } from "../../../shared/pkcs12";
import { router, publicProcedure } from "../trpc";
import * as forge from "node-forge";
import * as crypto from "crypto";
import * as tls from "tls";

import fs from "fs/promises";

export const p12Router = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.pkcs12.findFirst({
        where: {
          id: input.id,
        },
        include: {
          privateKeys: true,
          certificates: true,
        },
      });
    }),
  addP12: publicProcedure
    .input(p12Validator)
    .mutation(async ({ input, ctx }) => {
      console.log("\n\n\n\n\n\n\n");
      const p12Asn1 = forge.asn1.fromDer(input.contents);
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, input.password);
      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const pkeyBags = p12.getBags({
        bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
      });
      // console.log(forge.pki.oids.certBag);
      // console.log(typeof forge.pki.oids.certBag);
      // console.log(forge.pki.oids.pkcs8ShroudedKeyBag);
      if (
        typeof forge.pki.oids.certBag === "string" &&
        typeof certBags !== "undefined" &&
        typeof forge.pki.oids.pkcs8ShroudedKeyBag === "string"
      ) {
        console.log(certBags[forge.pki.oids.certBag] instanceof Array);
        const certs = (
          certBags[forge.pki.oids.certBag] as Array<forge.pkcs12.Bag>
        ).map((certBag) => {
          const certificate = forge.pki.certificateToPem(
            certBag.cert as forge.pki.Certificate
          );
          console.log("******************************");
          const x509 = new crypto.X509Certificate(certificate);
          const cert = {
            issuer: x509.issuer,
            validFrom: x509.validFrom,
            validTo: x509.validTo,
            publicKey: x509.publicKey.asymmetricKeyType! as string,
            subject: x509.subject,
            raw: certificate,
          };
          console.log(cert);
          console.log("******************************");
          return cert;
        });
        const pkeys = (
          pkeyBags[
            forge.pki.oids.pkcs8ShroudedKeyBag
          ] as Array<forge.pkcs12.Bag>
        ).map((keyBag) => {
          const pkeyString = forge.pki.privateKeyToPem(
            keyBag.key as forge.pki.PrivateKey
          );
          if (!pkeyString.includes("PRIVATE KEY")) {
            throw new Error("Not a private key");
          }
          const pKey = crypto.createPrivateKey({
            key: pkeyString,
            format: "pem",
          });
          if (pKey === null) {
            throw new Error("Invalid format for private key");
          }
          const pJwk = pKey.export({ format: "jwk" });
          console.log("*********==========*************");
          const pkey = {
            type: pKey.type as string,
            raw: pkeyString,
            asymmetricKeyType: pKey.asymmetricKeyType!,
            modulusLength: pKey.asymmetricKeyDetails!.modulusLength!.toString(),
            publicExponent:
              pKey.asymmetricKeyDetails!.publicExponent!.toString(),
            privateExponent: pJwk.d!,
            firstPrimeFactor: pJwk.p!,
            secondPrimeFactor: pJwk.q!,
            firstExponent: pJwk.dp!,
            secondExponent: pJwk.dq!,
            coefficient: pJwk.qi!,
          };
          console.log(pkey);
          console.log("*********==========*************");
          return pkey;
        });
        const pksc12 = await ctx.prisma.pkcs12.create({
          data: {
            certificates: {
              create: certs,
            },
            privateKeys: {
              create: pkeys,
            },
          },
        });
        return pksc12;
      }
      throw new Error("Undefined values");
    }),
});
