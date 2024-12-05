import { Body, Controller, Post, Req } from '@nestjs/common';
import { registerDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import RegisterResult from './dto/registerResult.dto';
import ApiResponse from 'src/utility/ApiResponse';
import { Request } from 'express';

import { loginDto } from './dto/login.dto';
import UserCredentials from './dto/userCredentials.dto';
import LogInResult from './dto/loginResult.dto';
import { Public } from 'src/utility/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  async register(
    @Body() registerDto: registerDto,
    @Req() request: Request,
  ): Promise<ApiResponse<any>> {
    const result: RegisterResult = await this.authService.register(registerDto);
    if (!result.success) {
      throw result.error;
    }
    var response = new ApiResponse<null>(
      200,
      'user register succesfull',
      request.path,
      null,
    );

    return response;
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: loginDto,
    @Req() request: Request,
  ): Promise<ApiResponse<UserCredentials>> {
    const logInResult: LogInResult<UserCredentials> =
      await this.authService.login(dto);
    if (!logInResult.success) {
      throw logInResult.error;
    }
    var response = new ApiResponse<UserCredentials>(
      200,
      'user login succesfull',
      request.path,
      logInResult.data, // send jwt to client
    );
    return response;
  }
}
