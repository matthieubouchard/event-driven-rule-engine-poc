import { Controller, Get, Logger, Request, Res } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'

import { Subject } from 'rxjs'
import { KAFKA_TOPICS } from 'src/modules/pubsub/config'

@Controller('notification')
export class NotificationController {
  constructor() {}
  private clientEventEmitter = new Subject<any>()
  private readonly logger = new Logger(NotificationController.name)

  @Get('/sse')
  async connect(@Res() res, @Request() req) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const subscription = this.clientEventEmitter.subscribe((notification) => {
      this.logger.debug(
        'Received notification in client event emitter subscription: ',
        notification,
      )
      res.write(`data: ${JSON.stringify(notification)}\n\n`)
    })

    req.on('close', () => {
      subscription.unsubscribe()
    })
  }

  @EventPattern(KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name)
  async handleDocumentRequest(message: any) {
    this.logger.debug(
      `Received EVENT: ${KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name}: `,
      message,
    )

    this.clientEventEmitter.next({
      type: KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name,
      payload: message,
      timestamp: new Date().toISOString(),
    })
  }
  @EventPattern(KAFKA_TOPICS.APPLICATION_SUBMITTED.name)
  async handleApplicationSubmit(message: any) {
    this.logger.debug(
      `Received EVENT: ${KAFKA_TOPICS.APPLICATION_SUBMITTED.name}: `,
      message,
    )
    this.clientEventEmitter.next({
      type: KAFKA_TOPICS.APPLICATION_SUBMITTED.name,
      payload: message,
      timestamp: new Date().toISOString(),
    })
  }
  @EventPattern(KAFKA_TOPICS.NO_RULES_MATCHED.name)
  async handleNoMatchingRules(message: any) {
    this.logger.debug(
      `Received EVENT: ${KAFKA_TOPICS.NO_RULES_MATCHED.name}: `,
      message,
    )
    this.clientEventEmitter.next({
      type: KAFKA_TOPICS.NO_RULES_MATCHED.name,
      payload: message,
      timestamp: new Date().toISOString(),
    })
  }
}
