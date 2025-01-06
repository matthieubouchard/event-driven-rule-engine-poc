import { Global, Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { mainClientConfig } from './config'
import { PubSubService } from './pubsub.service'

@Global()
@Module({
  imports: [ClientsModule.register([mainClientConfig])],
  providers: [PubSubService],
  exports: [PubSubService, ClientsModule],
})
export class PubSubModule {}
