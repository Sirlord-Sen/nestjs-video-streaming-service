import {
  Delete,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Video, VideoDocument } from "../model/video.schema";
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { User } from "@user/model/user.schema";
import { pick } from 'lodash'

@Injectable()
export class VideoService {
    constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) {
      
    }

    async createVideo(data: Object): Promise<{video : Omit<Video, 'createdBy' | 'uploadDate'>, user: Partial<User>}> {
      const newVideo = new this.videoModel(data);
      const savedVideo = await newVideo.save()
      const user = pick(savedVideo.createdBy, ['_id'])
      const video = pick(savedVideo, ['_id', 'title', 'coverImage', 'video'])
      return {video, user};
    }

  async readVideo(id): Promise<any> {
    if (id.id) {
        return this.videoModel.findOne({ _id: id.id }).populate("createdBy").exec();
    }
    return this.videoModel.find().populate("createdBy").exec();
  }

  async streamVideo(id: string, response: Response, request: Request) {
    try {
      console.log('lkjhgfdsdfghjmklkjhgfd')
        const data = await this.videoModel.findOne({ _id: id })
        if (!data) {
            throw new NotFoundException(null, 'VideoNotFound')
        }
        const { range } = request.headers;
        if (range) {
            const { video } = data;
            const videoPath = statSync(join(process.cwd(), `./public/${video}`))
            const CHUNK_SIZE = 1 * 1e6;
            const start = Number(range.replace(/\D/g, ''));
            const end = Math.min(start + CHUNK_SIZE, videoPath.size - 1);
            const videoLength = end - start + 1;
            response.status(206)
            response.header({
                'Content-Range': `bytes ${start}-${end}/${videoPath.size}`,
                'Accept-Ranges': 'bytes',
                'Content-length': videoLength,
                'Content-Type': 'video/mp4',
            })
            const vidoeStream = createReadStream(join(process.cwd(), `./public/${video}`), { start, end });
            vidoeStream.pipe(response)
        } else {
            throw new NotFoundException(null, 'range not found')
        }

    } catch (e) {
        console.error(e)
        throw new ServiceUnavailableException()
    }
  }

  async update(id, video: Video): Promise<Video> {
    return await this.videoModel.findByIdAndUpdate(id, video, { new: true })
  }
  
  async delete(id): Promise<any> {
      return await this.videoModel.findByIdAndRemove(id);
  }
}
