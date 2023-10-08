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
  [Code.STUDENT_HAS_NO_OPENID]: '学生没有openid',
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
  [Code.PRODUCT_NOT_EXISTS]: '商品不存在',
  [Code.PRODUCT_ALREADY_EXISTS]: '商品已存在',
  [Code.PRODUCT_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '商品不存在或密码不匹配',
  [Code.PRODUCT_PASSWORD_NOT_MATCH]: '商品密码不匹配',
  [Code.CREATE_PRODUCT_FAILED]: '创建商品失败',
  [Code.PRODUCT_LIMIT]: '超过商品限购数量',
  [Code.TEACHER_NOT_EXISTS]: '教师不存在',
  [Code.TEACHER_ALREADY_EXISTS]: '教师已存在',
  [Code.TEACHER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '教师不存在或密码不匹配',
  [Code.TEACHER_PASSWORD_NOT_MATCH]: '教师密码不匹配',
  [Code.CREATE_TEACHER_FAILED]: '创建教师失败',
  [Code.PRODUCT_NOT_ENOUGH]: '库存不足',
  [Code.INVALID_PARAMS]: '参数错误',
  [Code.ORDER_NOT_EXISTS]: '订单不存在',
  [Code.ORDER_ALREADY_EXISTS]: '订单已存在',
  [Code.ORDER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '订单不存在或密码不匹配',
  [Code.ORDER_PASSWORD_NOT_MATCH]: '订单密码不匹配',
  [Code.CREATE_ORDER_FAILED]: '创建订单失败',
  [Code.WXORDER_NOT_EXISTS]: '微信订单不存在',
  [Code.WXORDER_ALREADY_EXISTS]: '微信订单已存在',
  [Code.WXORDER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH]: '微信订单不存在或密码不匹配',
  [Code.WXORDER_PASSWORD_NOT_MATCH]: '微信订单密码不匹配',
  [Code.CREATE_WXORDER_FAILED]: '创建微信订单失败',
  [Code.STUDENT_CARD_NOT_EXISTS]: '学生记录不存在',
  [Code.CREATE_STUDENT_CARD_FAILED]: '创建学生记录失败',
  [Code.STUDENT_CARD_EXPIRED]: '学生记录已过期',
  [Code.STUDENT_CARD_DEPLETED]: '学生记录已用完',
  [Code.SCHEDULE_NOT_EXISTS]: '课程表不存在',
  [Code.CREATE_SCHEDULE_FAILED]: '创建课程表失败',
  [Code.ORGANIZATION_HAS_NO_COURSES]: '门店没有课程',
  [Code.COURSES_HAS_NO_SLOTS_OR_TECHERS_OR_SCHEDULE_IS_FULL]:
    '课程没有时间段或教师或课程表已满',
  [Code.STUDENT_HAS_NO_VALID_CARDS]: '学生没有有效的消费卡',
  [Code.STUDENT_SCHEDULE_NOT_EXISTS]: '学生课程表不存在',
  [Code.CREATE_STUDENT_SCHEDULE_FAILED]: '创建学生课程表失败',
  [Code.SCHEDULE_ALREADY_RESERVED]: '您已预约了该课程，不可重复预约',
  [Code.NOT_IMPLEMENTED_YET]: '暂未实现',
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
