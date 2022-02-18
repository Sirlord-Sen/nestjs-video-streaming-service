import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common'
import { User } from '../model/user.schema'
import { UserService } from '../services/user.service'

@Controller('/api/v1/user')
export class UserController {
    constructor(private readonly userServerice: UserService
    ) { }
    @Post('/signup')
    async Signup(@Res() response, @Body() user: User) {
        const newUSer = await this.userServerice.signup(user)
        return response.status(HttpStatus.CREATED).json({
            newUSer
        })
    }
    @Post('/signin')
    async SignIn(@Res() response, @Body() user: Omit<User, 'fullname'>) {
        const data = await this.userServerice.signin(user);
        return response.status(HttpStatus.OK).json({
            message: 'success',
            data: data
        })
    }
}