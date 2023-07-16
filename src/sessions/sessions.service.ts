import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isSameWeek } from 'date-fns';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  //TODO: Fix the type annotations for create and update session DTOs
  async create(createSessionDto: any) {
    let user = await this.prisma.session.create(createSessionDto);
    return user;
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

  /*
    This function calculates and returns the total amount of time spent in sessions for
    each employee for the current week. Input parameter is the relevant user's ID and the return
    is in milliseconds.
  */
  async calculateWeeklyHours(userId: number) {
    let userSessions = await this.prisma.session.findMany({
      where: { id: userId },
    });
    let currentDate = Date.now();
    let currentWeekSessions = userSessions.filter((session) =>
      isSameWeek(session.loginTime, currentDate, { weekStartsOn: 1 }),
    );
    return currentWeekSessions.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (currentValue.logoutTime.getTime() - currentValue.loginTime.getTime()),
      0,
    );
  }

  updateLogout(sessionId: number) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { logoutTime: new Date() },
    });
  }
}
