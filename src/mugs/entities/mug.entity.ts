import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MugImage } from './mug-image.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Color } from 'src/colors/entities/color.entity';
import { DetailOrder } from 'src/purchase-orders/entities/detail-order.entity';

@Entity()
export class Mug extends BaseEntity {
  @Column('text')
  title: string;

  @Column('text')
  phrase: string;

  @Column('boolean')
  isDesigned: boolean;

  @Column('text')
  notes: string;

  @OneToMany(() => MugImage, (mugImage) => mugImage.mug, {
    cascade: true,
    eager: true,
  })
  images?: MugImage[];

  @OneToMany(() => DetailOrder, (detailOrder) => detailOrder.mug)
  detailOrders?: DetailOrder[];

  @ManyToOne(() => Collection, (collection) => collection.mugs)
  collection: Collection;

  @ManyToOne(() => Color, (color) => color.mugs)
  color: Color;
}
