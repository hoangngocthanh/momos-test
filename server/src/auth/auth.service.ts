import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { AUTH_ERRORS, AUTH_SUCCESS } from 'constants/auth';
import { UserService } from 'src/user/user.service';
import { CustomErrorException } from 'utils/api-error';
import { CustomResponse } from 'utils/api-response';

const SALT_ROUNDS = 10;

export interface UserTokenPayload {
  email: string;
  provider: 'email';
  userId: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async genPasswordHash(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    const passwordHash = await hash(password, salt);

    return passwordHash;
  }

  private async validatePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isPasswordMatched = await compare(password, hashPassword);
    return isPasswordMatched;
  }

  async loginByEmail(
    email: string,
    password: string,
  ): Promise<
    | CustomResponse<{
        access_token: string;
      }>
    | Error
  > {
    try {
      const user = await this.userService.findUserByEmail(email);
      console.log({ user });
      if (!user) {
        throw new CustomErrorException(
          AUTH_ERRORS.LOGIN_FAILED_DUE_TO_USER_NOT_EXIST.message,
          AUTH_ERRORS.LOGIN_FAILED_DUE_TO_USER_NOT_EXIST.statusCode,
        );
      }
      const userPassword = user.password;

      const isPasswordValid = await this.validatePassword(
        password,
        userPassword,
      );

      if (!isPasswordValid) {
        throw new CustomErrorException(
          AUTH_ERRORS.LOGIN_FAILED_DUE_TO_WRONG_PASSWORD.message,
          AUTH_ERRORS.LOGIN_FAILED_DUE_TO_WRONG_PASSWORD.statusCode,
        );
      }

      const payload: UserTokenPayload = {
        email,
        provider: 'email',
        userId: user.id,
        sub: user.id,
      };
      const token = this.jwtService.sign(payload);
      return new CustomResponse(
        true,
        {
          access_token: token,
        },
        AUTH_SUCCESS.LOGIN_SUCCESS.message,
        AUTH_SUCCESS.LOGIN_SUCCESS.statusCode,
      );
    } catch (error) {
      console.log({ error });
      if (error instanceof CustomErrorException) {
        throw error;
      }

      throw new CustomErrorException(
        AUTH_ERRORS.UNKNOWN_ERROR.message,
        AUTH_ERRORS.UNKNOWN_ERROR.statusCode,
      );
    }
  }

  async signUpByEmail(
    email: string,
    password: string,
  ): Promise<
    | CustomResponse<{
        access_token: string;
      }>
    | Error
  > {
    try {
      const oldUser = await this.userService.findUserByEmail(email);
      if (oldUser) {
        throw new CustomErrorException(
          AUTH_ERRORS.SIGN_UP_BY_EMAIL_FAILED_DUE_TO_USER_EXISTED.message,
          AUTH_ERRORS.SIGN_UP_BY_EMAIL_FAILED_DUE_TO_USER_EXISTED.statusCode,
        );
      }

      const passwordHash = await this.genPasswordHash(password);
      const user = await this.userService.createUser({
        email,
        password: passwordHash,
      });

      if (!user) {
        throw new CustomErrorException(
          AUTH_ERRORS.UNKNOWN_ERROR.message,
          AUTH_ERRORS.UNKNOWN_ERROR.statusCode,
        );
      }

      const tokenData = await this.loginByEmail(email, password);

      if (tokenData instanceof Error) {
        throw tokenData;
      }

      return new CustomResponse(
        true,
        {
          access_token: tokenData.data.access_token,
        },
        AUTH_SUCCESS.SIGNUP_SUCCESS.message,
        AUTH_SUCCESS.SIGNUP_SUCCESS.statusCode,
      );
    } catch (error) {
      console.error('sign up error', error);
      if (error instanceof CustomErrorException) {
        throw error;
      }
      throw new CustomErrorException(
        AUTH_ERRORS.UNKNOWN_ERROR.message,
        AUTH_ERRORS.UNKNOWN_ERROR.statusCode,
      );
    }
  }
}
