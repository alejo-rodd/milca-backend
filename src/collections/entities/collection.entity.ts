import { BaseEntity } from 'src/common/entities/base.entity';
import { Mug } from 'src/mugs/entities/mug.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Collection extends BaseEntity {
  @Column('text')
  name: string;
  @Column('text')
  description: string;

  @OneToMany(() => Mug, (mug) => mug.collection)
  mugs?: Mug[];
}
