import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule], // 👈 обязательно указать тут
  providers: [TelegramService],
  controllers: [TelegramController]
})
export class TelegramModule {}
