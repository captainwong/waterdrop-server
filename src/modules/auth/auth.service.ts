import { Injectable } from '@nestjs/common';
import * as Dysmsapi from '@alicloud/dysmsapi20170525';
import * as Utils from '@alicloud/tea-util';
import { getRandomVerificationCode4 } from 'src/utils';
import { UserService } from '../user/user.service';
import smsClient from 'src/utils/sms';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // send verification code
  async sendVerificationCode(tel: string): Promise<boolean> {
    const user = await this.userService.findOneByTel(tel);
    if (user && user.smsCodeCreatedAt) {
      const diff = dayjs().diff(dayjs(user.smsCodeCreatedAt), 'second');
      console.log('diff', diff);
      if (diff < 60) {
        console.log('diff < 60');
        return false;
      }
    }
    const code = getRandomVerificationCode4();
    const sendSmsRequest = new Dysmsapi.SendSmsRequest({
      signName: process.env['SMS_SIGN_NAME'],
      templateCode: process.env['SMS_TEPL_REGISTER'],
      phoneNumbers: tel,
      templateParam: `{"code":${code}}`,
    });
    const runtime = new Utils.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      await smsClient.sendSmsWithOptions(sendSmsRequest, runtime);
      if (user) {
        console.log('update user');
        const result = await this.userService.updateSmsCode(user.id, code);
        console.log('update user result', result);
        return result ? true : false;
      } else {
        console.log('create user');
        const result = await this.userService.create({
          tel,
          smsCode: code,
          smsCodeCreatedAt: new Date(),
        });
        console.log('create user result', result);
        return result ? true : false;
      }
    } catch (error) {
      // 如有需要，请打印 error
      console.error(error);
      return false;
    }
  }

  async login(tel: string, code: string): Promise<boolean> {
    const user = await this.userService.findOneByTel(tel);
    if (!user || !user.smsCode || !user.smsCodeCreatedAt) {
      return false;
    }
    if (dayjs().diff(dayjs(user.smsCodeCreatedAt), 'minute') >= 60) {
      return false;
    }
    return user.smsCode === code;
  }
}
