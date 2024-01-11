import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.authService.login(req);
  }
  
}
