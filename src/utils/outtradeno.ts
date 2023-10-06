export const OutTradeNo32 = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  const day = ('0' + now.getDate()).slice(-2);

  const hour = ('0' + now.getHours()).slice(-2);
  const minute = ('0' + now.getMinutes()).slice(-2);
  const second = ('0' + now.getSeconds()).slice(-2);
  const millisecond = ('00' + now.getMilliseconds()).slice(-3);

  let outTradeNo = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  while (outTradeNo.length < 32) {
    outTradeNo += Math.floor(Math.random() * 10);
  }

  return outTradeNo;
};
