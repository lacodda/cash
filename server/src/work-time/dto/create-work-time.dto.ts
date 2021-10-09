import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateWorkTimeDto {
  @IsOptional()
  id: MongooseSchema.Types.ObjectId;

  @IsOptional()
  date: string;

  @IsOptional()
  time: number;
}
