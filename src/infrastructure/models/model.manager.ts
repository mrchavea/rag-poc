import { Worker } from "worker_threads";
import path from "path";

const MODELS_WORKER = {
  "mixedbread-ai/mxbai-embed-large-v1": new Worker(path.resolve(__dirname, "./featureExtractionModel.worker.ts"), {
    execArgv: ["-r", "ts-node/register"]
  })
};

export class ModelManager {
  readonly modelName: string;
  readonly worker: any;

  constructor(modelName: string) {
    this.modelName = modelName;
    this.worker = MODELS_WORKER[this.modelName];
  }

  async loadModel() {
    return new Promise<void>((resolve, reject) => {
      this.worker.once("message", (msg) => {
        if (msg.status === "success") {
          console.log(msg.message || "Modelo cargado.");
          resolve();
        } else if (msg.status === "error") {
          console.error("Error en el worker:", msg.error);
          reject(new Error(msg.error));
        }
      });
      this.worker.postMessage({ action: "loadModel" });
    });
  }

  // Método para realizar la extracción de características
  async extractFeatures(document: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.worker.once("message", (msg) => {
        if (msg.status === "success") {
          resolve(msg.result);
        } else if (msg.status === "error") {
          reject(new Error(msg.error));
        }
      });
      this.worker.postMessage({ action: "featureExtraction", document });
    });
  }
}
