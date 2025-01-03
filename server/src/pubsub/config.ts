import { ClientProviderOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

export const KAFKA_CLIENT = 'KAFKA_CLIENT'

export const KAFKA_TOPICS = {
  APPLICATION_SUBMITTED: {
    name: 'application.submitted',
    partitions: 3,
    config: {
      'cleanup.policy': 'delete',
      'retention.ms': '604800000', // 7 days
    },
  },
  DOCUMENT_REQUESTED: {
    name: 'document.requested',
    partitions: 3,
    config: {
      'cleanup.policy': 'delete',
      'retention.ms': '604800000',
    },
  },
  DOCUMENT_REQUEST_CREATED: {
    name: 'document.request.created',
    partitions: 3,
    config: {
      'cleanup.policy': 'delete',
      'retention.ms': '604800000',
    },
  },
}

// re-usable util for creating separate clients/consumers
export const createKafkaClientConfig = (
  clientName: string,
): ClientProviderOptions => ({
  name: clientName,
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: clientName,
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: `${clientName}-consumer`,
      allowAutoTopicCreation: true,
    },
    producer: {
      createPartitioner: Partitioners.LegacyPartitioner,
    },
    subscribe: {
      fromBeginning: false,
    },
  },
})

export const mainClientConfig = createKafkaClientConfig(KAFKA_CLIENT)
