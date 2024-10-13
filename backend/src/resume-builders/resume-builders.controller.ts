import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumeBuildersService } from './resume-builders.service';
import { CreateResumeBuilderDto } from './dto/create-resume-builder.dto';
import { UpdateResumeBuilderDto } from './dto/update-resume-builder.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

import { IUser } from 'src/users/users.interface';


@ApiTags('resume-builders')

@Controller('resume-builders')
export class ResumeBuildersController {
  constructor(private readonly resumeBuildersService: ResumeBuildersService) { }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Create a new resume builder")
  @Post()
  create(@Body() createResumeBuilderDto, @User() user: IUser) {
    return this.resumeBuildersService.create(createResumeBuilderDto, user);
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch List resume builder by userId")
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.resumeBuildersService.findByUserId(userId);
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch All Resume Builder")
  @Get()
  findAll() {
    return this.resumeBuildersService.findAll();
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch resume builder by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeBuildersService.findOne(id);
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Update a resume builder")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeBuilderDto, @User() user: IUser) {
    return this.resumeBuildersService.update(id, updateResumeBuilderDto, user);
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Delete a resume builder")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumeBuildersService.remove(id, user);
  }
}