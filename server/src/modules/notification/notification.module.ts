import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { ClientsModule } from '@nestjs/microservices'
// import {
//   createConsumerConfig,
//   createKafkaClientConfig,
//   PUBSUB_CLIENTS,
// } from 'src/pubsub/config'

@Module({
  // imports: [
  //   ClientsModule.register([
  //     createKafkaClientConfig(PUBSUB_CLIENTS.NOTIFICATION),
  //   ]),
  // ],
  controllers: [NotificationController],
})
export class NotificationModule {}
