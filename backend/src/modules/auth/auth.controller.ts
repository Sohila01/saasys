import { Controller, Post, Body, Get, Request, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, AuthResponseDto } from './dtos/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
    type: AuthResponseDto,
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Request() req: any): Promise<{ message: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.logout(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user' })
  async getCurrentUser(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.userId);
  }
}
