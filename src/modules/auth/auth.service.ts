import { Injectable } from '@nestjs/common';
import * as Dysmsapi from '@alicloud/dysmsapi20170525';
import * as Utils from '@alicloud/tea-util';
import { getRandomVerificationCode4 } from '@/utils';
import { UserService } from '../user/user.service';
import smsClient from '@/utils/sms';
import * as dayjs from 'dayjs';
import { Result, createCodeMsgResult } from '@/common/dto/result.dto';
import {
  CREATE_USER_FAILED,
  SEND_SMS_FAILED,
  SMS_CODE_STILL_VALID,
  SUCCESS,
  UPDATE_USER_SMS_CODE_FAILED,
  USER_ALREADY_EXISTS,
  USER_NOT_EXISTS,
  USER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH,
  USER_SMS_CODE_EXPIRED,
  USER_SMS_CODE_NOT_EXISTS,
  USER_SMS_CODE_NOT_MATCH,
} from '@/common/const/code';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { compare, hash } from '@/utils/hash';
import { CodeMsg } from '@/common/const/message';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
  ) {}

  // send verification code
  async sendVerificationCode(tel: string): Promise<Result> {
    const user = await this.userService.findOneByTel(tel);
    if (user && user.smsCodeCreatedAt) {
      const diff = dayjs().diff(dayjs(user.smsCodeCreatedAt), 'second');
      console.log('diff', diff);
      if (diff < 60) {
        console.log('diff < 60');
        return {
          code: SMS_CODE_STILL_VALID,
          message: '验证码还在有效期内，不要重复发送',
        };
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
        if (result) {
          return createCodeMsgResult(SUCCESS);
        } else {
          return createCodeMsgResult(UPDATE_USER_SMS_CODE_FAILED);
        }
      } else {
        console.log('create user');
        const result = await this.userService.create({
          tel,
          smsCode: code,
          smsCodeCreatedAt: new Date(),
        });
        console.log('create user result', result);
        if (result) {
          return createCodeMsgResult(SUCCESS);
        } else {
          return createCodeMsgResult(CREATE_USER_FAILED);
        }
      }
    } catch (error) {
      // 如有需要，请打印 error
      console.error(error);
      return createCodeMsgResult(SEND_SMS_FAILED);
    }
  }

  async login(tel: string, code: string): Promise<Result> {
    const user = await this.userService.findOneByTel(tel);
    if (!user) {
      return createCodeMsgResult(USER_NOT_EXISTS);
    }

    if (process.env.NODE_ENV === 'development' && code === '1234') {
      // FIXME: 签发 token 时，需要加上用户类型，以便区分是 user 还是 student 还是其他
      const token = this.jwtService.sign({
        id: user.id,
        entity: 'user',
      });
      return createCodeMsgResult(SUCCESS, token);
    }

    if (!user.smsCode || !user.smsCodeCreatedAt) {
      return createCodeMsgResult(USER_SMS_CODE_NOT_EXISTS);
    }

    if (dayjs().diff(dayjs(user.smsCodeCreatedAt), 'minute') >= 60) {
      return createCodeMsgResult(USER_SMS_CODE_EXPIRED);
    }

    if (user.smsCode !== code) {
      return createCodeMsgResult(USER_SMS_CODE_NOT_MATCH);
    }

    // FIXME: 签发 token 时，需要加上用户类型，以便区分是 user 还是 student 还是其他
    const token = this.jwtService.sign({
      id: user.id,
      entity: 'user',
    });

    return createCodeMsgResult(SUCCESS, token);
  }

  async studentRegister(account: string, password: string): Promise<Result> {
    const student = await this.studentService.findOneByAccount(account);

    if (student) {
      return createCodeMsgResult(USER_ALREADY_EXISTS);
    }

    const newStudent = await this.studentService.create({
      account: account,
      password: await hash(password),
    });

    if (newStudent) {
      return createCodeMsgResult(SUCCESS);
    } else {
      return createCodeMsgResult(CREATE_USER_FAILED);
    }
  }

  async studentLogin(account: string, password: string): Promise<Result> {
    const student = await this.studentService.findOneByAccount(account);

    if (!student) {
      return createCodeMsgResult(USER_NOT_EXISTS);
    }

    if (!(await compare(password, student.password))) {
      if (process.env.NODE_ENV === 'development') {
        console.log('password not match, updating', password, student.password);
        await this.studentService.update(student.id, {
          password: await hash(password),
        });
        const token = this.jwtService.sign({
          id: student.id,
          entity: 'student',
        });
        return createCodeMsgResult(SUCCESS, token);
      }

      return createCodeMsgResult(USER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH);
    }

    // FIXME: 签发 token 时，需要加上用户类型，以便区分是 user 还是 student 还是其他
    const token = this.jwtService.sign({
      id: student.id,
      entity: 'student',
    });

    return createCodeMsgResult(SUCCESS, token);
  }
}
