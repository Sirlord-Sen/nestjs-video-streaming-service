import { MongooseModule } from '@nestjs/mongoose'
import { VideoModule } from '@video/video.module'
import { UserModule } from './modules/user/user.module';
import { isAuthenticated } from '@middlewares/auth.middleware';
import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { VideoController } from '@video/controllers/video.controller';

@Module({
  imports: [
    VideoModule,
    UserModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/Stream'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(isAuthenticated)
      .exclude({ 
        path: '/api/v1/video/:id', 
        method: RequestMethod.GET 
      })
      .forRoutes(VideoController)
  }
}
