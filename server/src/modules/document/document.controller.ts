import { Controller, Get, Logger } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'

import { RuleActionType } from '@prisma/client'
import { map } from 'lodash'
import { KAFKA_TOPICS } from 'src/modules/pubsub/config'
import { PubSubService } from 'src/modules/pubsub/pubsub.service'

import { DocumentService } from './document.service'

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly pubSubService: PubSubService,
  ) {}
  private readonly logger = new Logger(DocumentController.name)

  @Get('/')
  async findAll() {
    const docs = await this.documentService.findAll()
    return docs
  }
  @EventPattern(KAFKA_TOPICS.DOCUMENT_REQUESTED.name)
  async handleDocumentRequest(message: {
    payload: {
      actions: Array<{
        value: string
        type: RuleActionType
        description?: string
      }>
      applicationId: string
      ruleVersionId: string
    }
  }) {
    this.logger.log(
      'DocumentController received document request created:',
      message,
    )
    const documentRequests = await this.documentService.handleDocumentRequest(
      message.payload.applicationId,
      message.payload.actions,
    )
    await Promise.all(
      map(documentRequests, (request) => {
        this.pubSubService.publish<{ document: { name: string } }>({
          topic: KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name,
          payload: request,
        })
      }),
    )
  }
}
