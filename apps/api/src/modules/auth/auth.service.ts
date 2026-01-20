import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from '../../entities/user.entity';

export interface TelegramInitData {
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  language_code?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  validateInitData(initData: string, botToken: string): boolean {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return false;
    }
    
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hmac === hash;
  }

  parseTelegramInitData(initData: string): TelegramInitData {
    const urlParams = new URLSearchParams(initData);
    const userParam = urlParams.get('user');
    
    if (!userParam) {
      throw new UnauthorizedException('Invalid init data');
    }

    const userData = JSON.parse(userParam);
    
    return {
      telegram_id: userData.id?.toString(),
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      photo_url: userData.photo_url,
      language_code: userData.language_code,
    };
  }

  async authenticateWithTelegram(initData: string): Promise<{ access_token: string; user: User }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    // Validate init data
    const isValid = this.validateInitData(initData, botToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram init data');
    }

    // Parse user data
    const telegramData = this.parseTelegramInitData(initData);

    // Find or create user
    let user = await this.userRepository.findOne({
      where: { telegram_id: telegramData.telegram_id },
    });

    if (!user) {
      user = this.userRepository.create({
        telegram_id: telegramData.telegram_id,
        username: telegramData.username,
        first_name: telegramData.first_name,
        last_name: telegramData.last_name,
        avatar_url: telegramData.photo_url,
        language_code: telegramData.language_code,
      });
      await this.userRepository.save(user);
    } else {
      // Update user info
      user.username = telegramData.username || user.username;
      user.first_name = telegramData.first_name || user.first_name;
      user.last_name = telegramData.last_name || user.last_name;
      user.avatar_url = telegramData.photo_url || user.avatar_url;
      user.language_code = telegramData.language_code || user.language_code;
      await this.userRepository.save(user);
    }

    // Generate JWT
    const payload = { sub: user.id, telegram_id: user.telegram_id };
    const access_token = this.jwtService.sign(payload);

    return { access_token, user };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
