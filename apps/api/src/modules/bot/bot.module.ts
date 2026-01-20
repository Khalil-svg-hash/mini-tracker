import { Module, DynamicModule } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';

@Module({})
export class BotModule {
  static forRoot(): DynamicModule {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    // Only initialize Telegraf if bot token is provided
    if (botToken && botToken !== 'test_bot_token_for_development') {
      return {
        module: BotModule,
        imports: [
          TelegrafModule.forRoot({
            token: botToken,
          }),
        ],
        providers: [BotService],
        exports: [BotService],
      };
    }
    
    // Return empty module if no valid bot token
    return {
      module: BotModule,
      providers: [],
      exports: [],
    };
  }
}
