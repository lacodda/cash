import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WorkTime extends Document {
  @Prop({ required: true, unique: true, message: 'Name must be unique' })
  date: Date;

  @Prop({ required: true })
  time: number;
}

export const WorkTimeSchema = SchemaFactory.createForClass(WorkTime);
