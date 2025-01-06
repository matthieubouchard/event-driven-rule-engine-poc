import { Injectable } from '@nestjs/common'

import { TryCatch } from 'decorators'
import { DbService } from 'src/modules/db/db.service'
import { KAFKA_TOPICS } from 'src/modules/pubsub/config'
import { PubSubService } from 'src/modules/pubsub/pubsub.service'

@Injectable()
export class ApplicationService {
  constructor(
    private readonly dbService: DbService,
    private readonly pubSubService: PubSubService,
  ) {}
  @TryCatch({ defaultValue: [] })
  async findAll() {
    return this.dbService.client.application.findMany({
      select: {
        id: true,
        familyStatus: true,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
        student: { select: { firstName: true, lastName: true, dob: true } },
        school: { select: { name: true } },
        documentRequests: {
          select: {
            id: true,
            status: true,
            document: { select: { name: true } },
            requestedAt: true,
            updatedAt: true,
          },
        },
        ruleAudits: {
          orderBy: { evaluatedAt: 'desc' },
          take: 20,
          select: {
            id: true,
            ruleVersion: { select: { version: true, name: true } },
            matched: true,
            evaluatedAt: true,
          },
        },
      },
    })
  }
  @TryCatch({
    defaultValue: {
      success: false,
      message: `Error processing application`,
    },
  })
  async processApplication(applicationId: string) {
    await this.pubSubService.publish<{ applicationId: string }>({
      topic: KAFKA_TOPICS.APPLICATION_SUBMITTED.name,
      payload: {
        applicationId,
      },
    })
    return {
      success: true,
      message: `Processing application: ${applicationId}`,
    }
  }
}
