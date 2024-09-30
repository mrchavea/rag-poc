import { MODELS_TYPES } from "@/domain";
import { ModelManager } from "./model.manager";

const MODELS: { [key in MODELS_TYPES]: string } = {
  [MODELS_TYPES.featureExtraction]: "mixedbread-ai/mxbai-embed-large-v1"
};

export class ModelsProvider {
  private static instance: ModelsProvider;
  readonly loadedModels: { [key in MODELS_TYPES]?: ModelManager } = {};

  private constructor() {}

  static async getInstance(): Promise<ModelsProvider> {
    if (!ModelsProvider.instance) {
      ModelsProvider.instance = new ModelsProvider();
      await ModelsProvider.instance.loadModels();
    }
    return ModelsProvider.instance;
  }

  private async loadModels(): Promise<void> {
    await Promise.all(
      (Object.keys(MODELS) as MODELS_TYPES[]).map(async (modelType) => {
        const model = new ModelManager(MODELS[modelType]);
        await model.loadModel();
        this.loadedModels[modelType] = model;
      })
    );
  }

  getModel(modelType: MODELS_TYPES): ModelManager {
    const model = this.loadedModels[modelType];
    if (!model) throw new Error("Model not loaded");
    return model;
  }
}
