import { Router } from "express";
import { FileRoutes } from "./file/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    // router.use('/file', FileRoutes.routes);
    router.use("/file", FileRoutes.routes);
    return router;
  }
}
