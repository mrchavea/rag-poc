import express, { Router } from "express";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private options: Options;
  private app = express();

  constructor(options: Options) {
    this.options = options;
  }

  async start(): Promise<void> {
    this.setUpMiddleware();
    this.app.use(this.options.routes);
    this.app.listen(this.options.port, () => {
      console.info("Server has started on port: ", this.options.port);
    });
  }

  private setUpMiddleware(): void {
    this.app.use(express.json());
  }
}
