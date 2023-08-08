import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UsersGateway implements OnGatewayDisconnect {
  constructor(private readonly usersService: UsersService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createUser')
  async create(@MessageBody() createUserDto: CreateUserDto) {
    try {
      const result = await this.usersService.create(createUserDto);
      return result;
    } catch (error) {
      return 'User Creation failed. Email already exists';
    }
  }

  @SubscribeMessage('findAllUsers')
  async findAll() {
    return this.usersService.findAll();
  }

  @SubscribeMessage('findOneUser')
  findOne(@MessageBody() id: number) {
    return this.usersService.findOne(id);
  }

  @SubscribeMessage('updateUser')
  update(@MessageBody() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @SubscribeMessage('removeUser')
  remove(@MessageBody() id: number) {
    return this.usersService.remove(id);
  }

  @SubscribeMessage('findByEmail')
  findByEmail(@MessageBody() email: string) {
    return this.usersService.findByEmail(email);
  }

  @SubscribeMessage('loginUser')
  handleLogin(@MessageBody() userInfo: { email: string; password: string }) {
    return this.usersService.handleLogin(userInfo);
  }

  @SubscribeMessage('getActiveUsers')
  getActiveUsers(@MessageBody() {}) {
    return this.usersService.getActiveUsers();
  }

  @SubscribeMessage('setActiveStatus')
  setActiveStatus(
    @MessageBody() userInfo: { userId: number; status: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('userStatusChanged');
    return this.usersService.setActiveStatus(userInfo, client.id);
  }

  @SubscribeMessage('getUsersAndSessions')
  getUsersAndSessions() {
    return this.usersService.getUsersAndSessions();
  }

  handleDisconnect(client: Socket) {
    return this.usersService.handleDisconnect(client.id);
  }
}
