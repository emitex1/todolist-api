import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CategoryItem } from "./Category";
import { Author } from "./Author";

@Entity()
export class TaskItem {
  constructor(title: string, category: CategoryItem, author: Author) {
    this.title = title || "";
    this.isDone = false;
    this.creationDate = Date.now() / 1000;
    this.categoryItem = category;
    this.author = author;
  }

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    length: 50,
  })
  title: string;

  @Column({})
  isDone: boolean;

  @Column({})
  creationDate: number;

  @ManyToOne(() => CategoryItem, (categoryItem) => categoryItem.taskItems)
  categoryItem: CategoryItem;

  @ManyToOne(() => Author, (author) => author.taskItems)
  author: Author;
}
