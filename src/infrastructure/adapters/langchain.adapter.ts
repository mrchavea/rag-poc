import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ModelsProvider } from "../models/models.provider";
import { CustomError, MODELS_TYPES } from "@/domain";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
//import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
//import { pipeline, cos_sim } from "@xenova/transformers";
// import { pipeline, cos_sim } from "@xenova/transformers";

/**
 * This class is useful to interact with LLMs and create intelligent tasks related to text
 * @class LangChain_Adapter
 * @property {any} model - Represents the model is about to use
 */
export class LangChain_Adapter {
  readonly model;

  constructor(model: any) {
    this.model = model;
  }

  static async PDFToText(blobFile: Blob): Promise<string> {
    const loader = new PDFLoader(blobFile, { splitPages: false });
    const doc = await loader.load();
    return doc[0].pageContent;
  }

  static async featureExtraction(document: string): Promise<number[]> {
    const extractionModel = new HuggingFaceTransformersEmbeddings({
      model: "mixedbread-ai/mxbai-embed-large-v1",
      stripNewLines: true,
      pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
    });
    return await extractionModel.embedQuery(document);
  }

  // static async featureExtraction(document: string): Promise<number[]> {
  //   try {
  //     const extractionModel = (await ModelsProvider.getInstance()).getModel(MODELS_TYPES.featureExtraction);
  //     return await extractionModel.extractFeatures(document);
  //   } catch (error) {
  //     throw new CustomError(500, "Ha habido un error inesperado con el modelo");
  //   }
  // }

  static calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const normA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
  }
}
