export class UserDTO {

  constructor(data:Partial<UserDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  email?: string|null;
  passwordHash?: string|null;
  role?: string|null;
  createdAt?: string|null;

}
