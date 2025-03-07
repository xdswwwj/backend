import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiOperation } from '@nestjs/swagger';
import { RequestCustom } from 'src/@types';
import { PaginationDto } from 'src/global/dto/common.dto';
import { createErrorResponse, createSuccessResponse } from 'src/helpers/apiResponse.helper';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/createClub.dto';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req: RequestCustom,
    @Body() createClubDto: CreateClubDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const club = await this.clubService.create(createClubDto, image?.filename, req.user.id);
      return createSuccessResponse(club);
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Get('list')
  @ApiOperation({ summary: '클럽 리스트 가져오기 (페이지네이션)' })
  async getClubList(@Query() paginationDto: PaginationDto, @Req() req: RequestCustom) {
    return this.clubService.getClubList(paginationDto, req.user.id);
  }

  // @Get()
  // findAll() {
  //   return this.clubService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.clubService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
  //   return this.clubService.update(+id, updateClubDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.clubService.remove(+id);
  // }
}
