import { test } from 'tap';
import { appInstance } from 'test/app.instance';
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';
import { RegisterRequestDto, RegisterResponseDto } from '@/modules/auth/dtos/auth.dto';

test('AUTH ROUTER `/auth/signup`', async () => {
  const fastify: FastifyInstance = await appInstance();
  const db: mongoose.mongo.Db = fastify.mongo;
  const logger = fastify.log;

  const mockUser: RegisterRequestDto = {
    email: 'mockuser@gmail.com',
    password: 'mockUser@123',
    username: 'MockUser'
  };

  const testsCount = 5;
  let testsDone = 0;

  const executeTearDown = async () => {
    logger.info('Teardown: Removing all users from the database');
    await db.collection('users').deleteMany({});
    await db.collection('auth').deleteMany({});
    fastify.close();
  };

  const checkForTearDown = async () => {
    testsDone += 1;
    if (testsDone === testsCount) {
      await executeTearDown();
    }
  };

  test('Success: signup a new user', async (t1) => {
    logger.info('t1: Success: signup a new user');

    const testUser = { ...mockUser };

    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: testUser
    });

    t1.equal(response.statusCode, 201);

    const json: RegisterResponseDto = response.json();

    const { user } = json;

    t1.equal(user.username, testUser.username.toLowerCase());
    t1.equal(user.email, testUser.email);
    t1.equal(user.displayUsername, testUser.username);

    t1.end();
    checkForTearDown();
  });

  test('Failure: signup a new user with invalid email', async (t2) => {
    logger.info('t2: Failure: signup a new user with invalid email');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        ...mockUser,
        email: 'mockuser'
      }
    });

    t2.equal(response.statusCode, 400);

    const json: RegisterResponseDto = response.json();

    t2.equal(json.status, false);
    t2.equal(json.message, 'email: Invalid Email');

    t2.end();
    checkForTearDown();
  });

  test('Failure: signup a new user with same email', async (t3) => {
    logger.info('t3: Failure: signup a new user with same email');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        ...mockUser,
        username: 'mockuser2'
      }
    });

    t3.equal(response.statusCode, 409);

    const json: RegisterResponseDto = response.json();

    t3.equal(json.status, false);
    t3.equal(json.message, 'Email already exists');

    t3.end();
    checkForTearDown();
  });

  test('Failure: signup a new user with same username', async (t4) => {
    logger.info('t4: Failure: signup a new user with same username');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        ...mockUser,
        email: 'mockuser2@gmail.com'
      }
    });

    t4.equal(response.statusCode, 409);

    const json: RegisterResponseDto = response.json();

    t4.equal(json.status, false);
    t4.equal(json.message, 'Username already exists');

    t4.end();
    checkForTearDown();
  });

  test('Failure: signup a new user with invalid password', async (t5) => {
    logger.info('t5: Failure: signup a new user with invalid password');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'mockuserpass@gmail.com',
        username: 'mockuserpass',
        password: 'password'
      }
    });

    t5.equal(response.statusCode, 400);

    const json: RegisterResponseDto = response.json();

    t5.equal(json.status, false);
    t5.equal(
      json.message,
      'password: password must minimum of 8 characters, 1 uppercase, lowercase, number and a special character'
    );

    t5.end();
    checkForTearDown();
  });
});
