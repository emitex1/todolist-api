import express, { Request, Response, Router } from "express";
import { returnFailure, returnSuccess } from "../util/util";
import { CategoryItem } from "../entities/Category";
import { AppDataSource } from "../entities/dataSource";

const router: Router = express.Router();

router.get("/categories", async (req: Request, res: Response) => {
  const categoryItemRepository = AppDataSource.getRepository(CategoryItem);

  const categories = await categoryItemRepository.find();
  return returnSuccess(res, categories);
});

router.get("/category/:id", async (req: Request, res: Response) => {
  const categoryItemRepository = AppDataSource.getRepository(CategoryItem);

  const categoryId = Number(req.params.id);
  if (!categoryId) {
    return returnFailure(res, 400, "Category ID is required");
  }
  const category = await categoryItemRepository.findOneBy({ id: categoryId });
  if (!category) {
    return returnFailure(res, 404, "Category ID is not available");
  }
  return returnSuccess(res, category);
});

router.post("/category", async (req, res) => {
  try {
    const categoryItemRepository = AppDataSource.getRepository(CategoryItem);

    const preCategory = await categoryItemRepository.findOne({
      where: { title: req.body.title },
    });
    if (preCategory) {
      return returnFailure(res, 400, "Such a category already exists");
    }

    const count = await categoryItemRepository.count();

    const newCategory: CategoryItem = new CategoryItem();
    newCategory.id = count + 1;
    newCategory.title = req.body.title;
    newCategory.color = req.body.color;

    categoryItemRepository.create(newCategory);
    const result = await categoryItemRepository.save(newCategory);
    return returnSuccess(res, result);
  } catch (error) {
    return returnFailure(res, 500, "Error saving category" + error);
  }
});

export default router;
