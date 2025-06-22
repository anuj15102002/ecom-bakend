import { Injectable, NestMiddleware, NestModule, UnauthorizedException } from "@nestjs/common";
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




@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private readonly configService: ConfigService,
        private readonly userService: UserService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        console.log('Middleware for route:', req.method, req.originalUrl);
        console.log('start')
        const authHeader = req.headers.authorization || req.headers.authorization;
        const secretToken = await this.configService.get('ACCESS_TOKEN_SECRET_KEY')
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            req.currentUser = null;
            next();
            return;
        }
        else {
            try {
                const auth = authHeader.split(' ');
                if (auth.length !== 2) {
                    req.currentUser = null;
                    return next();
                }
                const payload = await verify(auth[1], secretToken) as {
                    id: number;
                    email: string;
                };
                console.log('JWT payload:', payload);
                const id = Number(payload.id);
                console.log('Extracted id:', id, 'from payload.id:', payload.id);
                if (!id || isNaN(id)) {
                    req.currentUser = null;
                    console.log('Invalid user id in token payload:', payload.id);
                    next();
                    return;
                }
                const user = await this.userService.findOne(id);
                if (!user) {
                    req.currentUser = null;
                    console.log('currentUser is setted up null' + req.currentUser)
                    next();
                    return;
                }

                req.currentUser = user;
                console.log('in the middleware');
                console.log(`Setted up the currentUser ${req.currentUser.id}`);
                next();

            } catch (err) {
                console.log('error occured' + err)
                req.currentUser = null;
                next()

            }

        }


        
    }

}