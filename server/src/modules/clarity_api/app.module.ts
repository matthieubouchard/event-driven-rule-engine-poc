import { Module } from '@nestjs/common'

import { ApplicationModule } from '../application/application.module'
import { DbModule } from '../db/db.module'
import { DbService } from '../db/db.service'
import { DocumentModule } from '../document/document.module'
import { NotificationModule } from '../notification/notification.module'
import { PubSubModule } from '../pubsub/pubsub.module'
import { RuleModule } from '../rule/rule.module'
import { RuleEvaluationModule } from '../rule-evaluation/rule-evaluation.module'

@Module({
  imports: [
    DbModule,
    RuleModule,
    PubSubModule,
    RuleEvaluationModule,
    DocumentModule,
    NotificationModule,
    ApplicationModule,
  ],
  providers: [DbService],
})
export class AppModule {}
