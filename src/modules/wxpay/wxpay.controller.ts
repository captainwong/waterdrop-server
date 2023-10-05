import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { Request, Response } from 'express';
import {
  INVALID_PARAMS,
  STUDENT_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { CodeMsg } from '@/common/const/message';
import axios from 'axios';
import { URL } from 'url';
import { RemoteIp } from '@/common/decorators/remote-ip.decorator';

@Controller('wechat')
export class WxpayController {
  constructor(private readonly studentService: StudentService) {}

  @Get('test')
  async test(@Req() req: Request, @RemoteIp('ip') ip: string) {
    //const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    console.log('req.ip', ip);
    return ip;
  }

  // called by browser
  @Get('wxlogin')
  async wxpayLogin(
    @Query('studentId') studentId: string,
    @Query('redirect') redirect: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log('wxlogin', { studentId, redirect });
    let urlValid = true;
    try {
      new URL(redirect);
    } catch {
      urlValid = false;
    }
    if (!studentId || !redirect || !urlValid) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          code: INVALID_PARAMS,
          message: CodeMsg(INVALID_PARAMS),
        })
        .end();
      return;
    }
    const student = await this.studentService.findOne(studentId);
    if (!student) {
      const url = new URL(redirect);
      url.searchParams.append('code', `${STUDENT_NOT_EXISTS}`);
      url.searchParams.append(
        'msg',
        encodeURIComponent(CodeMsg(STUDENT_NOT_EXISTS)),
      );
      res.redirect(url.toString());
      return;
    }

    const state = Buffer.from(
      `${studentId}@${encodeURIComponent(redirect)}`,
    ).toString('base64');

    const redirect_uri = `${process.env.SERVER_HOST}${process.env.SERVER_API_GLOBAL_PREFIX}/wechat/wxloginCb`;
    const wxuri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WX_APP_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
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
      url.searchParams.append(
        'msg',
        encodeURIComponent(CodeMsg(STUDENT_NOT_EXISTS)),
      );
      res.redirect(url.toString());
      return;
    }
    await this.studentService.update(studentId, { wxOpenid: openid });
    const url = new URL(redirectUri);
    url.searchParams.append('code', `${SUCCESS}`);
    res.redirect(url.toString());
  }

  // @Post('wxpayCb')
  // async wxpayCb(@Body() data: any): Promise<any> {}
}
