import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../enums/role.enum';
export class AuthEntity {
  @ApiProperty()
  username: string;
  
  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: RoleEnum[];
}
