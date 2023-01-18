import axios from 'axios';

function CaptchaValidationError(message) {
  this.name = 'CaptchaValidationError';
  this.message = message;
}

const captchaValidation = (captcha, remoteAddress) => {
  CaptchaValidationError.prototype = Error.prototype;

  if (
    !captcha ||
    captcha.trim() === '' ||
    captcha === undefined ||
    captcha === null
  ) {
    throw new CaptchaValidationError('captcha validation is required !');
  }

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captcha}&remoteip=${remoteAddress}`;

  return axios(verifyUrl, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  })
    .then((res) => res.data)
    .then((response) => {
      if (!response.success) {
        throw new CaptchaValidationError(
          'captcha validation failed ! please try again'
        );
      }
      return Promise.resolve(true);
    });
};

export default {
  captchaValidation,
  CaptchaValidationError,
};
