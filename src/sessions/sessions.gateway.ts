import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@WebSocketGateway()
export class SessionsGateway {
  constructor(private readonly sessionsService: SessionsService) {}

  @SubscribeMessage('createSession')
  // From the client, send payload as {data: {userId: num}}
  create(@MessageBody() createSessionDto: any) {
    return this.sessionsService.create(createSessionDto);
  }

  @SubscribeMessage('findAllSessions')
  findAll() {
    return this.sessionsService.findAll();
  }

  @SubscribeMessage('findOneSession')
  findOne(@MessageBody() id: number) {
    return this.sessionsService.findOne(id);
  }

  @SubscribeMessage('updateSession')
  update(@MessageBody() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(updateSessionDto.id, updateSessionDto);
  }

  @SubscribeMessage('removeSession')
  remove(@MessageBody() id: number) {
    return this.sessionsService.remove(id);
  }

  @SubscribeMessage('findUserSessions')
  findUserSessions(@MessageBody() userId: number) {
    return this.sessionsService.findUserSessions(userId);
  }

  @SubscribeMessage('getWeeklyHours')
  getWeeklyHours(@MessageBody() userId: number) {
    return this.sessionsService.calculateWeeklyHours(userId);
  }

  @SubscribeMessage('enterLogoutTime')
  enterLogoutTime(@MessageBody() sessionId: number) {
    return this.sessionsService.updateLogout(sessionId);
  }
}
