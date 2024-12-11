import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common'
import { RuleService } from './rule.service'
import { CreateRuleDto } from './dto/create-rule.dto'
import { UpdateRuleDto } from './dto/update-rule.dto'

@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  createRule(@Body() createRuleDto: CreateRuleDto) {
    console.log('hitting route!!', createRuleDto)
    return this.ruleService.createRule(createRuleDto)
  }
  @Put(':id')
  updateRule(@Param('id') id: string, @Body() updatedRule: CreateRuleDto) {
    console.log('hittingupdate route route!!', updatedRule)
    return this.ruleService.updateRule(id, updatedRule)
  }

  @Get()
  findAll() {
    return this.ruleService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.update(+id, updateRuleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ruleService.remove(+id)
  }
}
