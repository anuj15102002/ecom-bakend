import { SetMetadata } from "@nestjs/common";
import { Roles } from "../common/user-roles.enum";

export const AuthorizedRoles = (...roles: string[]) => SetMetadata('allowedRoles',roles)