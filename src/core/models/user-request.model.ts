export class UserRequest {
  public email: string;
  public password: string;
  public username: string;

  constructor({
    email = '',
    password = '',
    username = '',
  }: {
    email?: string;
    password?: string;
    username?: string;
  }) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}
