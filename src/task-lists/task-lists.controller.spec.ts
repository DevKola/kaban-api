import { Test, TestingModule } from '@nestjs/testing';
import { TaskListsController } from './task-lists.controller';
import { TaskListsService } from './task-lists.service';

describe('TaskListsController', () => {
  let controller: TaskListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskListsController],
      providers: [TaskListsService],
    }).compile();

    controller = module.get<TaskListsController>(TaskListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
