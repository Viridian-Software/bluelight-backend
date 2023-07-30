import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Server, Socket } from 'socket.io';
import { NotFoundException } from '@nestjs/common';

@WebSocketGateway()
export class SessionsGateway implements OnGatewayDisconnect {
  constructor(private readonly sessionsService: SessionsService) {}

  @WebSocketServer()
  server: Server;

  /*
    The Socket IO documentation explicitly states that the socket's ID is not meant to be
    used in applications because it is ephemeral, and can lead to unexpected behavior if, for
    example, the same user uses two browser windows which can lead to different socket IDs being
    tied to the same user. I am aware of this, but given the small scope of this application,
    I believe that this usage is warranted.
  */

  @SubscribeMessage('createSession')
  // From the client, send payload as {data: {userId: num}}
  create(
    @MessageBody() createSessionDto: any,
    @ConnectedSocket() client: Socket,
  ) {
    return this.sessionsService.create(createSessionDto, client.id);
  }

  @SubscribeMessage('findAllSessions')
  async findAll() {
    const sessions = await this.sessionsService.findAll();
    if (!sessions) {
      throw new NotFoundException('No Sessions Found');
    }
    return sessions;
  }

  @SubscribeMessage('findOneSession')
  async findOne(@MessageBody() id: number) {
    const session = await this.sessionsService.findOne(id);
    if (!session) {
      throw new NotFoundException('No Session Found for the Corresponding ID');
    }
    return session;
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

  @SubscribeMessage('test')
  test(@ConnectedSocket() client: Socket) {
    console.log(client.id);
  }

  @SubscribeMessage('getLastWeeksHours')
  getLastWeeksHours() {
    return this.sessionsService.getLastWeeksSessions();
  }

  handleDisconnect(client: Socket) {
    return this.sessionsService.getLastLogout(client.id);
  }
}
