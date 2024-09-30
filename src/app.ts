import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import { envs } from "./config/env";
import { ModelManager } from "./infrastructure/models/model.manager";
import { CustomError } from "./domain/entities/error.entity";
import { ModelsProvider } from "./infrastructure/models/models.provider";

(() => {
  main();
})();

async function main() {
  try {
    const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });
    await ModelsProvider.getInstance();
    server.start();
  } catch (error) {
    console.error(error);
    throw CustomError.internalServer("Initialization error!");
  }
}
