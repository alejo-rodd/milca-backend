import { Body, Controller, Post } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { WhatsAppMessage } from './interfaces/whatsapp-message.interface';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {

  }
  @Post('send-whatspp')
  sendwhatsApp(@Body() message: WhatsAppMessage){
    return this.twilioService.sendWhatsApp(message);
  }
}
