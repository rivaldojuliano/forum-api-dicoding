const CommentRepository = require('../CommentRepository');

describe('CommentsRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
