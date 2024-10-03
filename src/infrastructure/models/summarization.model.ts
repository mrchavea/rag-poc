import { CustomError } from "@/domain";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

export class SummarizationModel {
  private static instance: SummarizationModel;
  model: any = undefined;

  private constructor() {}

  static async getInstance(modelName?: string): Promise<SummarizationModel> {
    if (!SummarizationModel.instance) {
      if (!modelName) throw new Error("First time needs the model name to be loaded");
      SummarizationModel.instance = new SummarizationModel();
      await SummarizationModel.instance.loadModel(modelName!);
    }
    return SummarizationModel.instance;
  }

  private async loadModel(modelName: string): Promise<void> {
    const { pipeline } = await import("@xenova/transformers");

    // Allocate pipeline
    const pipe = await pipeline("summarization");
    this.model = pipe;
    console.info("The model was loaded: " + pipe.name);
  }

  getModel() {
    if (!this.model) throw new CustomError(500, "Error loading model");
    return this.model;
  }

  async summarizeText(text: string): Promise<string> {
    try {
      return await this.model(text);
    } catch (error) {
      throw new CustomError(500, "Error with summarization: " + error.message);
    }
  }
}
