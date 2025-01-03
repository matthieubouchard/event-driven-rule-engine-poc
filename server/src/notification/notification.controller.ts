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
      console.log('RECEVED NOTIFICatoin in subscritpon', notification)
      res.write(`data: ${JSON.stringify(notification)}\n\n`)
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
