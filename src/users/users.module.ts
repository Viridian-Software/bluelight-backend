import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UsersGateway, UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
