import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { VideoController } from './controllers/video.controller';
import { VideoService } from './services/video.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Video, VideoSchema } from "./model/video.schema"
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { isAuthenticated } from '@middlewares/auth.middleware';


@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public'),
      }),
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const ext = file.mimetype.split('/')[1];
          cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
        },
      })
    })  
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(isAuthenticated)
      .exclude({
        path: 'api/v1/video/:id', 
        method: RequestMethod.GET
      })
  }
}
