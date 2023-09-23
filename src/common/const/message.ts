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
  [Code.ORGANIZATION_NOT_EXISTS]: '机构不存在',
  [Code.ORGANIZATION_ALREADY_EXISTS]: '机构已存在',
  [Code.ORGANIZATION_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]:
    '机构不存在或密码不匹配',
  [Code.ORGANIZATION_PASSWORD_NOT_MATCH]: '机构密码不匹配',
  [Code.CREATE_ORGANIZATION_FAILED]: '创建机构失败',
  [Code.OSS_GET_SIGNATURE_ERROR]: '获取OSS签名失败',
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
