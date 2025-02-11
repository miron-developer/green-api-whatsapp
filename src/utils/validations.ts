export const validateOnlyDigits = (v: string) => {
  return !/\D+/gm.test(v);
};

export const validateGreenAPIUrl = (v: string) => {
  return /^https:\/\/\d+.api.greenapi.com$/gm.test(v);
};
