import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
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
    if (!user || user.password !== password) {
      return false;
    }
    return user;
  }

  getActiveUsers() {
    return this.prisma.user.findMany({
      where: { isCurrentlyActive: true },
    });
  }

  setActiveStatus(userInfo: { id: number; status: boolean }) {
    const { id, status } = userInfo;
    return this.prisma.user.update({
      where: { id },
      data: { isCurrentlyActive: !status },
    });
  }
}
