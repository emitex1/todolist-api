import express, { Request, Response, Router } from "express";
import { returnFailure, returnSuccess } from "../util/util";
import { Author } from "../entities/Author";
import { AppDataSource } from "../entities/dataSource";

const router: Router = express.Router();

router.get("/authors", async (req: Request, res: Response) => {
  const authorRepository = AppDataSource.getRepository(Author);

  const authors = await authorRepository.find();
  return returnSuccess(res, authors);
});

router.get("/author/:id", async (req: Request, res: Response) => {
  const authorRepository = AppDataSource.getRepository(Author);

  const authorId = Number(req.params.id);
  if (!authorId) {
    return returnFailure(res, 400, "Author ID is required");
  }
  const author = await authorRepository.findOneBy({ id: authorId });
  if (!author) {
    return returnFailure(res, 404, "Such an author is not available");
  }
  return returnSuccess(res, author);
});

router.post("/author", async (req, res) => {
  try {
    const authorRepository = AppDataSource.getRepository(Author);

    const preAuthor = await authorRepository.findOne({
      where: { name: req.body.name },
    });
    if (preAuthor) {
      return returnFailure(res, 400, "Such an author already exists");
    }

    const count = await authorRepository.count();

    const newAuthor: Author = new Author();
    newAuthor.id = count + 1;
    newAuthor.name = req.body.name;
    newAuthor.fullName = req.body.fullName;

    authorRepository.create(newAuthor);
    const result = await authorRepository.save(newAuthor);
    return returnSuccess(res, result);
  } catch (error) {
    return returnFailure(res, 500, "Error saving author" + error);
  }
});

export default router;
