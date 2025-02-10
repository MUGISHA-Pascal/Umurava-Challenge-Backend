/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsArray,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class CreateChallengeDto {
  @ApiProperty({
    example: 'Project1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '10/12/2023',
    required: true,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value)) 
  deadline: Date;

  @ApiProperty({
    example: '10/12/2023',
    required: true,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value)) 
  startingAt: Date;

  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    example: '1000',
    required: true,
  })
  @IsNumber()
  moneyPrice: number;

  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
  })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({
    example: 'creating project 1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  projectBrief: string;

  @ApiProperty({
    example: '[requirement1, requirement2, requirement3, requirement4]',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];
  
  @ApiProperty({
    example: '[skills_1, skills_2, skills_3]',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  skills_needed: string[];

  @ApiProperty({
    example: '[product_design1, product_design2, product_design3, product_design4]',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  product_design: string[];

  @ApiProperty({
    example: '[deliverable1, deliverable2, deliverable3, deliverable4]',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  deliverables: string[];

  @ApiProperty({
    example: 'development',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'junior',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seniority_level: string;  
}
