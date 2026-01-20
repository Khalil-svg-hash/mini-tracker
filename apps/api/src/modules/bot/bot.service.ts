import { Injectable } from '@nestjs/common';
import { Update, Ctx, Start, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  @Start()
  async start(@Ctx() ctx: Context) {
    const webappUrl = process.env.WEBAPP_URL || 'https://your-webapp-url.com';
    await ctx.reply(
      'Welcome to Mini Tracker! 🎯\n\nManage your tasks right inside Telegram.',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open Mini Tracker',
                web_app: { url: webappUrl },
              },
            ],
          ],
        },
      },
    );
  }

  @Command('tracker')
  async tracker(@Ctx() ctx: Context) {
    const webappUrl = process.env.WEBAPP_URL || 'https://your-webapp-url.com';
    await ctx.reply('Open Mini Tracker:', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open App',
              web_app: { url: webappUrl },
            },
          ],
        ],
      },
    });
  }

  async sendNotification(telegramId: string, message: string) {
    // This method will be used by the notifications processor
    // to send messages via the bot
    try {
      // Implementation for sending notifications
      console.log(`Sending notification to ${telegramId}: ${message}`);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }
}
