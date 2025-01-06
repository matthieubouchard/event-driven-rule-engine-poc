import { Global, Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { PubSubService } from './pubsub.service'
import { mainClientConfig } from './config'

@Global()
@Module({
  imports: [ClientsModule.register([mainClientConfig])],
  providers: [PubSubService],
  exports: [PubSubService, ClientsModule],
})
export class PubSubModule {}
