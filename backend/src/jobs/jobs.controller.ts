import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
import { HttpModule } from '@nestjs/axios';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @ResponseMessage("Create a new job")
  @Post()
  create(
    @Body() createJobDto: CreateJobDto, @User() user: IUser
  ) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Job with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }
  @Public()
  @Get('matching-by-user')
  async getMatchingJobsByUserId(@Query('userId') userId: string) {
    return await this.jobsService.findMatchingJobsByUserId(userId);
  }
  @Get('admin')
  @ResponseMessage('Fetch List Job with admin page')
  findAllWithAdminPage(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
    @User() user: IUser
  ) {
    return this.jobsService.findAllWithAdminPage(+currentPage, +limit, qs, user);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id)
  }

  @ResponseMessage("Update a Job")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(id, updateUserDto, user);
  }

  @ResponseMessage("Delete a Job")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
  @Public()
  @ResponseMessage("Get the number of Job")
  @Post('jobCount')
  count() {
    return this.jobsService.getJobCount();
  }


}
