import { Injectable, Logger } from '@nestjs/common'

import { Application, RuleType } from '@prisma/client'
import { Engine } from 'json-rules-engine'
import { map, get } from 'lodash'
import {
  BusinessOwnerCondition,
  FamilyStatusCondition,
  Filed2021Condition,
  RuleConditionFact,
} from 'src/dto'
import { DbService } from 'src/modules/db/db.service'

@Injectable()
export class RuleEvaluationService {
  constructor(private readonly dbService: DbService) {}
  private readonly logger = new Logger(RuleEvaluationService.name)

  async evaluateSingleApplicationRule(
    application: Partial<Application>,
    conditions: (
      | FamilyStatusCondition
      | BusinessOwnerCondition
      | Filed2021Condition
    )[],
  ) {
    this.logger.debug(`Evaluating conditions for application:`, application)

    const engine = new Engine()

    engine.addRule({
      name: 'Preview Rule',
      event: {
        type: 'RULE_EVALUATION',
        params: {
          applicationId: application.id,
        },
      },
      conditions: {
        any: map(conditions, (c) => ({
          fact: c.fact,
          operator: 'equal',
          value: c.value,
        })),
      },
    })

    // Set up facts from application
    const facts = {
      familyStatus: application.familyStatus,
      isBusinessOwner: application.isBusinessOwner,
      filedUsTaxes2021: application.filedUsTaxes2021,
    }

    this.logger.debug(`Evaluating facts:`, facts)

    try {
      const result = await engine.run(facts)
      return result
    } catch (error) {
      this.logger.error(`Rule evaluation failed: ${error.message}`)
      throw error
    }
  }

  async countMatchingApplications(
    conditions: (
      | FamilyStatusCondition
      | BusinessOwnerCondition
      | Filed2021Condition
    )[],
  ) {
    this.logger.debug('Counting applications matching conditions: ', conditions)

    // Convert conditions to Prisma where clauses
    const whereConditions = conditions.map((condition) => {
      switch (condition.fact) {
        case RuleConditionFact.FAMILY_STATUS:
          return { familyStatus: condition.value }
        case RuleConditionFact.IS_BUSINESS_OWNER:
          return { isBusinessOwner: condition.value }
        case RuleConditionFact.FILED_2021:
          return { filedUsTaxes2021: condition.value }
      }
    })

    // Count applications using Prisma's OR
    const count = await this.dbService.client.application.count({
      where: {
        OR: whereConditions,
      },
    })

    this.logger.debug(
      `Found ${count} matching applications for conditions: `,
      conditions,
    )
    return count
  }
  async evaluateApplicationRules(applicationId: string) {
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

    const engine = new Engine()

    // Add rules to engine
    for (const rule of rules) {
      const [ruleVersion] = rule.versions
      this.logger.debug('RULE VERSION', ruleVersion)

      // TODO: better typing here - perhaps don't store as JSON value
      const conditions = get(
        ruleVersion,
        'ruleJson.conditions',
        [],
      ) as unknown as any[]
      const actions = get(ruleVersion, 'ruleJson.actions', [])
      this.logger.debug('conditions', conditions)

      engine.addRule({
        name: ruleVersion.name,
        event: {
          type: 'RULE_EVALUATION',
          params: {
            applicationId,
            ruleVersionId: ruleVersion.id,
            actions,
          },
        },
        conditions: {
          any: map(conditions, (c) => ({
            fact: c.fact,
            operator: 'equal',
            value: c.value,
          })),
        },
      })
    }

    // Facts from application - can expand on this with other rules/entities
    const facts = {
      familyStatus: application.familyStatus,
      isBusinessOwner: application.isBusinessOwner,
      filedUsTaxes2021: application.filedUsTaxes2021,
    }
    this.logger.debug('application', application)
    this.logger.debug('facts', facts)

    try {
      const result = await engine.run(facts)
      this.logger.debug('Rule evaluation result: ', result)
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
      this.logger.error('Rule evaluation failed:', error)
      throw error
    }
  }
}
