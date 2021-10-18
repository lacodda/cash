import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface WorkTimeModel extends Base {}
export class WorkTimeModel extends TimeStamps {
  @prop({ unique: true })
  date: Date;

  @prop({ required: true })
  time: number;
}
