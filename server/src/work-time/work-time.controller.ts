import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { Schema as MongooseSchema } from 'mongoose';
import { WorkTimeService } from './work-time.service';
import { CreateWorkTimeDto } from './dto/create-work-time.dto';
import { UpdateWorkTimeDto } from './dto/update-work-time.dto';
import { QueryWorkTimeDto } from './dto/query-work-time.dto';

@Controller('work-time')
export class WorkTimeController {
  constructor(private readonly workTimeService: WorkTimeService) {}

  @Post()
  async create(@Body() createWorkTimeDto: CreateWorkTimeDto, @Res() res: any) {
    const newWorkTime: any = await this.workTimeService.create(
      createWorkTimeDto,
    );
    return res.status(HttpStatus.OK).send(newWorkTime);
  }

  @Get()
  async findAll(@Query() queryWorkTimeDto: QueryWorkTimeDto, @Res() res: any) {
    const storages: any = await this.workTimeService.findAll(queryWorkTimeDto);
    return res.status(HttpStatus.OK).send(storages);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: any,
  ) {
    const storage: any = await this.workTimeService.findOne(id);
    return res.status(HttpStatus.OK).send(storage);
  }

  @Put(':id')
  async update(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updateWorkTimeDto: UpdateWorkTimeDto,
    @Res() res: any,
  ) {
    const updatedWorkTime: any = await this.workTimeService.update(
      updateWorkTimeDto,
    );
    return res.status(HttpStatus.OK).send(updatedWorkTime);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: any,
  ) {
    const removedWorkTime: any = await this.workTimeService.remove(id);
    return res.status(HttpStatus.OK).send(removedWorkTime);
  }
}
