import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { ApplicationResponseDto, GenericMutationResponse } from '../../dto'

import { ApplicationService } from './application.service'

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiResponse({ type: ApplicationResponseDto, isArray: true })
  @ApiOperation({
    summary: 'Get all applications with rule audit logs and document requests',
  })
  @Get('/')
  async findAll(): Promise<ApplicationResponseDto[]> {
    return this.applicationService.findAll()
  }
  @ApiResponse({ type: GenericMutationResponse })
  @ApiOperation({
    summary:
      'Kick off the sequence of events to process an application -> evaluate rule for application and create document request is applicable',
  })
  @Post('/:id')
  async processApplication(@Param('id') applicationId: string) {
    return await this.applicationService.processApplication(applicationId)
  }
}
