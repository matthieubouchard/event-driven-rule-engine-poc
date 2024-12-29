import { Controller, Get } from '@nestjs/common'
import { DocumentService } from './document.service'
import { MessagePattern } from '@nestjs/microservices'

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('/')
  async findAll() {
    const docs = await this.documentService.findAll()
    console.log('DOCS', docs)
    return docs
  }
  @MessagePattern('document.request.created')
  async handleDocumentRequestCreated(message: any) {
    console.log(
      'DocumentController received document request created:',
      message,
    )
    // Do document specific things
  }
}
