import { Injectable, NestMiddleware, NestModule } from "@nestjs/common";
import { isArray } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ConfigService } from '@nestjs/config';
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/entities/user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity | null;
        }
    }
}
export { };

interface JwtPayload {
    id: string;
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private readonly configService: ConfigService,
        private readonly userService: UserService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {

        console.log('start')
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const secretToken = this.configService.get('ACCESS_TOKEN_SECRET_KEY')
        if (!authHeader || isArray(authHeader) || typeof authHeader === 'string' && !authHeader.startsWith('Bearer')) {
            console.log('if')
            req.currentUser = null;
            next();
            return;

        }
        else {
            try {
                const token = authHeader.split(' ')[1];
                const { id } = <JwtPayload>verify(token, secretToken);

                

                const user = await this.userService.findOne(+id);
                
                req.currentUser = user;
                console.log('in the middleware');
                console.log(req.currentUser);
                next();

            } catch (err) {
                req.currentUser = null;
                next()

            }

        }


    }

}

