import { LangChain_Adapter } from "@/infrastructure/adapters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

export class FindSimilarityUseCase {
  readonly pdf_file: Blob;
  readonly offerDescription: string;

  constructor(pdf_file: Blob, offerDescription: string) {
    this.pdf_file = pdf_file;
    this.offerDescription = offerDescription;
  }

  async execute() {
    console.log(this.pdf_file);
    //Get data from PDF
    const offerDescriptionText = await LangChain_Adapter.PDFToText(this.pdf_file);
    const extractionModel = new HuggingFaceTransformersEmbeddings({
      model: "Xenova/all-MiniLM-L6-v2",
      stripNewLines: true
    });
    //(COULD IMPROVE PERFORMANCE) -> Get a briefing of the PDF with a model
    //Create embeds of both texts
    // const embeddedCV = await extractionModel.embedQuery(textContent);
    // const embeddedOfferDescription = await extractionModel.embedQuery(this.offerDescription);
    const embeddedOfferDescription = await LangChain_Adapter.featureExtraction(this.offerDescription);
    const embeddedCV = await LangChain_Adapter.featureExtraction(offerDescriptionText);

    //Calculate vector similiraty with cosen difference
    //const similarityScore = this.calculateCosineSimilarity(embeddedCV, embeddedOfferDescription);
    const similarityScore = LangChain_Adapter.calculateCosSimilarity(embeddedCV, embeddedOfferDescription);
    console.log("Similarity Score:", similarityScore);
    //Use Encoder-decoder to understand the offer description
    console.log("EMBEDS", embeddedCV, embeddedOfferDescription);
  }

  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = this.dot(vectorA, vectorB);
    const normA = this.norm(vectorA);
    const normB = this.norm(vectorB);
    return dotProduct / (normA * normB);
  }

  private dot(vectorA: number[], vectorB: number[]): number {
    return vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  }

  private norm(vector: number[]): number {
    return Math.sqrt(vector.reduce((sum, a) => sum + a * a, 0));
  }
}
