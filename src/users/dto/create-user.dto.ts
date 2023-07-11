export class CreateUserDto {
  fname: string;
  lname: string;
  email: string;
  isAdmin?: boolean;
  password: string;
}
