import { Injectable } from '@nestjs/common';
import { Schema as MongooseSchema } from 'mongoose';

import { WorkTimeRepository } from './work-time.repository';
import { CreateWorkTimeDto } from './dto/create-work-time.dto';
import { UpdateWorkTimeDto } from './dto/update-work-time.dto';
import { QueryWorkTimeDto } from './dto/query-work-time.dto';

@Injectable()
export class WorkTimeService {
  constructor(private workTimeRepository: WorkTimeRepository) {}

  async create(createWorkTimeDto: CreateWorkTimeDto) {
    return await this.workTimeRepository.create(createWorkTimeDto);
  }

  async findAll(queryWorkTimeDto: QueryWorkTimeDto) {
    return await this.workTimeRepository.findAll(queryWorkTimeDto);
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    return await this.workTimeRepository.findOne(id);
  }

  async update(updateWorkTimeDto: UpdateWorkTimeDto) {
    return await this.workTimeRepository.update(updateWorkTimeDto);
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    return await this.workTimeRepository.remove(id);
  }
}
