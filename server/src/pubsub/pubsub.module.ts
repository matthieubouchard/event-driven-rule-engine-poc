import { Module } from '@nestjs/common'
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices'
import { PubSubService } from './pubsub.service'
import { PubsubController } from './pubsub.controller'

export const kafkaOptions = {
  client: {
    clientId: 'pubsub-client',
    brokers: ['localhost:9092'],
  },
  consumer: {
    groupId: 'pubsub-consumer',
  },
}

export const createPubSubConfig = (
  groupName: string,
): ClientProviderOptions => ({
  name: `PUBSUB_CLIENT`,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: `${groupName}-client`,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: `${groupName}-consumer`,
    },
  },
})

@Module({
  imports: [ClientsModule.register([createPubSubConfig('pubsub')])],
  providers: [PubSubService],
  controllers: [PubsubController],
  exports: [PubSubService],
})
export class PubSubModule {}
