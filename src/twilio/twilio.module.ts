import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { TwilioController } from './twilio.controller';

@Module({
  controllers: [TwilioController],
  providers: [TwilioService],
  exports: [TwilioService], // Export the service to be used in other modules
})
export class TwilioModule {}
