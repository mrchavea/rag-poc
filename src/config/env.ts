import "dotenv/config";
import env from "env-var";

export const envs = {
  PORT: env.get("PORT").required().asPortNumber(),
  FILE_LIMIT_SIZE: env.get("FILE_LIMIT_SIZE").default(1_500_000).asIntPositive()
};
