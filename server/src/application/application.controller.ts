import { Controller, Get, Param, Post, Request, Res } from '@nestjs/common'
import { Subject } from 'rxjs'
import { ApplicationService } from './application.service'
import { ApiResponse } from '@nestjs/swagger'
import {
  ApplicationResponseDto,
  GenericMutationResponse,
} from './dto/application.dto'

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiResponse({ type: ApplicationResponseDto, isArray: true })
  @Get('/')
  async findAll(): Promise<ApplicationResponseDto[]> {
    return this.applicationService.findAll()
  }
  @ApiResponse({ type: GenericMutationResponse })
  @Post('/:id')
  async processApplication(@Param('id') applicationId: string) {
    await this.applicationService.processApplication(applicationId)
  }
}
