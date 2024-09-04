import { HttpStatus } from '@nestjs/common';

export const AUTH_ERRORS = {
  LOGIN_FAILED_DUE_TO_USER_NOT_EXIST: {
    message: "User doesn't exist.",
    statusCode: HttpStatus.NOT_FOUND,
  },
  LOGIN_FAILED_DUE_TO_WRONG_PASSWORD: {
    message: 'Password is incorrect',
    statusCode: HttpStatus.UNAUTHORIZED,
  },

  SIGN_UP_BY_EMAIL_FAILED_DUE_TO_USER_EXISTED: {
    message: 'The email is already registered',
    statusCode: HttpStatus.CONFLICT,
  },
  UNKNOWN_ERROR: {
    message:
      'There was an error while processing your request, please try again',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};

export const AUTH_SUCCESS = {
  LOGIN_SUCCESS: {
    message: 'Login successful',
    statusCode: HttpStatus.OK,
  },
  SIGNUP_SUCCESS: {
    message: 'Signup successful',
    statusCode: HttpStatus.OK,
  },
  FORGOT_PASSWORD_SUCCESS: {
    message: 'Forgot password successful',
    statusCode: HttpStatus.OK,
  },
  RESET_PASSWORD_SUCCESS: {
    message: 'Reset password successful',
    statusCode: HttpStatus.OK,
  },
};
