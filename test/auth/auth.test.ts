/* eslint-disable @typescript-eslint/no-shadow */
import { t, test } from 'tap';
import { appInstance } from 'test/app.instance';
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';
import { LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from '@/modules/auth/dtos/auth.dto';
import { UserTier } from '@/utils/enum.type';

let fastify: FastifyInstance;
let db: mongoose.mongo.Db;
let logger: FastifyInstance['log'];

const initiateTest = async () => {
  fastify = await appInstance();
  db = fastify.mongo;
  logger = fastify.log;
};

const testsCount = 3;
let testsDone = 0;

const clearDatabase = async () => {
  await db.collection('users').deleteMany({});
  await db.collection('auth').deleteMany({});
};

const executeTearDown = async () => {
  logger.info('Teardown: Removing all users from the database');
  await clearDatabase();
  fastify.close();
};

const checkForTearDown = async () => {
  testsDone += 1;
  if (testsDone === testsCount) {
    await executeTearDown();
  }
};

t.before(async () => {
  await initiateTest();
  await clearDatabase();
});

const mockUser1: RegisterRequestDto = {
  email: 'mockuser@gmail.com',
  password: 'mockUser@123',
  username: 'MockUser'
};

const mockUser2: RegisterRequestDto = {
  email: 'mockuserlogin@gmail.com',
  password: 'mockUserLogin@123',
  username: 'MockUserLogin'
};

test('AUTH ROUTER `/auth/signup`', async () => {
  const testsCount = 5;
  let testsDone = 0;

  const callTearDown = async () => {
    await checkForTearDown();
  };

  const checkForCallTearDown = async () => {
    testsDone += 1;
    if (testsDone === testsCount) {
      await callTearDown();
    }
  };

  test('Success: signup a new user', async (t1) => {
    logger.info('t1: Success: signup a new user');

    const testUser = { ...mockUser1 };

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
    t1.equal(user.tier, 'FREE');

    t1.end();
    await checkForCallTearDown();
  });

  test('Failure: signup a new user with invalid email', async (t2) => {
    logger.info('t2: Failure: signup a new user with invalid email');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        ...mockUser1,
        email: 'mockuser'
      }
    });

    t2.equal(response.statusCode, 400);

    const json: RegisterResponseDto = response.json();

    t2.equal(json.status, false);
    t2.equal(json.message, 'email: Invalid Email');

    t2.end();
    await checkForCallTearDown();
  });

  test('Failure: signup a new user with same email', async (t3) => {
    logger.info('t3: Failure: signup a new user with same email');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        ...mockUser1,
        username: 'mockuser2'
      }
    });

    t3.equal(response.statusCode, 409);

    const json: RegisterResponseDto = response.json();

    t3.equal(json.status, false);
    t3.equal(json.message, 'Email already exists');

    t3.end();
    await checkForCallTearDown();
  });

  test('Failure: signup a new user with same username', async (t4) => {
    logger.info('t4: Failure: signup a new user with same username');
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        ...mockUser1,
        email: 'mockuser2@gmail.com'
      }
    });

    t4.equal(response.statusCode, 409);

    const json: RegisterResponseDto = response.json();

    t4.equal(json.status, false);
    t4.equal(json.message, 'Username already exists');

    t4.end();
    await checkForCallTearDown();
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
    await checkForCallTearDown();
  });
});

test('AUTH ROUTER `/auth/login`', async () => {
  const testsCount = 3;
  let testsDone = 0;

  const callTearDown = async () => {
    await checkForTearDown();
  };

  const checkForCallTearDown = async () => {
    testsDone += 1;
    if (testsDone === testsCount) {
      await callTearDown();
    }
  };

  const signupUser = async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: mockUser2
    });

    return response;
  };

  test('Success: login a user', async (t1) => {
    logger.info('t1: Success: login a user');

    const signupRes = await signupUser();

    t1.equal(signupRes.statusCode, 201);

    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: mockUser2.email,
        password: mockUser2.password
      }
    });

    t1.equal(response.statusCode, 200);

    // const json: LoginResponseDto = response.json();

    // const { user, tokenExpiresIn, status } = json;

    // t1.equal(status, 'OK');
    // t1.equal(user.email, mockUser.email);
    // t1.equal(user.username, mockUser.username.toLowerCase());
    // t1.equal(user.displayUsername, mockUser.username);
    // t1.equal(user.tier, 'FREE');
    // t1.equal(tokenExpiresIn, 3600);

    t1.end();
    await checkForCallTearDown();
  });

  test('Failure: login a user with invalid email', async (t2) => {
    logger.info('t2: Failure: login a user with invalid email');

    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'mockuser',
        password: mockUser2.password
      }
    });

    t2.equal(response.statusCode, 400);

    const json: LoginResponseDto = response.json();

    t2.equal(json.status, false);
    t2.ok(json.message.includes('email'));

    t2.end();
    await checkForCallTearDown();
  });

  test('Failure: login a user with invalid password', async (t3) => {
    logger.info('t3: Failure: login a user with invalid password');

    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: mockUser2.email,
        password: 'password'
      }
    });

    t3.equal(response.statusCode, 400);

    const json: LoginResponseDto = response.json();

    t3.equal(json.status, false);
    t3.ok(json.message.includes('password'));

    t3.end();
    await checkForCallTearDown();
  });
});

test('AUTH ROUTER `/auth/updateTier`', async () => {
  const testsCount = 1;
  let testsDone = 0;

  const callTearDown = async () => {
    await checkForTearDown();
  };

  const checkForCallTearDown = async () => {
    testsDone += 1;
    if (testsDone === testsCount) {
      await callTearDown();
    }
  };

  test('Success: update user tier', async (t1) => {
    logger.info('t1: Success: update user tier');

    const loginRes = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: mockUser2.email,
        password: mockUser2.password
      }
    });

    t1.equal(loginRes.statusCode, 200);

    const json: LoginResponseDto = loginRes.json();

    const { idToken } = json;

    const response = await fastify.inject({
      method: 'PUT',
      url: '/auth/updateTier',
      headers: {
        token: idToken
      },
      payload: {
        tier: UserTier.PRO
      }
    });

    t1.equal(response.statusCode, 200);

    const user: LoginResponseDto['user'] = response.json();

    t1.equal(user.email, mockUser2.email);
    t1.equal(user.username, mockUser2.username.toLowerCase());
    t1.equal(user.displayUsername, mockUser2.username);
    t1.equal(user.tier, UserTier.PRO);

    // Update MockUser1 to PREMIUM TIER

    const loginRes2 = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: mockUser1.email,
        password: mockUser1.password
      }
    });

    t1.equal(loginRes2.statusCode, 200);

    const response2 = await fastify.inject({
      method: 'PUT',
      url: '/auth/updateTier',
      headers: {
        token: loginRes2.json().idToken
      },
      payload: {
        tier: UserTier.PREMIUM
      }
    });

    t1.equal(response2.statusCode, 200);

    const user2: LoginResponseDto['user'] = response2.json();

    t1.equal(user2.email, mockUser1.email);
    t1.equal(user2.username, mockUser1.username.toLowerCase());
    t1.equal(user2.displayUsername, mockUser1.username);
    t1.equal(user2.tier, UserTier.PREMIUM);

    t1.end();
    await checkForCallTearDown();
  });
});
