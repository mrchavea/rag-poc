import { FindSimilarityUseCase } from "@/application/use-cases/file/findSimilarity.use-case";
import { CustomError } from "@/domain/entities/error.entity";
import { SingleFileDTO } from "@/infrastructure/dtos/singleFIle.dto";
import { Utils } from "@/lib/utils";
import { Request, Response } from "express";

export class FileController {
  findSimilarity = async (req: Request, res: Response): Promise<void> => {
    const { file } = req;
    const { offerDescription }: { offerDescription: string } = req.body;
    try {
      const [error, singleFileDTO] = SingleFileDTO.makeSingleFileDTO(file, offerDescription);
      if (error) throw new CustomError(400, error);
      const similarity = await new FindSimilarityUseCase().execute(singleFileDTO);
      if (!similarity) {
        res.sendStatus(500);
        return;
      }
      res.status(200).json({ similarity: similarity });
    } catch (error: unknown) {
      Utils.handleError(error, res);
    }
  };
}
