import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
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
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import WxPay from 'wechatpay-node-v3';
import { WxpayCbDto } from './dto/wxpay-cb.dto';

@Controller('wechat')
export class WxpayController {
  constructor(
    private readonly studentService: StudentService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
  ) {}

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

  @Post('wxpayCb')
  async wxpayCb(@Body() data: WxpayCbDto): Promise<any> {
    // console.log('wxpayCb', data);
    /*
    {
      id: 'cada5071-bf43-5d85-a797-f821c9042f9c',
      create_time: '2023-10-06T03:24:28+08:00',
      resource_type: 'encrypt-resource',
      event_type: 'TRANSACTION.SUCCESS',
      summary: '支付成功',
      resource: {
        original_type: 'transaction',
        algorithm: 'AEAD_AES_256_GCM',
        ciphertext: 'xxxxxxxxxxxxxxxxxx',
        associated_data: 'transaction',
        nonce: '3a8sk93zs3mP'
      }
    }
    */
    const result = this.wxPay.decipher_gcm(
      data.resource.ciphertext,
      data.resource.associated_data,
      data.resource.nonce,
    );
    // console.log('result', result);
    /*
    {
      mchid: 'xxxxxxxxxxxxxxxxxx',
      appid: 'xxxxxxxxxxxxxxxxxx',
      out_trade_no: 'f00daf10a6a74d2fa361275d5c8ea179',
      transaction_id: '4200001972202310068553552073',
      trade_type: 'JSAPI',
      trade_state: 'SUCCESS',
      trade_state_desc: '支付成功',
      bank_type: 'OTHERS',
      attach: '',
      success_time: '2023-10-06T05:50:46+08:00',
      payer: { openid: 'xxxxxxxxxxxxxxxxxx' },
      amount: { total: 1, payer_total: 1, currency: 'CNY', payer_currency: 'CNY' }
    }
    */
    return {
      code: 'SUCCESS',
      message: '成功',
    };
  }
}
