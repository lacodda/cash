import { IsOptional } from 'class-validator';

export class QueryWorkTimeDto {
  @IsOptional()
  from?: string;

  @IsOptional()
  to?: string;
}
