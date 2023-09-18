export const getRandomVerificationCode4 = () => {
  const code: string[] = [];
  for (let i = 0; i < 4; i++) {
    code.push(Math.floor(Math.random() * 10).toString());
  }
  return code.join('');
};
