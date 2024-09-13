import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumeBuildersService } from './resume-builders.service';
import { CreateResumeBuilderDto } from './dto/create-resume-builder.dto';
import { UpdateResumeBuilderDto } from './dto/update-resume-builder.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('resume-builders')
export class ResumeBuildersController {
  constructor(private readonly resumeBuildersService: ResumeBuildersService) {}

  @Public()
  @ResponseMessage("Create a new resume builder")
  @Post()
  create(@Body() createResumeBuilderDto: CreateResumeBuilderDto) {
    return this.resumeBuildersService.create(createResumeBuilderDto);
  }

  @Public()
  @ResponseMessage("Fetch List resume builder by userEmail")
  @Get()
  findAllByUserEmail(@Query('userEmail') userEmail: string) {
    return this.resumeBuildersService.findAllByUserEmail(userEmail);
  }

  @Public()
  @ResponseMessage("Fetch resume builder by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeBuildersService.findOne(id);
  }

  @Public()
  @ResponseMessage("Update a resume builder") 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeBuilderDto: UpdateResumeBuilderDto) {
    return this.resumeBuildersService.update(id, updateResumeBuilderDto);
  }

  @Public()
  @ResponseMessage("Delete a resume builder") 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeBuildersService.remove(id);
  }
}
