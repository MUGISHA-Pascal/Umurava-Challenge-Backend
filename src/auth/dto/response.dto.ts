import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'ieewih44huer0uwehfewfiq...',
    description: 'token',
  })
  access_token: string;
}
export class LoginBodyDto {
  @ApiProperty({
    example: 'john doe',
    description: 'username',
  })
  email: string;
  @ApiProperty({
    example: 'johnDOE123',
    description: 'strong password',
  })
  password: string;
}
