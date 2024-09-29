import { multerAdapterInstance } from "@/infrastructure/adapters";
import { Router } from "express";
import { FileController } from "./controller";

export class FileRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new FileController();
    router.post("/single", multerAdapterInstance.singleFile("resume"), controller.findSimilarity);
    return router;
  }
}
