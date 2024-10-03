import { CustomError } from "@/domain";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

export class Text2TextModel {
  private static instance: Text2TextModel;
  model: any = undefined;

  private constructor() {}

  static async getInstance(modelName?: string): Promise<Text2TextModel> {
    if (!Text2TextModel.instance) {
      if (!modelName) throw new Error("First time needs the model name to be loaded");
      Text2TextModel.instance = new Text2TextModel();
      await Text2TextModel.instance.loadModel(modelName!);
    }
    return Text2TextModel.instance;
  }

  private async loadModel(modelName: string): Promise<void> {
    //mixedbread-ai/mxbai-embed-large-v1
    const model = new HuggingFaceInference({
      model: "meta-llama/Llama-3.2-1B",
      // stripNewLines: true,
      temperature: 0.6,
      verbose: true
      // pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
    });

    // Allocate pipeline
    this.model = model;
    console.info("The model was loaded: " + model.getName());
  }

  getModel() {
    if (!this.model) throw new CustomError(500, "Error loading model");
    return this.model;
  }

  async extractInfoWithInstructions(instruction: string, text: string): Promise<unknown> {
    // const promptTemplate = new PromptTemplate({
    //   template: `${instruction} en el siguiente texto:
    // {input}`,
    //   inputVariables: ["input"]
    // });
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["ai", "You are a human resources department assistant"],
      ["user", `${instruction} in this text: {input}`]
    ]);
    try {
      const chain = promptTemplate.pipe(this.model);
      return await chain.invoke({ input: text });
      // const prompt = `context: you are an assistant for a human resources department, question:${instruction} in the following resume :\n${text}`;
      // try {
      //   const result = await this.model(prompt);
      //   return result;
      // } catch (error) {
      //   throw new CustomError(500, "Error extracting information: " + error.message);
      // }
    } catch (error) {
      console.log("Error with text generation: \n" + error);
    }
  }
}
