import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { RuleService } from './rule.service'
import {
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
  CreateRuleDto,
  RuleCondition,
} from './dto/create-rule.dto'
import { ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Rule, RuleVersion } from './dto/rule.dto'

@ApiExtraModels(
  FamilyStatusCondition,
  BusinessOwnerCondition,
  Filed2021Condition,
  Action,
  CreateRuleDto,
  RuleVersion,
  Rule,
  RuleCondition,
)
@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  createRule(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.createRule(createRuleDto)
  }
  @Put(':id')
  updateRule(@Param('id') id: string, @Body() updatedRule: CreateRuleDto) {
    return this.ruleService.updateRule(id, updatedRule)
  }

  @ApiOperation({ summary: 'Get all rules', description: 'test' })
  @ApiResponse({
    status: 200,
    description: 'Rules found',
    type: Rule,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.ruleService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findOne(id)
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.ruleService.softDelete(id)
  }
}
