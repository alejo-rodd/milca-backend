import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { WhatsAppMessage } from './interfaces/whatsapp-message.interface';

@Injectable()
export class TwilioService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendWhatsApp(message: WhatsAppMessage): Promise<void> {

    const { to, body} = message;
    // const from = process.env.TWILIO_PHONE_NUMBER; // Tu número sandbox de Twilio
    const from = 'whatsapp:+14155238886'; // Tu número sandbox de Twilio

    await this.client.messages.create({
      body,
      from,
      to: `whatsapp:+57${to}`, // Ej: whatsapp:+573001112233
    });
  }
}
