import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from 'typeorm';
import { IsNotEmpty, MinLength } from 'class-validator';
import { compare, genSalt, hash } from 'bcrypt';

@Entity({ name: 'users' })
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  @MinLength(6)
  username: string;

  @Column({ type: 'varchar', length: 50 })
  @MinLength(6)
  password: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  readonly createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  readonly updatedAt?: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await genSalt(10);
    this.password = await hash(this.password.trim(), salt);
  }

  checkPassword(password: string): Promise<boolean> {
    return compare(password.trim(), this.password.trim(), (err, same) => {
      console.log({ err, same });
    });
  }

}
