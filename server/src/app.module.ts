import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DbService } from './db/db.service';
import { DbModule } from './db/db.module';
import { RuleModule } from './rule/rule.module';

@Module({
  imports: [DbModule, RuleModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
