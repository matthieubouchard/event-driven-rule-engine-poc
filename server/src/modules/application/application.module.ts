import { Module } from '@nestjs/common'

import { PubSubModule } from 'src/modules/pubsub/pubsub.module'

import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [PubSubModule],
})
export class ApplicationModule {}
