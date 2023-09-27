import * as Code from './code';

export const Message = {
  [Code.SUCCESS]: 'ok',
  [Code.SMS_CODE_STILL_VALID]: '验证码仍有效，请勿重复发送',
  [Code.UPDATE_USER_SMS_CODE_FAILED]: '更新用户验证码失败',
  [Code.CREATE_USER_FAILED]: '创建用户失败',
  [Code.SEND_SMS_FAILED]: '发送短信失败',
  [Code.USER_NOT_EXISTS]: '用户不存在',
  [Code.USER_SMS_CODE_NOT_EXISTS]: '用户验证码不存在',
  [Code.USER_SMS_CODE_EXPIRED]: '用户验证码已过期',
  [Code.USER_SMS_CODE_NOT_MATCH]: '用户验证码不匹配',
  [Code.USER_ALREADY_EXISTS]: '用户已存在',
  [Code.USER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '用户不存在或密码不匹配',
  [Code.STUDENT_NOT_EXISTS]: '学生不存在',
  [Code.STUDENT_ALREADY_EXISTS]: '学生已存在',
  [Code.STUDENT_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '学生不存在或密码不匹配',
  [Code.STUDENT_PASSWORD_NOT_MATCH]: '学生密码不匹配',
  [Code.CREATE_STUDENT_FAILED]: '创建学生失败',
  [Code.ORGANIZATION_NOT_EXISTS]: '门店不存在',
  [Code.ORGANIZATION_ALREADY_EXISTS]: '门店已存在',
  [Code.ORGANIZATION_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]:
    '门店不存在或密码不匹配',
  [Code.ORGANIZATION_PASSWORD_NOT_MATCH]: '门店密码不匹配',
  [Code.CREATE_ORGANIZATION_FAILED]: '创建门店失败',
  [Code.OSS_GET_SIGNATURE_ERROR]: '获取OSS签名失败',
  [Code.COURSE_NOT_EXISTS]: '课程不存在',
  [Code.COURSE_ALREADY_EXISTS]: '课程已存在',
  [Code.COURSE_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '课程不存在或密码不匹配',
  [Code.COURSE_PASSWORD_NOT_MATCH]: '课程密码不匹配',
  [Code.CREATE_COURSE_FAILED]: '创建课程失败',
  [Code.CARD_NOT_EXISTS]: '卡不存在',
  [Code.CARD_ALREADY_EXISTS]: '卡已存在',
  [Code.CARD_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '卡不存在或密码不匹配',
  [Code.CARD_PASSWORD_NOT_MATCH]: '卡密码不匹配',
  [Code.CREATE_CARD_FAILED]: '创建卡失败',
  [Code.PRODUCT_NOT_EXISTS]: '产品不存在',
  [Code.PRODUCT_ALREADY_EXISTS]: '产品已存在',
  [Code.PRODUCT_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '产品不存在或密码不匹配',
  [Code.PRODUCT_PASSWORD_NOT_MATCH]: '产品密码不匹配',
  [Code.CREATE_PRODUCT_FAILED]: '创建产品失败',
};

export const CodeMsg = (code: number): string => {
  const msg = Message[code];
  if (msg) {
    return msg;
  }
  if (process.env.NODE_ENV === 'development') {
    throw new Error(`未知错误${code}`);
  }
  return `未知错误${code}`;
};
