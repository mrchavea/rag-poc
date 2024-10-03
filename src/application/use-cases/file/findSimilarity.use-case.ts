import { LangChain_Adapter } from "@/infrastructure/adapters";
import { SingleFileDTO } from "@/infrastructure/dtos/singleFIle.dto";
import { QAModel } from "@/infrastructure/models/qa.model";
import { SummarizationModel } from "@/infrastructure/models/summarization.model";
import { Text2TextModel } from "@/infrastructure/models/text2text.model";
import { TokenClassificationModel } from "@/infrastructure/models/token-classification.model";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatDocumentsAsString } from "langchain/util/document";

export class FindSimilarityUseCase {
  async execute(singleFileDTO: SingleFileDTO): Promise<number> {
    try {
      console.log(singleFileDTO.file);
      //Get data from PDF
      //const resumeText = await LangChain_Adapter.PDFToText(singleFileDTO.file);
      const loader = new PDFLoader(singleFileDTO.file, { splitPages: false, parsedItemSeparator: "" });
      let docs = await loader.load();
      //Clean the data
      docs = docs.map((doc) => {
        doc.pageContent = doc.pageContent.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        return doc;
      });
      // const cleanedResumeText = resumeText.toLowerCase().replace("\n", ". ");
      const splitter = new RecursiveCharacterTextSplitter({ chunkOverlap: 200, chunkSize: 500 });

      const documents = await splitter.splitDocuments(docs);

      const embeddings = new HuggingFaceTransformersEmbeddings({
        model: "mixedbread-ai/mxbai-embed-large-v1",
        stripNewLines: true,
        pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
      });

      const vectorStore = await FaissStore.fromDocuments(documents, embeddings);
      //await vectorStore.save("./vector-store.pdf");

      const llm = new HuggingFaceInference({
        model: "meta-llama/Llama-3.2-1B",
        // stripNewLines: true,
        temperature: 0.1,
        verbose: true
        // pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
      });

      //const prompt = ChatPromptTemplate.fromTemplate(`As a human resources department assistant, answer the user's question: {input} based on the following context: {context}`);
      const prompt = ChatPromptTemplate.fromTemplate(
        `You are a human resources department assistant. Use the following pieces of retrieved context of a resumee to answer the question. If you don't know the answer, just say that you don't know. Do not to summarize, do not try to make up an answer and just write the answer.
              Question: {input}
              Context: {context}
              Answer:
              `
      );
      const combineDocsChain = await createStuffDocumentsChain({
        llm,
        prompt,
        outputParser: new StringOutputParser()
      });
      const retriever = vectorStore.asRetriever({ verbose: true, k: 6 });

      const retrievalChain = await createRetrievalChain({
        combineDocsChain,
        retriever
      });

      const context = retriever.pipe(formatDocumentsAsString);

      const answer = await retrievalChain.invoke({ input: "List all programming languages separated by comma like Java, Node, etc...", context: context });
      const answer2 = await retrievalChain.invoke({ input: "How many years of working experience in total has this person?", context: context });

      //Translate to english in order to take advantage of the LLMs models
      //const summarization = await (await SummarizationModel.getInstance()).summarizeText(cleanedResumeText);
      //Extract progamming languages with token classification
      // const qaModel = await QAModel.getInstance();
      // const languages = await qaModel.extractInfoWithInstructions("", cleanedResumeText);
      //(COULD IMPROVE PERFORMANCE) -> Get a briefing of the PDF with a model
      //(COULD IMPROVE PERFORMANCE) -> Create an agent to extract data prestablished like rol, years of experience and calculate cosine similarity to that reduced information
      //(COULD IMPROVE PERFORMANCE) -> Create text with a task description in order to generate more concise data

      // const text2textModelInstance = await Text2TextModel.getInstance();
      // const instruction: string = "List separated with commas all programming languages mentioned";
      // const extractedDetailsFromResume = await text2textModelInstance.extractInfoWithInstructions(instruction, resumeText);
      // //(COULD IMPROVE PERFORMANCE) -> Singleton with method to load models at beginning/Worker to load models
      // //(COULD IMPROVE PERFORMANCE) -> Worker for blocking calculations
      // //Create embeds of both texts
      // // console.log("EXTRACTED?", extractedDetailsFromResume);
      // const embeddedCV = await LangChain_Adapter.featureExtraction(resumeText);
      // const embeddedOfferDescription = await LangChain_Adapter.featureExtraction(singleFileDTO.offerDescription);
      // // Calculate vector similiraty with cosen difference
      // const similarityScore = LangChain_Adapter.calculateCosineSimilarity(embeddedCV, embeddedOfferDescription);
      // //const similarityScore = await LangChain_Adapter.calculateCosSimilarity(embeddedCV, embeddedOfferDescription);
      // console.log("Similarity Score:", similarityScore);
      // //Use Encoder-decoder to understand the offer description
      // console.log("EMBEDS", embeddedCV, embeddedOfferDescription);
      return null;
    } catch (error) {
      console.log(error);
    }
  }
}
