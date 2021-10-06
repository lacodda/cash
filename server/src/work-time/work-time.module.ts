import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkTime, WorkTimeSchema } from './entities/work-time.entity';
import { WorkTimeRepository } from './work-time.repository';
import { WorkTimeController } from './work-time.controller';
import { WorkTimeService } from './work-time.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkTime.name, schema: WorkTimeSchema },
    ]),
  ],
  controllers: [WorkTimeController],
  providers: [WorkTimeService, WorkTimeRepository],
  exports: [WorkTimeService, WorkTimeRepository],
})
export class WorkTimeModule {}
