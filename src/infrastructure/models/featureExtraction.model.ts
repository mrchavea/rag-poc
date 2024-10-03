import { CustomError } from "@/domain";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

export class FeatureExtractionModel {
  private static instance: FeatureExtractionModel;
  model: HuggingFaceTransformersEmbeddings = undefined;

  private constructor() {}

  static async getInstance(modelName?: string): Promise<FeatureExtractionModel> {
    if (!FeatureExtractionModel.instance) {
      if (!modelName) throw new Error("First time needs the model name to be loaded");
      FeatureExtractionModel.instance = new FeatureExtractionModel();
      await FeatureExtractionModel.instance.loadModel(modelName!);
    }
    return FeatureExtractionModel.instance;
  }

  private async loadModel(modelName: string): Promise<void> {
    //mixedbread-ai/mxbai-embed-large-v1
    const model = new HuggingFaceTransformersEmbeddings({
      model: modelName,
      stripNewLines: true,
      pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
    });
    this.model = model;
    console.info("The model was loaded: " + modelName);
  }

  getModel() {
    if (!this.model) throw new CustomError(500, "Error loading model");
    return this.model;
  }
}
