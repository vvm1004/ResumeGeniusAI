import { Controller, Get, Post, Patch, Body, Param, Delete } from '@nestjs/common';
import { TemplateService } from './template.service';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from 'src/users/users.interface';

@ApiTags('template')
@Controller('template')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Create a new template")
  @Post()
  create(@Body() createTemplateDto, @User() user: IUser) {
    return this.templateService.create(createTemplateDto, user);
  }

  @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch All Template")
  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Fetch Template by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Update a template")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto, @User() user: IUser) {
    return this.templateService.update(id, updateTemplateDto, user);
  }

  // @Public()
  @SkipCheckPermission()
  @ResponseMessage("Delete a template")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.templateService.remove(id, user);
  }
}
