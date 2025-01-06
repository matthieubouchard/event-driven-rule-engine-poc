import { Module } from '@nestjs/common'

import { PubSubModule } from 'src/modules/pubsub/pubsub.module'

import { DocumentController } from './document.controller'
import { DocumentService } from './document.service'

@Module({
  imports: [PubSubModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
