import { Injectable } from '@nestjs/common'
import { Engine } from 'json-rules-engine'
import { DbService } from 'src/db/db.service'
import { map, get } from 'lodash'
import { RuleType } from '@prisma/client'

@Injectable()
export class RuleEvaluationService {
  constructor(private readonly dbService: DbService) {}
  async evaluateApplicationRule(applicationId: string) {
    const [application, rules] = await Promise.all([
      this.dbService.client.application.findUnique({
        where: { id: applicationId },
      }),
      this.dbService.client.rule.findMany({
        where: {
          active: true,
        },
        include: {
          versions: {
            orderBy: { version: 'desc' },
            take: 1,
            where: { type: RuleType.APPLICATION },
          },
        },
      }),
    ])
    console.log('application', application)
    console.log('rules', rules)

    const engine = new Engine()

    // Add rules to engine
    for (const rule of rules) {
      const ruleVersion = get(rule, 'versions[0]')
      console.log('rule veresion', ruleVersion.ruleJson)
      const conditions = get(ruleVersion, 'ruleJson.conditions', [])
      // const actions = get(ruleVersion, 'ruleJson.actions', [])
      engine.addRule({
        name: ruleVersion.name,
        event: {
          type: 'RULE_EVALUATION',
          params: {
            ruleVersionId: ruleVersion.id,
          },
        },
        conditions: {
          any: map(conditions, (c) => ({
            fact: c.fact, // TODO: change this to fact
            operator: 'equal',
            value: c.value,
          })),
        },
      })
    }

    // Prepare facts from application
    const facts = {
      familyStatus: application.familyStatus,
      isBusinessOwner: application.isBusinessOwner,
      file2021: application.filedUsTaxes2021,
    }

    try {
      const result = await engine.run(facts)
      console.log('EVENTS', result)
      // Create audit records
      await Promise.all([
        ...result.events.map((event) =>
          this.dbService.client.ruleAudit.create({
            data: {
              ruleVersionId: event.params.ruleVersionId,
              applicationId,
              matched: true,
            },
          }),
        ),
        ...result.failureEvents.map((event) =>
          this.dbService.client.ruleAudit.create({
            data: {
              ruleVersionId: event.params.ruleVersionId,
              applicationId,
              matched: false,
            },
          }),
        ),
      ])
      return { actionableRules: result.events }
    } catch (error) {
      console.error('Rule evaluation failed:', error)
      throw error
    }
  }
}
