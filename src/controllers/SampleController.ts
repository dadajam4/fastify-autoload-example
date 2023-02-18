import { FastifyInstance } from 'fastify';
import { BaseController } from './_BaseController';

export class SampleController extends BaseController {
  register(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
      this.setContentType(reply);
      return {
        message: 'これはサンプルコントローラです。',
      }
    });
  }
}

export default SampleController;
