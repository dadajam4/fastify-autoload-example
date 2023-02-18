
declare module "virtual:controllers" {
  import type { FastifyInstance } from 'fastify';

  export interface IController {
    register(app: FastifyInstance): void;
  }

  export interface IControllerStatic {
    new(): IController;
  }

  export interface IControllerLoaded {
    prefix: string;
    Controller: IControllerStatic;
  }

  const LoadedArray: IControllerLoaded[];

  export default LoadedArray;
}
