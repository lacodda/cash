import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';

import { WorkTime } from './entities/work-time.entity';
import { CreateWorkTimeDto } from './dto/create-work-time.dto';
import { UpdateWorkTimeDto } from './dto/update-work-time.dto';
import { QueryWorkTimeDto } from './dto/query-work-time.dto';

export class WorkTimeRepository {
  constructor(
    @InjectModel(WorkTime.name) private readonly workTimeModel: Model<WorkTime>,
  ) {}

  async create(createWorkTimeDto: CreateWorkTimeDto) {
    const data = {
      date: new Date(createWorkTimeDto.date),
      time: createWorkTimeDto.time,
    };
    const newWorkTime = new this.workTimeModel(data);
    try {
      const createdWorkTime = await newWorkTime.save();

      return createdWorkTime;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateWorkTime: UpdateWorkTimeDto) {
    const data = {
      time: updateWorkTime.time,
    };

    try {
      const workTime = await this.workTimeModel
        .findOneAndUpdate({ _id: updateWorkTime.id }, data, {
          new: true,
        })
        .exec();
      return workTime;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: QueryWorkTimeDto) {
    let params = {};

    if (query.from && query.to) {
      params = {
        date: {
          $gte: new Date(query.from).toISOString(),
          $lte: new Date(query.to).toISOString(),
        },
      };
    }

    let workTimes: WorkTime[];

    try {
      workTimes = await this.workTimeModel.find(params).exec();

      let response;

      if (workTimes.length > 0) {
        response = {
          ok: true,
          data: workTimes,
          message: 'Get WorkTimes Ok!',
        };
      } else {
        response = {
          ok: true,
          data: [],
          message: 'No hay workTimes',
        };
      }
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: MongooseSchema.Types.ObjectId) {
    try {
      const workTime = await this.workTimeModel.findById(id).exec();

      return workTime;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: MongooseSchema.Types.ObjectId) {
    try {
      const workTime = await this.workTimeModel.findByIdAndRemove(id);

      return workTime;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
