import { Controller, Get, Request, Res } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { Subject } from 'rxjs'
import { KAFKA_TOPICS } from 'src/pubsub/config'

@Controller('notification')
export class NotificationController {
  constructor() {}

  private clientEventEmitter = new Subject<any>()

  @Get('/sse')
  async connect(@Res() res, @Request() req) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const subscription = this.clientEventEmitter.subscribe((notification) => {
      console.log('RECEVED NOTIFICatoin in subscritpon', notification)
      res.write(`data: ${JSON.stringify(notification)}\n\n`)
    })

    req.on('close', () => {
      subscription.unsubscribe()
    })
  }

  @EventPattern(KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name)
  async handleDocumentRequest(message: any) {
    console.log('RECEIVED NOTIFICAToin in event pattern', message)
    this.clientEventEmitter.next({
      type: KAFKA_TOPICS.DOCUMENT_REQUEST_CREATED.name,
      payload: message,
      timestamp: new Date().toISOString(),
    })
  }
}
