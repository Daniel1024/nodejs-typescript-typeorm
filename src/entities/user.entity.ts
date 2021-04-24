import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, MinLength } from 'class-validator';

@Entity()
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(6)
  username: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn({ name: 'created_at', precision: 3 })
  readonly createdAt?: Date;

  @Column()
  @UpdateDateColumn({ name: 'updated_at', precision: 3 })
  readonly updatedAt?: Date;

}
