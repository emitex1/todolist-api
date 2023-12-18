import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskItem } from "./TaskItem";
import { CategoryItem } from "./Category";
import { Author } from "./Author";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [TaskItem, CategoryItem, Author],
  synchronize: true,
  logging: false,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) =>
    console.log("Error in data source initialization, ", error)
  );
