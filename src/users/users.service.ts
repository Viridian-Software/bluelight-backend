import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hash = bcrypt.hashSync(createUserDto.password, 10);
    createUserDto.password = hash;
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    let users = await this.prisma.user.findMany();
    users.forEach((user) => delete user.password);
    return users;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async handleLogin(userInfo: { email: string; password: string }) {
    const { email, password } = userInfo;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || bcrypt.compareSync(password, user.password) !== true) {
      return false;
    }
    return user;
  }

  getActiveUsers() {
    return this.prisma.user.findMany({
      where: { isCurrentlyActive: true },
    });
  }

  setActiveStatus(
    userInfo: { userId: number; status: boolean },
    socketId: string,
  ) {
    const id = userInfo.userId;
    const status = userInfo.status;
    return this.prisma.user.update({
      where: { id },
      data: { isCurrentlyActive: !status, socketId: socketId },
    });
  }

  async handleDisconnect(socketId: string) {
    const user = await this.prisma.user.findFirst({ where: { socketId } });
    if (Object.is(user, null)) {
      return;
    }
    if (user.isCurrentlyActive === true) {
      return this.prisma.user.update({
        where: { id: user.id },
        data: { isCurrentlyActive: false },
      });
    } else {
      return;
    }
  }

  getUsersAndSessions() {
    return this.prisma.user.findMany({
      include: {
        Session: true,
      },
    });
  }
}
