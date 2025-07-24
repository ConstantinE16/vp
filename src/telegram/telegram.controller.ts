import { Controller, Post, Body } from '@nestjs/common'
import { TelegramService } from './telegram.service'

@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {}

    @Post('webhook')
    async handleUpdate(@Body() update: any) {
        console.log('🔔 Update received:', JSON.stringify(update, null, 2))
        return this.telegramService.handleUpdate(update)
    }
}