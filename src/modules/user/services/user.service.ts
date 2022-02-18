import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService
    ) {}

    async signup(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        const reqBody = {
            // ...user,
            fullname: user.fullname,
            email: user.email,
            password: hash
        }
        const newUser = new this.userModel(reqBody);
        return newUser.save();
    }

    async signin(user: Omit<User, 'fullname'>): Promise<any> {
        const foundUser = await this.getOne({ email: user.email });
        if (foundUser) {
            const { password } = foundUser;
            if (bcrypt.compare(user.password, password)) {
                const payload = { email: user.email };
                return {
                    user: foundUser,
                    token: this.jwt.sign(payload)
                };
            }
            return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
        }
        return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    }

    async getOne(email): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }
}    