const pool = require('../../database/postgres/pool');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const threadRequestPayload = {
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rivaldojuliano',
          password: 'secret',
          fullname: 'Rivaldo Juliano',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload,
      });

      const { accessToken } = auth.result.data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const threadRequestPayload = {
        title: 'Lorem ipsum',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rivaldojuliano',
          password: 'secret',
          fullname: 'Rivaldo Juliano',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload,
      });

      const { accessToken } = auth.result.data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const threadRequestPayload = {
        title: 'Lorem ipsum',
        body: ['Lorem ipsum dolor sit amet'],
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rivaldojuliano',
          password: 'secret',
          fullname: 'Rivaldo Juliano',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginRequestPayload,
      });

      const { accessToken } = auth.result.data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 401 without authentication', async () => {
      const threadRequestPayload = {
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'rivaldojuliano',
          password: 'secret',
          fullname: 'Rivaldo Juliano',
        },
      });

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
