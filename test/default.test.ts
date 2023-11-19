import { test } from 'tap';
import { IPingResponseDto } from '@/modules/default/index.dto';
import { appInstance } from './app.instance';

test('request the root path: PING', async (t) => {
  const fastify = await appInstance();
  t.teardown(() => fastify.close());

  const response = await fastify.inject({
    method: 'GET',
    url: '/'
  });

  t.equal(response.statusCode, 200);

  const json: IPingResponseDto = response.json();

  t.equal(json.status, 'OK');
});
