import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ResumeRegistrationService } from './resume-registration.service';
import { ResumeRegistration, ResumeRegistrationSchema } from './schema/schema';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, SkipCheckPermission } from 'src/decorator/customize';
import { Throttle } from '@nestjs/throttler';
@ApiTags('resume-registration')

@Controller('resume-registration')
export class ResumeRegistrationController {
    constructor(private readonly resumeService: ResumeRegistrationService) { }

    @Public()
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiBody({})
    @ResponseMessage("Create a new resume-registration")
    @Post()
    async create(@Body() createResumeDto: any) {
        return this.resumeService.create(createResumeDto);
    }
    @Public()
    @Get(':userId')
    async findAllByUserId(@Param('userId') userId: string) {
        return this.resumeService.findAllByUserId(userId);
    }
    @Public()

    @Get('email/:email')
    async findByEmail(@Param('email') email: string) {
        return this.resumeService.findByEmail(email);
    }
    @Public()

    @Delete(':resumeId')
    async delete(@Param('resumeId') resumeId: string) {
        const result = await this.resumeService.deleteByResumeId(resumeId);
        if (!result) {
            throw new Error('Resume not found or already deleted');
        }
        return { message: 'Resume deleted successfully' };
    }
}
