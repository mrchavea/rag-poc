import { CustomError } from "@/domain";

export class TokenClassificationModel {
  private static instance: TokenClassificationModel;
  model: any = undefined;

  private constructor() {}

  static async getInstance(modelName?: string): Promise<TokenClassificationModel> {
    if (!TokenClassificationModel.instance) {
      if (!modelName) throw new Error("First time needs the model name to be loaded");
      TokenClassificationModel.instance = new TokenClassificationModel();
      await TokenClassificationModel.instance.loadModel(modelName!);
    }
    return TokenClassificationModel.instance;
  }

  private async loadModel(modelName: string): Promise<void> {
    const { pipeline } = await import("@xenova/transformers");

    // Allocate pipeline
    const pipe = await pipeline("token-classification");
    this.model = pipe;
    console.info("The model was loaded: " + modelName);
  }

  getModel() {
    if (!this.model) throw new CustomError(500, "Error loading model");
    return this.model;
  }

  async extractProgrammingLanguages(text: string): Promise<unknown> {
    const programmingLanguages = ["JavaScript", "Python", "Java", "C++", "TypeScript", "Ruby", "PHP", "R", "Swift", "Go", "Kotlin", "Rust", "Scala"];
    try {
      const results = await this.model(text);
      const detectedLanguages = results.filter((entity) => programmingLanguages.includes(entity.word)).map((entity) => entity.word);
      return [...new Set(detectedLanguages)];
    } catch (error) {
      throw new CustomError(500, "Error extracting programming languages: " + error.message);
    }
  }
}
