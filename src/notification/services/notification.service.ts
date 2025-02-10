import { Injectable } from "@nestjs/common";
import { Notification } from "../models/notification.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>){}
    async findAllUnreadNotifications(): Promise<Notification[]> {
        return await this.notificationModel.find({ isRead: false })
        .select('message createdAt isRead')
        .lean();      
    }

    async findAllReadNotif() {
        return await this.notificationModel.find({ isRead: true })
    }

    async deleteAllNotifications() {
        return await this.notificationModel.deleteMany({ isRead: false });
    }
      
}