import dayjs from 'dayjs';

export const combineDateAndTime = (date: Date, time: string) => {
  const sdate = dayjs(date).format('YYYYMMDD');
  const dateTime = dayjs(`${sdate} ${time}`, 'YYYYMMDD HH:mm:ss');
  return dateTime;
};
