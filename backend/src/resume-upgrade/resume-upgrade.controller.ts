import { ResumeUpgradeService } from './resume-upgrade.service';
import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, SkipCheckPermission } from 'src/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose, { ObjectId } from 'mongoose';

@ApiTags('resume-upgrade')
@Controller('resume-upgrade')
export class ResumeUpgradeController {
    constructor(private readonly resumeUpgradeService: ResumeUpgradeService) { }

    @Public()
    @SkipCheckPermission()
    @Get('read-resume')
    readResume(@Body('path') path: string) {
        return this.resumeUpgradeService.readResume(path);
    }

    @Public()
    @SkipCheckPermission()
    @Post('improve')
    improveSentence(@Body('sentence') sentence: string) {
        return this.resumeUpgradeService.improveSentence(sentence);
    }

    @Public()
    @SkipCheckPermission()
    @Post('check-spelling')
    async checkSpelling(@Body('sentence') sentence: string) {
        return await this.resumeUpgradeService.checkSpelling(sentence);
    }

    @Public()
    @SkipCheckPermission()
    @Post('upload-resume')
    @UseInterceptors(FileInterceptor('file'))
    async uploadResume(@UploadedFile() file: Express.Multer.File, @Body() body: { userId: string }) {
        const userId = body.userId;

        return await this.resumeUpgradeService.uploadResume(file, userId);
    }
}
