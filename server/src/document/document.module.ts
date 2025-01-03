import { Module } from '@nestjs/common'
import { DocumentService } from './document.service'
import { DocumentController } from './document.controller'
import { PubSubModule } from 'src/pubsub/pubsub.module'

@Module({
  imports: [PubSubModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
