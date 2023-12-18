import express, { Request, Response, Router } from "express";
import { returnFailure, returnSuccess } from "../util/util";
import { CategoryItem } from "../entities/Category";
import { Author } from "../entities/Author";
import { TaskItem } from "../entities/TaskItem";
import { AppDataSource } from "../entities/dataSource";

const router: Router = express.Router();

router.get("/tasks", async (req: Request, res: Response) => {
  const taskItemRepository = AppDataSource.getRepository(TaskItem);

  const isDone = req.query.isDone;
  if (isDone === undefined) {
    const tasks = await taskItemRepository.find({
      relations: {
        categoryItem: true,
        author: true,
      },
    });
    return returnSuccess(res, tasks);
  }

  const filteredTasks = await taskItemRepository.find({
    where: { isDone: isDone === "true" },
    relations: {
      categoryItem: true,
      author: true,
    },
  });
  return returnSuccess(res, filteredTasks);
});

router.get("/task/:id", async (req: Request, res: Response) => {
  const taskItemRepository = AppDataSource.getRepository(TaskItem);

  const taskItemId = req.params.id;
  if (!taskItemId) {
    return returnFailure(res, 400, "Task ID is required");
  }

  const taskItem = await taskItemRepository.findOneBy({
    id: taskItemId,
  });
  if (!taskItem) {
    return returnFailure(res, 404, "Such a task is not available");
  }

  return returnSuccess(res, taskItem);
});

router.get("/task/:id/toggleDone", async (req: Request, res: Response) => {
  const taskItemRepository = AppDataSource.getRepository(TaskItem);

  const taskItemId = req.params.id;
  if (!taskItemId) {
    return returnFailure(res, 400, "Task ID is required");
  }

  const taskItem = await taskItemRepository.findOneBy({
    id: taskItemId,
  });
  if (!taskItem) {
    return returnFailure(res, 404, "Such a task is not available");
  }

  try {
    const newDoneStatus = !taskItem.isDone;
    taskItem.isDone = newDoneStatus;
    const result = await taskItemRepository.update(
      { id: taskItemId },
      { isDone: newDoneStatus }
    );

    if (result.affected === 1) {
      return returnSuccess(res, taskItem);
    } else {
      return returnFailure(res, 500, "No row affected");
    }
  } catch (error) {
    return returnFailure(res, 500, "Error while updating task " + error);
  }
});

router.post("/task", async (req, res) => {
  const categoryId = req.body.categoryId;
  if (!categoryId) {
    return returnFailure(res, 400, "Category ID is required");
  }
  const categoryItemRepository = AppDataSource.getRepository(CategoryItem);
  const category = await categoryItemRepository.findOneBy({
    id: categoryId,
  });
  if (!category) {
    return returnFailure(res, 404, "Such a category is not available");
  }

  const authorId = req.body.authorId;
  if (!authorId) {
    return returnFailure(res, 400, "Author ID is required");
  }
  const authorRepository = AppDataSource.getRepository(Author);
  const author = await authorRepository.findOneBy({
    id: authorId,
  });
  if (!author) {
    return returnFailure(res, 404, "Such an author is not available");
  }

  try {
    const newTask = new TaskItem(req.body.title, category, author);
    const taskItemRepository = AppDataSource.getRepository(TaskItem);
    taskItemRepository.create(newTask);
    const result = await taskItemRepository.save(newTask);
    return returnSuccess(res, result);
  } catch (error) {
    return returnFailure(res, 500, "Error saving task" + error);
  }
});

export default router;
