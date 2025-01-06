import { Module } from '@nestjs/common'
import { DbService } from '../db/db.service'
import { DbModule } from '../db/db.module'
import { RuleModule } from '../rule/rule.module'
import { PubSubModule } from '../pubsub/pubsub.module'
import { RuleEvaluationModule } from '../rule-evaluation/rule-evaluation.module'
import { DocumentModule } from '../document/document.module'
import { NotificationModule } from '../notification/notification.module'
import { ApplicationModule } from '../application/application.module'

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
