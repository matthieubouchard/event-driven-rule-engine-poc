import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbService } from './db/db.service'
import { DbModule } from './db/db.module'
import { RuleModule } from './rule/rule.module'
import { PubSubModule } from './pubsub/pubsub.module'

@Module({
  imports: [DbModule, RuleModule, PubSubModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
