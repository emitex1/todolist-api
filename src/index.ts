import express, { Request, Response } from "express";
import taskRoutes from "./routes/taskItem";
import categoryRoutes from "./routes/category";
import authorRoutes from "./routes/author";
import cors from "cors";

const app = express();
const port = 3002;

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    // Check if the origin is localhost or matches the netlify domain pattern
    if (
      !origin ||
      origin === "http://localhost:3000" ||
      origin.match(/^https:\/\/[a-z0-9-]+\.netlify\.app$/)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TodoList Apis!");
});

app.use("/api/", taskRoutes);
app.use("/api/", categoryRoutes);
app.use("/api/", authorRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
