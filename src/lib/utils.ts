import { CustomError } from "@/domain/entities/error.entity";
import { Response } from "express";

export class Utils {
  static handleError = (error: unknown, res: Response): Response => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  };
}
