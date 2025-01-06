import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { RuleService } from './rule.service'
import { CreateRuleDto, RuleDto } from '../../dto'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @ApiResponse({
    description: 'New rule id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Create a new rule',
    description: 'Create version 0 of your first rule',
  })
  async createRule(@Body() createRuleDto: CreateRuleDto) {
    const newRule = await this.ruleService.createRule(createRuleDto)
    return { id: newRule.id }
  }
  @Put(':id')
  @ApiResponse({
    description: 'Updated rule id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Update a rule by id',
    description: 'Will create a new ruleVersion',
  })
  async updateRule(
    @Param('id') id: string,
    @Body() updatedRule: CreateRuleDto,
  ): Promise<{ id: string }> {
    const update = await this.ruleService.updateRule(id, updatedRule)
    return { id: update.id }
  }

  @ApiOperation({
    summary: 'Get all rules',
    description: 'An array of rules with the latest version',
  })
  @ApiResponse({
    status: 200,
    description: 'Rules found',
    type: RuleDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.ruleService.findAll()
  }

  @ApiResponse({
    status: 200,
    description: 'Rule by id',
    type: RuleDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findOne(id)
  }

  @ApiResponse({
    description: 'Deactivate a rule by id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
  })
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    const deletedRule = await this.ruleService.softDelete(id)
    return { id: deletedRule.id }
  }
}
