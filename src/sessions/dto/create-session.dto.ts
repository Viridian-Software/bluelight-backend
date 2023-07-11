import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateSessionDto {
  user: CreateUserDto;
  loginTime: Date;
  userId: number;
}
