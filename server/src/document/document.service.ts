import { Injectable } from '@nestjs/common'
import { DocumentStatus } from '@prisma/client'
import { map } from 'lodash'
import { DbService } from 'src/db/db.service'
import { Action } from 'src/rule/dto/create-rule.dto'

@Injectable()
export class DocumentService {
  constructor(private readonly dbService: DbService) {}
  async findAll() {
    return this.dbService.client.document.findMany()
  }
  async updateOrCreateDocumentRequest(
    applicationId: string,
    documentId: string,
    status?: DocumentStatus,
  ) {
    const result = await this.dbService.client.documentRequest.upsert({
      where: {
        applicationId_documentId: {
          applicationId,
          documentId,
        },
      },
      create: {
        applicationId,
        documentId,
        status: DocumentStatus.REQUESTED,
      },
      update: {
        status: status || DocumentStatus.REQUESTED,
        updatedAt: new Date(),
      },
      select: {
        document: { select: { name: true } },
      },
    })
    console.log('DOCUMETN REquest result', result)
    return result
  }
  async handleDocumentRequest(applicationId: string, actions: Action[]) {
    const result = await Promise.all(
      map(actions, (a) =>
        this.updateOrCreateDocumentRequest(applicationId, a.value),
      ),
    )

    return result
  }
}
