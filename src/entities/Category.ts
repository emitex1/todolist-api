import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TaskItem } from "./TaskItem";

@Entity()
export class CategoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  title: string;

  @Column({
    length: 7,
  })
  color: string;

  @OneToMany(() => TaskItem, (taskItem) => taskItem.categoryItem)
  taskItems: TaskItem[];
}
