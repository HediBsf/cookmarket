import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Get('google')
  google(@Res() res: any) {
    return res.redirect(this.authService.getGoogleAuthUrl());
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: any) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    if (!token) {
      return res.redirect(`${frontendUrl}/login?verified=0`);
    }

    try {
      await this.authService.verifyEmail(token);
      return res.redirect(`${frontendUrl}/login?verified=1`);
    } catch {
      return res.redirect(`${frontendUrl}/login?verified=0`);
    }
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: any) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=google`);
    }

    try {
      const auth = await this.authService.loginWithGoogle(code);
      const params = new URLSearchParams({
        accessToken: auth.accessToken,
        user: JSON.stringify(auth.user),
      });
      return res.redirect(`${frontendUrl}/auth/google/callback?${params.toString()}`);
    } catch {
      return res.redirect(`${frontendUrl}/login?error=google`);
    }
  }

}
