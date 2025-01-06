import { Injectable } from '@nestjs/common'
import { CreateRuleDto } from '../../dto'
import { DbService } from 'src/modules/db/db.service'
import { InputJsonValue } from '@prisma/client/runtime/library'
import { RuleType } from '@prisma/client'

@Injectable()
export class RuleService {
  constructor(private readonly dbService: DbService) {}
  async createRule(createRuleDto: CreateRuleDto) {
    const ruleJson = {
      actions: createRuleDto.actions,
      conditions: createRuleDto.conditions,
    }
    const rule = this.dbService.client.rule.create({
      data: {
        versions: {
          create: {
            name: createRuleDto.name,
            description: createRuleDto?.description,
            version: 0,
            ruleJson: ruleJson as unknown as InputJsonValue,
            type: createRuleDto?.type ?? RuleType.APPLICATION,
          },
        },
      },
    })
    return rule
  }

  async updateRule(id: string, updatedRule: CreateRuleDto) {
    const ruleJson = {
      actions: updatedRule.actions,
      conditions: updatedRule.conditions,
    }
    const [latestVersion] = await this.dbService.client.ruleVersion.findMany({
      where: { ruleId: id },
      orderBy: { version: 'desc' },
      take: 1,
      select: { version: true },
    })

    const rule = this.dbService.client.rule.update({
      where: { id },
      data: {
        versions: {
          create: {
            name: updatedRule.name,
            description: updatedRule?.description,
            version: latestVersion.version + 1,
            ruleJson: ruleJson as unknown as InputJsonValue,
            type: updatedRule?.type ?? RuleType.APPLICATION,
          },
        },
      },
    })
    return rule
  }

  async findAll() {
    const rules = await this.dbService.client.rule.findMany({
      where: { active: true },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    })
    return rules
  }

  async findOne(id: string) {
    const rule = await this.dbService.client.rule.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    })
    return rule
  }

  async softDelete(id: string) {
    const toDelete = await this.dbService.client.rule.update({
      where: { id },
      data: { active: false },
    })
    return toDelete
  }
}
