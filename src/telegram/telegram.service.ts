import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name)
    private readonly botToken: string
    private readonly apiUrl: string

    constructor(private readonly configService: ConfigService,
                private readonly prisma: PrismaService,) {
        this.botToken = this.configService.get<string>('TG_BOT_TOKEN')!
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`
    }

    async handleUpdate(update: any) {
        const message = update.message
        if (!message) return

        const chatId = message.chat.id
        const text = message.text

        if (text === '/start') {
            await this.prisma.user.upsert({
                where: { telegramId: String(message.from.id) },
                update: {},
                create: {
                    telegramId: String(message.from.id),
                    firstName: message.from.first_name,
                    lastName: message.from.last_name,
                    username: message.from.username,
                },
            })

            await this.sendMessage(chatId, '👋 Добро пожаловать на форум!')
        } else if (text === '/program') {
            await this.sendMessage(chatId, '📅 Программа будет опубликована позже.')
        } else {
            await this.sendMessage(chatId, '🤖 Неизвестная команда.')
        }
    }

    async sendMessage(chatId: number, text: string) {
        try {
            await axios.post(`${this.apiUrl}/sendMessage`, {
                chat_id: chatId,
                text,
            })
        } catch (err) {
            this.logger.error('Ошибка при отправке сообщения:', err)
        }
    }
}