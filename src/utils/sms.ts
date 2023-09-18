import Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as OpenApi from '@alicloud/openapi-client';
import { config } from 'dotenv';

config();

const conf = new OpenApi.Config({
  // 必填，您的 AccessKey ID
  accessKeyId: process.env['SMS_ACCESS_KEY_ID'],
  // 必填，您的 AccessKey Secret
  accessKeySecret: process.env['SMS_ACCESS_KEY_SECRET'],
});
// Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
conf.endpoint = `dysmsapi.aliyuncs.com`;
const smsClient = new Dysmsapi20170525(conf);

export default smsClient;
