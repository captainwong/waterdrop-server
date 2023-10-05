export enum OrderStatus {
  SUCCESS = 'SUCCESS', // 支付成功
  REFUND = 'REFUND', // 转入退款
  NOTPAY = 'NOTPAY', // 未支付
  CLOSED = 'CLOSED', // 已关闭
  REVOKED = 'REVOKED', // 已撤销（刷卡支付）
  USERPAYING = 'USERPAYING', // 用户支付中
  PAYERROR = 'PAYERROR', // 支付失败(其他原因，如银行返回失败)
}
