import { Novu, ChatProviderIdEnum } from '@novu/node';
import * as dotenv from 'dotenv';

dotenv.config();

const novu = new Novu(process.env.NOVU_API_KEY || '');

// TODO?
// - submission reached X% consensus (data to include: index number, title, vote score, % consensus)
// - submission has been closed (data to include: index number, title, vote score, % consensus [if it reached it])

class NotificationsService {
  static async send(data: any) {
    try {
      // sub name out for type of notification
      novu.trigger(data.type, {
        to: {
          subscriberId: data.subscriberId,
        },
        payload: data.payload,
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }

  static async createDiscordConnection() {
    try {
      await novu.subscribers.setCredentials('discord', ChatProviderIdEnum.Discord, {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }
}

export default NotificationsService;
