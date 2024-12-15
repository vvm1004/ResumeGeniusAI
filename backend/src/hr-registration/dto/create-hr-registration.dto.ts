import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateHrRegisDto {
  @IsNotEmpty({
    message: 'email không được để trống',
  })
  email: string;

  @IsNotEmpty({
    message: 'Fullname không được để trống',
  })
  fullName: string;

  @IsNotEmpty({
    message: 'Phone không được để trống',
  })
  phone: string;

  @IsNotEmpty({
    message: 'Address không được để trống',
  })
  address: string;

  @IsNotEmpty({
    message: 'Status không được để trống',
  })
  status: string;

  @IsNotEmpty({
    message: 'Status không được để trống',
  })
  age: number;

  @IsNotEmpty({
    message: 'Status không được để trống',
  })
  gender: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
