import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  Inject,
  BadRequestException,
  ParseIntPipe,
  ExecutionContext,
} from '@nestjs/common';
import { ChallengeService } from '../services/challenge.service';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ChallengeIdResponse,
  CreateChallengeResponse,
  DeleteChallengeIdResponse,
  GetChallengesResponse,
  UpdateChallengeResponse,
} from '../dto/response.dto';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { NotificationGateway } from 'src/notification/gateways/notification.gateway';
import { Cache } from 'cache-manager';

@ApiTags('Challenge')
@Controller('challenges')
export class ChallengeController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly challengeService: ChallengeService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 201,
    type: CreateChallengeResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':id')
  async createChallenge(
    @Res() response,
    @Body() createChallengeDto: CreateChallengeDto,
    @Param('id') id: string,
  ) {
    
    try {
      // console.log("creating", createChallengeDto);
      const newChallenge =
        await this.challengeService.createChallenge(createChallengeDto);
      try {
        console.log("id", id);
        await this.notificationGateway.sendNotification(
          id,
          `Challenge called ${newChallenge.title} has been created successfully`,
        );
      } catch (error) {
        console.log(error);
      }
      return response.status(201).json({
        message: 'Challenge called ' + newChallenge.title + ' has been created successfully',
        newChallenge,
      });
    } catch (err: any) {
      console.log(err);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Challenge not created!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 201,
    type: UpdateChallengeResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('/:id/:userId')
  async updateChallenge(
    @Res() response,
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    
    try {
      const Challenge = await this.challengeService.updateChallenge( id, updateChallengeDto,);
      console.log("sending notification")
      await this.notificationGateway.sendNotification(
        userId,
        `Challenge called ${Challenge.title} has been successfully updated`,
      );
       response.status(200).json({
        message: 'Challenge has been successfully updated',
        Challenge,
      });
    } catch (err: any) {
      return "Failed to update the challenge";
    }
  }


  @ApiResponse({
    status: 201,
    type: GetChallengesResponse,
  })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @Get()
  async getChallenges(@Res() response) {
    try {
      const Challenges = await this.challengeService.getAllChallenges();
      await this.cacheManager.set(
        'challenges',
        JSON.parse(JSON.stringify(Challenges)),
      );

      return response.status(200).json(Challenges);
    } catch (err: any) {
      return response.status(403).json(err.response);
    }
  }


  @ApiResponse({
    status: 201,
    type: GetChallengesResponse,
  })
  @ApiResponse({ status: 403, description: 'forbidden' })
  @Get('total/:daysAgo')
  async getChallengesByDays(@Param('daysAgo') daysAgo: number,  @Res() response) {
    try {
      const Challenges = await this.challengeService.getAllChallengesByDays(daysAgo);
      await this.cacheManager.set(
        'challenges',
        JSON.parse(JSON.stringify(Challenges)),
      );

      return response.status(200).json(Challenges);
    } catch (err: any) {
      return response.status(403).json(err.response);
    }
  }

  // get challenges in open state
  @ApiResponse({
    status: 201,
    type: CreateChallengeDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('open/:daysAgo')
  async findOpenChallenges(@Param('daysAgo') daysAgo: number) {
    const DaysChallenges =
      await this.challengeService.getOpenChallenges(daysAgo);
    await this.cacheManager.set(
      `open_challenges_${daysAgo}`,
      JSON.parse(JSON.stringify(DaysChallenges)),
    );

    return DaysChallenges;
  }

  // get challenges in ongoing state
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    type: CreateChallengeDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('ongoing/:daysAgo')
  async findOngoingChallenges(@Param('daysAgo', ParseIntPipe) daysAgo: number) {
    if (daysAgo < 0) {
      throw new BadRequestException('Please specify the days');
    }
    const DaysChallenges =
      await this.challengeService.getOngoingChallenges(daysAgo);
    await this.cacheManager.set(
      `ongoing_challenges_${daysAgo}`,
      JSON.parse(JSON.stringify(DaysChallenges)),
    );

    return DaysChallenges;
  }

  // Get completed challenges in days you want
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 201,
    type: CreateChallengeDto,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('completed/:daysAgo')
  async findCompletedChallenges(@Param('daysAgo') daysAgo: number) {
    if (daysAgo < 0) {
      throw new BadRequestException('Please specify the days');
    }
    const DaysChallenges =
      await this.challengeService.getCompletedChallenges(daysAgo);
    await this.cacheManager.set(
      `completed_challenges_${daysAgo}`,
      JSON.parse(JSON.stringify(DaysChallenges)),
    );
    return DaysChallenges;
  }

  // get challenge by id
  // @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    type: ChallengeIdResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/:id')
  async getChallenge(@Res() response, @Param('id') challengeId: string) {
    try {
      const Challenge = await this.challengeService.getChallenge(challengeId);
      await this.cacheManager.set(
        `challenges_${challengeId}`,
        JSON.parse(JSON.stringify(Challenge)),
      );
      return response.status(200).json({
        Challenge,
      });
    } catch (err: any) {
      return response.status(403).json(err.response);
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 201,
    type: DeleteChallengeIdResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('/:id')
  async deleteChallenge(@Res() response, @Param('id') challengeId: string) {
    try {
      const deletedChallenge =
        await this.challengeService.deleteChallenge(challengeId);
      await this.notificationGateway.BroadCastMessage(
        'Challenge called ' + deletedChallenge.title + ' has been deleted',
      );

      // Invalidate all relevant caches
      await this.cacheManager.del('challenges'); // All challenges
      await this.cacheManager.del(`open_challenges_*`); // Open challenges
      await this.cacheManager.del(`ongoing_challenges_*`); // Ongoing challenges
      await this.cacheManager.del(`completed_challenges_*`); // Completed challenges
      await this.cacheManager.del(`challenges_${challengeId}`); // Specific challenge

      return response.status(200).json({
        message: 'Challenge called ' + deletedChallenge.title + ' has been deleted',
        deletedChallenge,
      });
    } catch (err: any) {
      return response.status(403).json(err.response);
    }
  }
  @Get("/admin/:status")
  async getChallengesByStatus(@Param("status") status:string){
    return this.challengeService.getChallengeByStatus(status);
  }
}
