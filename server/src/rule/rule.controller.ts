import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { RuleService } from './rule.service'
import { CreateRuleDto, RuleDto } from '../dto'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  createRule(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.createRule(createRuleDto)
  }
  @Put(':id')
  updateRule(@Param('id') id: string, @Body() updatedRule: CreateRuleDto) {
    console.log('getting to the controller????', updatedRule)
    return this.ruleService.updateRule(id, updatedRule)
  }

  @ApiOperation({ summary: 'Get all rules', description: 'test' })
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findOne(id)
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.ruleService.softDelete(id)
  }
}
