import { FindSimilarityUseCase } from "@/application/use-cases/file/findSimilarity.use-case";
import { envs } from "@/config/env";
import { CustomError } from "@/domain/entities/error.entity";
import { Utils } from "@/lib/utils";
import { Request, Response } from "express";

export class FileController {
  findSimilarity = async (req: Request, res: Response): Promise<void> => {
    const { file } = req;
    const { offerDescription } = req.body;
    try {
      //TODO: Create DTO with validations
      if (!file) throw new CustomError(400, "File is required");
      if (file.size > envs.FILE_LIMIT_SIZE) throw new CustomError(400, "The file is too big");
      if (!offerDescription) throw new CustomError(400, "Offer description is required");
      const fileBlob = new Blob([file.buffer], { type: file.mimetype });
      new FindSimilarityUseCase(fileBlob, offerDescription).execute();
      res.sendStatus(200);
    } catch (error: unknown) {
      Utils.handleError(error, res);
    }
  };
}
