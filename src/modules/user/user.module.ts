import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from "./model/user.schema"
import { secret } from '../../utils/constants'
import { JwtModule } from '@nestjs/jwt'


@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
        secret,
        signOptions: { expiresIn: '24h' },
      }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
