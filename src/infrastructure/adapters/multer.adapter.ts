import { RequestHandler } from "express";
import multer, { Multer } from "multer";

class MulterAdapter {
  readonly upload: Multer;

  constructor() {
    this.upload = multer({ storage: multer.memoryStorage() });
  }

  singleFile(fieldName: string): RequestHandler {
    return (req, res, next) => {
      this.upload.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: "File field not found" });
          }
          return res.status(400).json({ error: `Multer error: ${err.message}` });
        }
        next(err); // Llama a next si hay un error diferente para que pueda ser manejado globalmente
      });
    };
  }
}

export const multerAdapterInstance = new MulterAdapter();
