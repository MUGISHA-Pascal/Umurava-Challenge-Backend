import { ApiProperty } from '@nestjs/swagger';
import { CreateChallengeDto } from './create-challenge.dto';

export class CreateChallengeResponse {
  @ApiProperty({ example: 'Challenge has been created successfully' })
  message: 'Challenge has been created successfully';
  @ApiProperty()
  newChallenge: CreateChallengeDto;
}
export class UpdateChallengeResponse {
  @ApiProperty({ example: 'Challenge has been successfully updated' })
  message: 'Challenge has been successfully updated';
  @ApiProperty()
  newChallenge: CreateChallengeDto;
}
export class GetChallengesResponse {
  @ApiProperty({ example: 'All Challenges data found successfully' })
  message: 'All Challenges data found successfully';
  @ApiProperty({ type: CreateChallengeDto, isArray: true })
  Challenges: CreateChallengeDto;
}
export class ChallengeIdResponse {
  @ApiProperty({ example: 'Challenge found successfully' })
  message: 'Challenge found successfully';
  @ApiProperty()
  Challenge: CreateChallengeDto;
}
export class DeleteChallengeIdResponse {
  @ApiProperty({ example: 'Challenge deleted successfully' })
  message: 'Challenge deleted successfully';
  @ApiProperty()
  deletedChallenge: CreateChallengeDto;
}
