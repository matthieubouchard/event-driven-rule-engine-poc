import { Controller, Get, Inject, Request, Res } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { Subject } from 'rxjs'

@Controller('notification')
export class NotificationController {
  constructor() {}
  private eventEmitter = new Subject<any>()

  @Get('/sse')
  async connect(@Res() res, @Request() req) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const subscription = this.eventEmitter.subscribe((notification) => {
      res.write(`data: ${JSON.stringify(notification)}\n\n`)
    })

    const notifications = [
      'DOCUMENT_REQUESTED',
      'APPLICATION_SUBMITTED',
      'RULE_EVALUATED',
    ]
    notifications.forEach((type) => {
      this.eventEmitter.next({
        type,
        payload: 'HELLO WORLD',
        timestamp: new Date().toISOString(),
      })
    })

    req.on('close', () => {
      subscription.unsubscribe()
    })
  }

  @MessagePattern('document.requested')
  async handleDocumentRequest(message: any) {
    this.eventEmitter.next({
      type: 'DOCUMENT_REQUESTED',
      payload: message,
      timestamp: new Date().toISOString(),
    })
  }
}
