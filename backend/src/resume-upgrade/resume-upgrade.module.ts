import { Module } from '@nestjs/common';
import { ResumeUpgradeController } from './resume-upgrade.controller';
import { ResumeUpgradeService } from './resume-upgrade.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeBuilder, ResumeBuilderSchema } from '../resume-builders/schemas/resume-builder.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([{ name: ResumeBuilder.name, schema: ResumeBuilderSchema }]), HttpModule,],
  controllers: [ResumeUpgradeController],
  providers: [ResumeUpgradeService]
})
export class ResumeUpgradeModule { }
