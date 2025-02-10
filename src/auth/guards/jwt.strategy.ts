
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy  extends PassportStrategy(Strategy){
    
    constructor(
        private readonly configService: ConfigService
    ){
    
        const secretKey = configService.get<string>('JWT_SECRET_KEY');
        if(!secretKey) {
            throw new Error('JWT_SECRET is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secretKey,
        })
    }

     validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}