import { Injectable } from '@nestjs/common';
import { ResumeBuilder, ResumeBuilderSchema, ResumeBuilderDocument } from '../resume-builders/schemas/resume-builder.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { firstValueFrom } from 'rxjs';
import { createReadStream } from 'fs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ResumeUpgradeService {
    constructor(@InjectModel(ResumeBuilder.name) private resumeBuidlerModel: SoftDeleteModel<ResumeBuilderDocument>, private readonly httpService: HttpService) { }
    private readonly url = 'http://127.0.0.1:5000';
    async readResume(filePath: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.url}/process_resume`, { pdf_path: filePath }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
            return response.data.data;
        } catch (error) {
            console.error('Error calling Flask API:', error);
            throw error;
        }
    }

    async improveSentence(sen: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.url}/upgrade_sentence`, { sentence: sen }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
            return response.data.new_sentence;
        } catch (error) {
            console.error('Error calling Flask API:', error);
            throw error;
        }

    }

    async checkSpelling(sen: string): Promise<{ corrected_sentence: string; corrections: any }> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.url}/check_spell`, { sentence: sen }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );

            const errors = response.data.corrections;
            const correctedSentence = response.data.corrected_sentence;
            return {
                corrected_sentence: correctedSentence,
                corrections: errors,
            };
        } catch (error) {
            console.error('Error calling Flask API:', error);
            throw error;
        }
    }


}
