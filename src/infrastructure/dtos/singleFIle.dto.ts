import { envs } from "@/config/env";
import { CustomError } from "@/domain/entities/error.entity";

export class SingleFileDTO {
  readonly file: Blob;
  readonly offerDescription: string;

  private constructor(file: Blob, offerDescription: string) {
    this.file = file;
    this.offerDescription = offerDescription;
  }

  static makeSingleFileDTO(file: Express.Multer.File, offerDescription: string): [string?, SingleFileDTO?] {
    if (!file) return ["File is required", null];
    if (file.size > envs.FILE_LIMIT_SIZE) return ["The file is too big", null];
    if (file.mimetype != "application/pdf") return ["The file is too big", null];
    if (offerDescription.length < 100) return ["Offer description is must be at least 100 characters", null];
    if (!offerDescription) return ["Offer description is required", null];
    const fileBlob = new Blob([file.buffer], { type: file.mimetype });
    return [null, new SingleFileDTO(fileBlob, offerDescription)];
  }
}
