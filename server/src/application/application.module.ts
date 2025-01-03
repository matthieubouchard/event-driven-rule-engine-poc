import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { PubSubModule } from 'src/pubsub/pubsub.module'

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [PubSubModule],
})
export class ApplicationModule {}
