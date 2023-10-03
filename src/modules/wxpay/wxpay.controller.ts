import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { Response } from 'express';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
import { AuthGuard } from '@/common/guards/auth.gard';
import { STUDENT_NOT_EXISTS, SUCCESS } from '@/common/const/code';
import { CodeMsg } from '@/common/const/message';
import axios from 'axios';
import { URL } from 'url';

@Controller('wxpay')
export class WxpayController {
  constructor(private readonly studentService: StudentService) {}

  // called by browser
  @Get('wxlogin')
  async wxpayLogin(
    @Query('studentId') studentId: string,
    @Query('redirect') redirect: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log('wxlogin', { studentId, redirect });
    const student = await this.studentService.findOne(studentId);
    if (!student) {
      const url = new URL(redirect);
      url.searchParams.append('code', `${STUDENT_NOT_EXISTS}`);
      url.searchParams.append('msg', encodeURIComponent(CodeMsg(STUDENT_NOT_EXISTS)));
      res.redirect(url.toString());
      return;
    }

    const state = Buffer.from(
      `${studentId}@${encodeURIComponent(redirect)}`,
    ).toString('base64');

    const wxuri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WX_APP_ID}&redirect_uri=${process.env.SERVER_HOST}/api/v1/wxpay/wxloginCb&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
    console.log('wxuri', wxuri);
    res.redirect(wxuri);
  }

  @Get('wxloginCb')
  async wxpayLoginCb(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log('wxloginCb', { code, state });
    const [studentId, redirect] = Buffer.from(state, 'base64')
      .toString()
      .split('@');
    const redirectUri = decodeURIComponent(redirect);
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WX_APP_ID}&secret=${process.env.WX_APP_SECRET}&code=${code}&grant_type=authorization_code`,
    );
    console.log('wxloginCb.response.data', response.data);
    const { openid } = response.data;
    const student = await this.studentService.findOne(studentId);
    if (!student) {
      const url = new URL(redirectUri);
      url.searchParams.append('code', `${STUDENT_NOT_EXISTS}`);
      url.searchParams.append('msg', encodeURIComponent(CodeMsg(STUDENT_NOT_EXISTS)));
      res.redirect(url.toString());
      return;
    }
    await this.studentService.update(studentId, { wx_openid: openid });    
    const url = new URL(redirectUri);
    url.searchParams.append('code', `${SUCCESS}`);
    res.redirect(url.toString());
  }
}
