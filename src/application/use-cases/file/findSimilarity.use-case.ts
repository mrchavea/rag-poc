import { LangChain_Adapter } from "@/infrastructure/adapters";
import { SingleFileDTO } from "@/infrastructure/dtos/singleFIle.dto";

export class FindSimilarityUseCase {
  async execute(singleFileDTO: SingleFileDTO): Promise<number> {
    console.log(singleFileDTO.file);
    //Get data from PDF
    const resumeText = await LangChain_Adapter.PDFToText(singleFileDTO.file);
    //(COULD IMPROVE PERFORMANCE) -> Get a briefing of the PDF with a model
    //(COULD IMPROVE PERFORMANCE) -> Create text with a task description in order to generate more concise data
    //(COULD IMPROVE PERFORMANCE) -> Singleton with method to load models at beginning/Worker to load models
    //(COULD IMPROVE PERFORMANCE) -> Worker for blocking calculations
    //Create embeds of both texts
    const embeddedCV = await LangChain_Adapter.featureExtraction(resumeText);
    const embeddedOfferDescription = await LangChain_Adapter.featureExtraction(singleFileDTO.offerDescription);
    // Calculate vector similiraty with cosen difference
    const similarityScore = LangChain_Adapter.calculateCosineSimilarity(embeddedCV, embeddedOfferDescription);
    //const similarityScore = await LangChain_Adapter.calculateCosSimilarity(embeddedCV, embeddedOfferDescription);
    console.log("Similarity Score:", similarityScore);
    //Use Encoder-decoder to understand the offer description
    console.log("EMBEDS", embeddedCV, embeddedOfferDescription);
    return similarityScore;
  }
}
