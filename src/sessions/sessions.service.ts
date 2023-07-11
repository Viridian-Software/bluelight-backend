import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  //TODO: Fix the type annotations for create and update session DTOs
  create(createSessionDto: any) {
    return this.prisma.session.create({ data: createSessionDto });
  }

  findAll() {
    return this.prisma.session.findMany();
  }

  findOne(id: number) {
    return this.prisma.session.findUnique({ where: { id } });
  }

  update(id: number, updateSessionDto: any) {
    return this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  remove(id: number) {
    return this.prisma.session.delete({ where: { id } });
  }

  findUserSessions(userId: number) {
    return this.prisma.session.findMany({ where: { userId } });
  }
}
