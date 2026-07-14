import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Unique, always stored lower-case */
  @Column({ type: 'varchar', unique: true, length: 320 })
  email: string;

  /** bcrypt hash — excluded from all serialized responses via @Exclude() */
  @Exclude()
  @Column({ type: 'varchar', length: 90, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  /** Soft-ban / deactivation flag */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
