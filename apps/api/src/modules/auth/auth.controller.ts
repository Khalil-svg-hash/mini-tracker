import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class TelegramAuthDto {
  initData: string;
}

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('telegram')
  async authenticateWithTelegram(@Body() body: TelegramAuthDto) {
    const { access_token, user } = await this.authService.authenticateWithTelegram(body.initData);
    return {
      access_token,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
      },
    };
  }
}
