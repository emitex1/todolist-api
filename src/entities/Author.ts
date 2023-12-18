import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TaskItem } from "./TaskItem";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    length: 150,
    nullable: true,
  })
  fullName: string;

  @OneToMany(() => TaskItem, (taskItem) => taskItem.author)
  taskItems: TaskItem[];
}
