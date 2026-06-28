import type { User } from '../../modules/users/entities/user.entity';

export interface UserResponse {
  id: string;
  login: string;
  name: string;
  birthday: string;
  gender: string;
}

export function serializeUser(user: User): UserResponse {
  return {
    id: user.id,
    login: user.login,
    name: user.name,
    birthday: user.birthday,
    gender: user.gender,
  };
}
