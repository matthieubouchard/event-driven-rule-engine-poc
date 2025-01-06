import { Injectable, Inject } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { KAFKA_CLIENT } from './config'

interface PubSubMessage<T = any> {
  topic: string
  payload: T
  metadata?: Record<string, any>
}

@Injectable()
export class PubSubService {
  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.connect()
  }

  async publish<T>(message: PubSubMessage<T>): Promise<void> {
    this.client.emit(message.topic, {
      payload: message.payload,
      metadata: {
        timestamp: new Date().toISOString(),
        ...message.metadata,
      },
    })
  }
}
