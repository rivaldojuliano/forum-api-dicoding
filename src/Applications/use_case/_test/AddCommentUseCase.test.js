const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'Lorem ipsum dolor sit amet',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comments-123',
      content: useCasePayload.content,
      owner: 'Rivaldo Juliano',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: 'thread-123',
      content: 'Lorem ipsum dolor sit amet',
      owner: 'user-123',
    }));

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comments-123',
      content: 'Lorem ipsum dolor sit amet',
      owner: 'Rivaldo Juliano',
    }));
  });
});
