import { Controller, Get } from '@nestjs/common'
import { DocumentService } from './document.service'
import { EventPattern } from '@nestjs/microservices'
import { KAFKA_TOPICS } from 'src/pubsub/config'
import { PubSubService } from 'src/pubsub/pubsub.service'
import { map } from 'lodash'

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly pubSubService: PubSubService,
  ) {}

  @Get('/')
  async findAll() {
    const docs = await this.documentService.findAll()
    return docs
  }
  @EventPattern(KAFKA_TOPICS.DOCUMENT_REQUESTED.name)
  async handleDocumentRequest(message: any) {
    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!DocumentController received document request created:',
      message,
    )
    const documentRequests = await this.documentService.handleDocumentRequest(
      message.payload.applicationId,
      message.payload.actions,
    )
    await Promise.all(
      map(documentRequests, (request) => {
        this.pubSubService.publish({
          topic: KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name,
          payload: request,
        })
      }),
    )
  }
}
