import { router } from "../trpc";
import { exampleRouter } from "./example";
import { p12Router } from "./p12";

export const appRouter = router({
  example: exampleRouter,
  p12: p12Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
