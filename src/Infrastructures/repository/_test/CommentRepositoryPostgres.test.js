const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comments and return added comments correctly', async () => {
      await UsersTableTestHelper.addUser({
        username: 'rivaldojuliano',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Lorem ipsum',
      });

      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Lorem ipsum dolor sit amet',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      const comment = await CommentTableTestHelper.findCommentById('comment-123');

      expect(comment).toHaveLength(1);
    });

    it('should return added comments correctly', async () => {
      await UsersTableTestHelper.addUser({
        username: 'rivaldojuliano',
      });

      await ThreadsTableTestHelper.addThread({
        title: 'Lorem ipsum',
      });

      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Lorem ipsum dolor sit amet',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
    });
  });
});
