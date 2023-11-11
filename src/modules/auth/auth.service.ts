import { compare } from 'bcrypt';

import { LoginUser } from '@modules/auth/auth.interface';

import { NotFound, Unauthorized } from '@exceptions/error';
import { FastifyInstance, FastifyReply } from 'fastify';
import mongoose from 'mongoose';

class AuthService {
  private db: typeof mongoose.connection.db;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.mongo;
  }

  public async LoginUser(loginData: LoginUser, reply: FastifyReply) {
    const findUser = await this.db.collection('users').findOne({ email: loginData.email });

    if (!findUser) {
      throw new NotFound('User not found');
    }

    // compare hashed and password
    const isPasswordMatching: boolean = await compare(loginData.password, findUser.password).catch(() => false);

    if (!isPasswordMatching) {
      throw new Unauthorized('Incorrect login credentials');
    }

    // example jwt
    const accessToken = await reply.jwtSign(
      {
        id: findUser.id,
        email: findUser.email
      },
      { sign: { expiresIn: '15m' } }
    );

    return { accessToken };
  }
}

export default AuthService;
