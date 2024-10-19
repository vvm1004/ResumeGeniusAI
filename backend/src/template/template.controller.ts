import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TemplateService } from './template.service';
import { Public } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('template')
@Controller('template')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    @Public()
    @Get()
    findAll() {
        
        return this.templateService.findAll();
    }
    @Public()
    @Post()
    create(@Body() templateData: any) {
        // Logic to create a new template
        return this.templateService.create(templateData);
    }
    @Public()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        // Logic to update a template based on id
        return this.templateService.update(id, updateData);
    }
}
