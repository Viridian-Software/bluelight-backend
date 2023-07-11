import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SessionsGateway, SessionsService],
  imports: [PrismaModule],
})
export class SessionsModule {}
