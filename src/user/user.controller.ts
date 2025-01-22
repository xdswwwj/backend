import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequestCustom } from 'src/@types';
import { createErrorResponse, createSuccessResponse } from 'src/helpers/apiResponse.helper';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('info')
  async getUserInfo(@Req() req: RequestCustom) {
    try {
      const user = await this.userService.findUserById(req.user.id);
      return createSuccessResponse(user);
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Post('info-update')
  async updateUserInfo(@Req() req: RequestCustom, @Body() userInfoDto: UpdateUserInfoDto) {
    try {
      const id = req.user.id;
      const userInfoData = { id, ...userInfoDto };
      const updatedUserInfoData = await this.userService.updateUserInfo(userInfoData);
      return createSuccessResponse(updatedUserInfoData);
    } catch (error) {
      return createErrorResponse(error);
    }
  }
}
