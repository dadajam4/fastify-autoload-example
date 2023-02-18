import { FastifyInstance, FastifyReply } from 'fastify';
import { IController } from 'virtual:controllers';

export abstract class BaseController implements IController {
  constructor() {
    this.register = this.register.bind(this);
  }

  abstract register(app: FastifyInstance): void;

  protected setContentType(reply: FastifyReply, type = 'application/json', status = 200) {
    reply.type(type).code(status);
  }
}
