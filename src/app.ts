import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import { envs } from "./config/env";

const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });

server.start();
