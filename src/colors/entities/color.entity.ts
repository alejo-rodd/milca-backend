import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Mug } from 'src/mugs/entities/mug.entity';

@Entity()
export class Color extends BaseEntity {
  @Column('text')
  name: string;

  @Column('text')
  code: string;

  @OneToMany(() => Mug, (mug) => mug.color)
  mugs?: Mug[];
}
