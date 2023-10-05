/**
 * {
      id: 'cada5071-bf43-5d85-a797-f821c9042f9c',
      create_time: '2023-10-06T03:24:28+08:00',
      resource_type: 'encrypt-resource',
      event_type: 'TRANSACTION.SUCCESS',
      summary: '支付成功',
      resource: {
        original_type: 'transaction',
        algorithm: 'AEAD_AES_256_GCM',
        ciphertext: 'xxx',
        associated_data: 'transaction',
        nonce: '3a8sk93zs3mP'
      }
    }
 */
export class WxpayCbDto {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: {
    original_type: string;
    algorithm: string;
    ciphertext: string;
    associated_data: string;
    nonce: string;
  };
}
