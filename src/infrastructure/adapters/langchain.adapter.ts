import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
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

  static async featureExtraction(documents: string | Array<string>): Promise<number[]> {
    const transformers = await import("@xenova/transformers");
    const extractor = await transformers.pipeline("feature-extraction", "mixedbread-ai/mxbai-embed-large-v1", {
      quantized: true // Comment out this line to use the quantized version
    });
    const embed = await extractor(documents, { normalize: true, pooling: "mean" });
    return embed.tolist();
  }

  static async calculateCosSimilarity(embed_1: number[], embed_2: number[]): Promise<number> {
    const transformers = await import("@xenova/transformers");
    return transformers.cos_sim(embed_1, embed_2);
  }
}
