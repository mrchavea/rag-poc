import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { parentPort } from "worker_threads";

let extractionModel: HuggingFaceTransformersEmbeddings;

// Esta es la lógica para cargar el modelo
async function loadModel() {
  try {
    extractionModel = new HuggingFaceTransformersEmbeddings({
      model: "mixedbread-ai/mxbai-embed-large-v1",
      stripNewLines: true,
      pipelineOptions: { normalize: true, quantize: false, pooling: "mean" }
    });
    parentPort?.postMessage({ status: "success", message: "Model loaded successfully." });
  } catch (error) {
    parentPort?.postMessage({ status: "error", error: error.message });
  }
}

async function featureExtraction(document) {
  if (!extractionModel) {
    throw new Error("Model not loaded");
  }
  try {
    const result = await extractionModel.embedQuery(document);
    parentPort?.postMessage({ status: "success", result });
  } catch (error) {
    parentPort?.postMessage({ status: "error", error: error.message });
  }
}

parentPort?.on("message", async (msg) => {
  if (msg.action === "loadModel") {
    await loadModel();
  } else if (msg.action === "featureExtraction") {
    const { document } = msg;
    await featureExtraction(document);
  }
});

// Iniciar la carga del modelo al inicio
loadModel();
