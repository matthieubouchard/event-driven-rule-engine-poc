import { Controller } from '@nestjs/common'
import { PubSubService } from './pubsub.service'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller()
export class PubsubController {
  constructor(private readonly pubsubService: PubSubService) {}

  @MessagePattern('document.received')
  async handleApplication(@Payload() message: any) {
    console.log('PUBSUB controller received!!!:', message)
    // Do rules specific things
  }
}
