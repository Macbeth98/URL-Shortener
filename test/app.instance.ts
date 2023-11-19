import App from '@/app';

export const appInstance = async () => {
  const app = new App();
  await app.init();
  const fastify = app.getServer();
  return fastify;
};
