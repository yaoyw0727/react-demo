import { post } from '@/services/request';
import type { AuthUser } from '@/store/auth';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (params: LoginParams) => post<LoginResult>('/auth/login', params),

  register: (params: { username: string; password: string; email: string }) =>
    post<LoginResult>('/auth/register', params),
};
