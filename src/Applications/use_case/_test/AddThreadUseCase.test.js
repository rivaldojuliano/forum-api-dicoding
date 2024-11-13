const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Lorem ipsum',
      body: 'Lorem ipsum dolor sit amet',
      owner: 'user-123',
    };

    const mockAddThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'Rivaldo Juliano',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: 'Lorem ipsum',
      body: 'Lorem ipsum dolor sit amet',
      owner: 'user-123',
    }));
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: 'Lorem ipsum',
      owner: 'Rivaldo Juliano',
    }));
  });
});
