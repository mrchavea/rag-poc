import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import { envs } from "./config/env";
import { ModelManager } from "./infrastructure/models/model.manager";
import { CustomError } from "./domain/entities/error.entity";
import { ModelsProvider } from "./infrastructure/models/models.provider";
import { Text2TextModel } from "./infrastructure/models/text2text.model";
import { FeatureExtractionModel } from "./infrastructure/models/featureExtraction.model";
import { TokenClassificationModel } from "./infrastructure/models/token-classification.model";
import { QAModel } from "./infrastructure/models/qa.model";
import { SummarizationModel } from "./infrastructure/models/summarization.model";

(() => {
  main();
})();

async function main() {
  try {
    const server = new Server({ port: envs.PORT, routes: AppRoutes.routes });
    //await ModelsProvider.getInstance();
    //await FeatureExtractionModel.getInstance("mixedbread-ai/mxbai-embed-large-v1");
    // await Text2TextModel.getInstance("meta-llama/Llama-3.2-1B");
    //await SummarizationModel.getInstance("Xenova/distilbart-cnn-6-6");
    //await TokenClassificationModel.getInstance("dbmdz/bert-large-cased-finetuned-conll03-english");
    //await QAModel.getInstance("dbmdz/bert-large-cased-finetuned-conll03-english");
    //
    server.start();
  } catch (error) {
    console.error(error);
    throw CustomError.internalServer("Initialization error!");
  }
}
