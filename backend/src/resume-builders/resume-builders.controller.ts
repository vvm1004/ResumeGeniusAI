import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumeBuildersService } from './resume-builders.service';
import { CreateResumeBuilderDto } from './dto/create-resume-builder.dto';
import { UpdateResumeBuilderDto } from './dto/update-resume-builder.dto';
import { Public, ResponseMessage, SkipCheckPermission } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';
 

@ApiTags('resume-builders')

@Controller('resume-builders')
export class ResumeBuildersController {
  constructor(private readonly resumeBuildersService: ResumeBuildersService) { }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Create a new resume builder")
  @Post()
  create(@Body() createResumeBuilderDto) {
    return this.resumeBuildersService.create(createResumeBuilderDto);
  }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch List resume builder by userId")
  @Get()
  findByUserId(@Query('userId') userId: string) {
    return this.resumeBuildersService.findByUserId(userId);
  }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch All Resume Builder")
  @Get()
  findAll() {
    return this.resumeBuildersService.findAll();
  }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch resume builder by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeBuildersService.findOne(id);
  }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Update a resume builder")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeBuilderDto) {
    return this.resumeBuildersService.update(id, updateResumeBuilderDto);
  }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Delete a resume builder")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeBuildersService.remove(id);
  }
}