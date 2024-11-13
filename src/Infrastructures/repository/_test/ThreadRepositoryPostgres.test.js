const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        username: 'rivaldojuliano',
      });

      const newThread = new NewThread({
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(newThread);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        username: 'rivaldojuliano',
      });

      const newThread = new NewThread({
        title: 'Lorem ipsum',
        body: 'Lorem ipsum dolor sit amet',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.owner,
      }));
    });
  });

  describe('verifyThreadExists', () => {
    it('should throw Invariant when thread not exists', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists('xxxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw InvariantError when thread exists', async () => {
      await UsersTableTestHelper.addUser({
        username: 'rivaldojuliano',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Lorem ipsum',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
