import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Challenge } from '../models/challenge.model';
import { DateTime } from 'luxon';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';
@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private challengeModel: Model<Challenge>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
async getChallengeByStatus(status:string){
  
  return this.challengeModel.find({status})
}
  async getChallengesByDaysAndStatus(daysAgo: number, status: string): Promise<Challenge[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo); // Calculate date X days ago
  
    const challenges = await this.challengeModel
      .find({
        status,
        createdAt: { $gte: startDate }, // Filter challenges created within the specified timeframe
      })
      .exec();
  
    if (!challenges || challenges.length === 0) {
      throw new NotFoundException(`No ${status} challenges found in the last ${daysAgo} days.`);
    }
  
    return challenges;
  }
  async getChallengesByDays(daysAgo: number): Promise<Challenge[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo); // Calculate date X days ago
  
    const challenges = await this.challengeModel
      .find({
        createdAt: { $gte: startDate }, // Filter challenges created within the specified timeframe
      })
      .exec();
  
    if (!challenges || challenges.length === 0) {
      throw new NotFoundException(`No  challenges found in the last ${daysAgo} days.`);
    }
  
    return challenges;
  }
  
  async getOpenChallenges(daysAgo: number): Promise<Challenge[]> {
    const challenges = await this.getChallengesByDaysAndStatus(daysAgo,'open');
    return challenges;
  }

  async getOngoingChallenges(daysAgo: number): Promise<Challenge[]> {
    const challenges = await this.getChallengesByDaysAndStatus(daysAgo,'ongoing');
    return challenges;
  }

  async getCompletedChallenges(daysAgo: number): Promise<Challenge[]> {
    const challenges = await this.getChallengesByDaysAndStatus(daysAgo,'completed');
    return challenges;
  }

  async getAllChallengesByDays(daysAgo: number): Promise<Challenge[]> {
    const challenges = await this.getChallengesByDays(daysAgo);
    if (!challenges || challenges.length == 0) {
      throw new NotFoundException('Challenges data not found!');
    }
    return JSON.parse(JSON.stringify(challenges)); // Deeply convert to plain objects
  }
  async getAllChallenges(): Promise<Challenge[]> {
    const challenges = await this.challengeModel.find().exec();
    if (!challenges || challenges.length == 0) {
      throw new NotFoundException('Challenges data not found!');
    }
    return JSON.parse(JSON.stringify(challenges)); // Deeply convert to plain objects
  }

  async getChallenge(challengeId: string): Promise<Challenge> {
    const existingChallenge = await this.challengeModel
      .findById(challengeId)
      .exec();
    if (!existingChallenge) {
      throw new NotFoundException(`Challenge #${challengeId} not found`);
    }
    return existingChallenge;
  }
  async createChallenge(challengeData: any): Promise<Challenge> {
    const challenge = new this.challengeModel(challengeData);
    return challenge.save();
  }

  async updateChallenge(
    challengeId: string,
    updateChallengeData: UpdateChallengeDto,
  ){
    const existingChallenge = await this.challengeModel.findByIdAndUpdate(
      challengeId,
      updateChallengeData,
      { new: true },
    );
    if (!existingChallenge) {
      throw new NotFoundException(`Challenge #${challengeId} not found`);
    }
    return existingChallenge;
  }

  async deleteChallenge(challengeId: string): Promise<Challenge> {
    const deletedChallenge =
      await this.challengeModel.findByIdAndDelete(challengeId);
    if (!deletedChallenge) {
      throw new NotFoundException(`Challenge #${challengeId} not found`);
    }
    return deletedChallenge;
  }
}
