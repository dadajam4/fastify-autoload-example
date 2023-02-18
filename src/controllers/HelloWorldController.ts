import { FastifyInstance } from 'fastify';
import { BaseController } from './_BaseController';

export class HelloWorldController extends BaseController {
  register(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
      this.setContentType(reply);
      return {
        message: 'Hello world!!!',
      }
    });
    app.get('/hoge/:id', async (request, reply) => {
      this.setContentType(reply);
      const id = (request.params as any).id;
      return {
        message: `This is hoge. ID is "${id}"`,
      }
    });
  }
}

export default HelloWorldController;
