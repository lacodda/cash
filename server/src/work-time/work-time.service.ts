import * as $R from 'ramda';
import { Injectable } from '@nestjs/common';
import { CreateWorkTimeDto } from './dto/create-work-time.dto';
import { UpdateWorkTimeDto } from './dto/update-work-time.dto';
import { workTime } from './work-time-mock';

let workTimeData = workTime;

@Injectable()
export class WorkTimeService {
  create(createWorkTimeDto: CreateWorkTimeDto) {
    const id = (workTimeData.length + 1).toString();
    return $R.append({ ...createWorkTimeDto, id }, workTimeData);
  }

  findAll() {
    return workTimeData;
  }

  findOne(id: number) {
    return $R.find($R.propEq('id', id), workTimeData);
  }

  update(id: number, updateWorkTimeDto: UpdateWorkTimeDto) {
    const index = $R.findIndex($R.propEq('id', id), workTimeData);
    return $R.update(index, updateWorkTimeDto, workTimeData);
  }

  remove(id: number) {
    const index = $R.findIndex($R.propEq('id', id), workTimeData);
    return $R.remove(index, 1, workTimeData);
  }
}
