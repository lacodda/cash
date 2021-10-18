import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { WorkTimeController } from './work-time.controller';
import { WorkTimeService } from './work-time.service';
import { WorkTimeModel } from './work-time.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: WorkTimeModel,
        schemaOptions: {
          collection: 'WorkTime',
        },
      },
    ]),
  ],
  controllers: [WorkTimeController],
  providers: [WorkTimeService],
  exports: [WorkTimeService],
})
export class WorkTimeModule {}
