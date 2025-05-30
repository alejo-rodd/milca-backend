import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Mug } from './mug.entity';

@Entity()
export class MugImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  image: string;

  @ManyToOne(() => Mug, (mug) => mug.images, { onDelete: 'CASCADE' })
  mug: Mug;
}
