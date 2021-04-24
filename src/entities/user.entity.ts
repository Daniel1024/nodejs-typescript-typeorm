import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert, BeforeUpdate
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { compare, genSalt, hash } from 'bcrypt';

@Entity({ name: 'users' })
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Column({ type: 'varchar', length: 250 })
  @MinLength(6)
  password: string;

  @Column({ type: 'varchar', length: 150 })
  @IsNotEmpty()
  role: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  readonly createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  readonly updatedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await genSalt(10);
      this.password = await hash(this.password.trim(), salt);
    }
  }

  async isWrongPassword(password: string): Promise<boolean> {
    const resp = await compare(password, this.password);
    return !resp;
  }

}
