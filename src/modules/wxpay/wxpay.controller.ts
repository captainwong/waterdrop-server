import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { Response } from 'express';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
import { AuthGuard } from '@/common/guards/auth.gard';
import { STUDENT_NOT_EXISTS } from '@/common/const/code';
import { CodeMsg } from '@/common/const/message';
import axios from 'axios';

@Controller('wxpay')
export class WxpayController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(AuthGuard)
  @Get('login')
  async wxpayLogin(
    @CurrentTokenId('studentId') studentId: string,
    @Query('redirect') redirect: string,
    @Res() res: Response,
  ): Promise<void> {
    const student = await this.studentService.findOne(studentId);
    if (!student) {
      res
        .json({
          code: STUDENT_NOT_EXISTS,
          message: CodeMsg(STUDENT_NOT_EXISTS),
        })
        .end();
      return;
    }

    const state = Buffer.from(
      `${studentId}@${encodeURIComponent(redirect)}`,
    ).toString('base64');

    res.redirect(`
      https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WX_APPID}&redirect_uri=${process.env.WX_URL}/wxpay/loginCb&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect
    `);
  }

  @Get('loginCb')
  async wxpayLoginCb(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    const [studentId, redirect] = Buffer.from(state, 'base64')
      .toString()
      .split('@');
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WX_APPID}&secret=${process.env.WX_SECRET}&code=${code}&grant_type=authorization_code`,
    );
    const { openid } = response.data;
  }
}
