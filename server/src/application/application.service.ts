import { Injectable } from '@nestjs/common'
import { DbService } from 'src/db/db.service'
import { PubSubService } from 'src/pubsub/pubsub.service'

@Injectable()
export class ApplicationService {
  constructor(
    private readonly dbService: DbService,
    private readonly pubSubService: PubSubService,
  ) {}
  async findAll() {
    return this.dbService.client.application.findMany({
      select: {
        id: true,
        familyStatus: true,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
        student: { select: { firstName: true, lastName: true, dob: true } },
        ruleAudits: {
          orderBy: { evaluatedAt: 'desc' },
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
  async processApplication(applicationId: string) {
    await this.pubSubService.publish({
      topic: 'application.submitted',
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
