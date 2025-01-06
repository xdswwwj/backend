import { Body, Controller, Post } from '@nestjs/common';
import { createErrorResponse, createSuccessResponse } from 'src/helpers/apiResponse.helper';
import { UserInfoDto } from './dto/userInfo.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('info')
  async getUserInfo(@Body() userInfoDto: UserInfoDto) {
    try {
      const { id } = userInfoDto;
      const user = await this.userService.findUserById(id);
      return createSuccessResponse(user);
    } catch (error) {
      return createErrorResponse(error);
    }
  }
}
