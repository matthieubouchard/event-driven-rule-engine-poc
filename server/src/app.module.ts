import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbService } from './db/db.service'
import { DbModule } from './db/db.module'
import { RuleModule } from './rule/rule.module'
import { createPubSubConfig, PubSubModule } from './pubsub/pubsub.module'
import { RuleEvaluationModule } from './rule-evaluation/rule-evaluation.module'
import { ClientsModule } from '@nestjs/microservices'
import { DocumentModule } from './document/document.module'
import { NotificationModule } from './notification/notification.module'

@Module({
  imports: [
    DbModule,
    RuleModule,
    PubSubModule,
    RuleEvaluationModule,
    DocumentModule,
    NotificationModule,
    // ClientsModule.register([createPubSubConfig('app')]),
  ],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
