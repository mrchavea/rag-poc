import { CustomError } from "@/domain";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

export class QAModel {
  private static instance: QAModel;
  model: any = undefined;

  private constructor() {}

  static async getInstance(modelName?: string): Promise<QAModel> {
    if (!QAModel.instance) {
      if (!modelName) throw new Error("First time needs the model name to be loaded");
      QAModel.instance = new QAModel();
      await QAModel.instance.loadModel(modelName!);
    }
    return QAModel.instance;
  }

  private async loadModel(modelName: string): Promise<void> {
    //mixedbread-ai/mxbai-embed-large-v1
    // const model = new HuggingFaceInference({
    //   model: modelName
    //   // stripNewLines: true,
    //   // pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
    // });
    const { pipeline } = await import("@xenova/transformers");

    // Allocate pipeline
    const pipe = await pipeline("question-answering", "Xenova/distilbert-base-uncased-distilled-squad");
    this.model = pipe;
    console.info("The model was loaded: " + modelName);
  }

  getModel() {
    if (!this.model) throw new CustomError(500, "Error loading model");
    return this.model;
  }

  async extractInfoWithInstructions(instruction: string, text: string): Promise<unknown> {
    const question = "List all the progamming languages mentioned";
    const context = text;
    try {
      return await this.model(question, context);
    } catch (error) {
      throw new CustomError(500, "Error extracting information: " + error.message);
    }
  }
}
