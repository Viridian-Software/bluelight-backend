import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isSameWeek } from 'date-fns';
import { isDateBetweenLastWeekMondayAndFriday } from 'src/functions';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  //TODO: Fix the type annotations for create and update session DTOs
  async create(createSessionDto: any, clientId: string) {
    let allSessions = (
      await this.prisma.session.findMany({
        where: { userId: createSessionDto.data.userId },
      })
    ).pop();
    if (allSessions) {
      let timeDelta =
        allSessions.logoutTime.getTime() - allSessions.loginTime.getTime();
      if (timeDelta <= 30000) {
        return this.prisma.session.update({
          where: { id: allSessions.id },
          data: { socketId: clientId },
        });
      }
    }
    let user = await this.prisma.session.create({
      data: {
        socketId: clientId,
        user: { connect: { id: createSessionDto.data.userId } },
      },
    });
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
    let userSessions = (await this.prisma.session.findMany()).filter(
      (session) => session.userId === userId,
    );
    let currentDate = new Date();
    let currentWeekSessions = userSessions.filter((session) =>
      isSameWeek(session.loginTime, currentDate, { weekStartsOn: 1 }),
    );
    currentWeekSessions = currentWeekSessions.filter(
      (session) => session.logoutTime !== null,
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

  async getLastLogout(socketId: string) {
    let lastSession = await this.prisma.session.findFirst({
      where: { socketId },
    });
    if (Object.is(lastSession, null)) {
      return;
    }
    if (Object.is(lastSession.logoutTime, null)) {
      return this.updateLogout(lastSession.id);
    }
    return lastSession.id;
  }

  async getLastWeeksSessions() {
    const sessions = await this.prisma.session.findMany();
    const lastWeeksSessions = sessions.filter((session) =>
      isDateBetweenLastWeekMondayAndFriday(session.loginTime),
    );
    return lastWeeksSessions;
  }
}
