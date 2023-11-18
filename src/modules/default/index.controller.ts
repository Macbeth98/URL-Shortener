import { FastifyReply, FastifyRequest } from 'fastify';
import { IPingResponseDto } from './index.dto';

class IndexController {
  public static index = (req: FastifyRequest, reply: FastifyReply): void => {
    const { ip } = req;
    const response: IPingResponseDto = {
      status: 'OK',
      message: `Hello ${ip}, From URL Shortener`,
      timestamp: new Date().toISOString(),
      swagger: 'https://urlscut.co/api-docs'
    };
    reply.send(response);
  };
}

export default IndexController;
