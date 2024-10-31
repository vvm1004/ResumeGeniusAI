import { Injectable } from '@nestjs/common';
import { ResumeBuilder, ResumeBuilderSchema, ResumeBuilderDocument } from '../resume-builders/schemas/resume-builder.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import processResumeData from './processResumeData';
import * as multer from 'multer';
import * as path from 'path';
import mongoose, { ObjectId } from 'mongoose';

import { createReadStream, createWriteStream, promises as fsPromises } from 'fs';
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

            return (response.data.data);
        } catch (error) {
            console.error('Error calling Flask API:', error);
            throw error;
        }
    }
    async uploadResume(file: Express.Multer.File, userId: string): Promise<any> {
        const uploadDir = path.resolve(__dirname, '../../upload-files'); // Chỉnh sửa ở đây
        const filePath = path.join(uploadDir, file.originalname);

        await fsPromises.mkdir(uploadDir, { recursive: true });

        try {
            await fsPromises.access(filePath);
            await fsPromises.unlink(filePath);
            console.log(`Tệp cũ ${file.originalname} đã bị xóa.`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        const writeStream = createWriteStream(filePath);
        writeStream.write(file.buffer);

        const formattedPath = filePath.replace(/\\/g, '\\\\');


        //console.log("\n", formattedPath, "\n", filePath)
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.url}/process_resume`, { pdf_path: formattedPath }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
            console.log("\n\n\n\n", processResumeData(response.data.data, userId))

            return processResumeData(response.data.data, userId);
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
    async generateSummary(data: any): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.url}/generate_summary`, { data: data }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );
            console.log("data: ", response.data.summary)
            return { data: response.data.summary };
        } catch (error) {
            console.error('Error calling Flask API:', error);
            throw error;
        }
    }



}
