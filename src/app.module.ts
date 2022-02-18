import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { VideoModule } from '@video/video.module'
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    VideoModule,
    UserModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/Stream'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
