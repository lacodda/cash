import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WorkTime extends Document {
  @Prop({ required: true, unique: true, message: 'Name must be unique' })
  dateTime: Date;
}

export const WorkTimeSchema = SchemaFactory.createForClass(WorkTime);
