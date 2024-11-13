const pool = require('../../database/postgres/pool');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const threadRequestPayload = {
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
      };

      const commentRequestPayload = {
        content: 'Lorem ipsum dolor sit amet',
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

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = thread.result.data.addedThread.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const threadRequestPayload = {
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
      };

      const commentRequestPayload = {};

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

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = thread.result.data.addedThread.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const threadRequestPayload = {
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
      };

      const commentRequestPayload = {
        content: ['Lorem ipsum dolor sit amet'],
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

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const threadId = thread.result.data.addedThread.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not exists', async () => {
      const loginRequestPayload = {
        username: 'rivaldojuliano',
        password: 'secret',
      };

      const commentRequestPayload = {
        content: 'Lorem ipsum dolor sit amet',
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
        url: '/threads/xxxx/comments',
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
