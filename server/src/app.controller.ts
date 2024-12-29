import { Controller, Get, Post, Body } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { AppService } from './app.service'
import { DbService } from './db/db.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PubSubService } from './pubsub/pubsub.service'

class LoginDto {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty({ required: false })
  remember?: boolean
}
@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: DbService,
    private readonly pubSubService: PubSubService,
  ) {}

  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Returns hello message',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  @Get('hello')
  async getHello(): Promise<{ message: string }> {
    const application = await this.dbService.client.application.findFirst({
      select: { id: true },
    })
    await this.pubSubService.publish({
      topic: 'application.submitted',
      payload: {
        applicationId: application.id,
      },
      // metadata: {
      //   source: 'test',
      // },
    })
    // await this.pubSubService.publish({
    //   topic: 'document.received',
    //   payload: {
    //     id: '345',
    //     status: 'new',
    //   },
    //   metadata: {
    //     source: 'test',
    //   },
    // })
    return this.appService.getHello()
  }

  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({
    // type: User,
    isArray: true,
  })
  @Post('login')
  login(@Body() creds: LoginDto): { success: boolean } {
    console.log('creds!!!!!!!!!!', creds)
    return { success: true }
  }

  // @MessagePattern('application.submitted')
  // async handleApplication(@Payload() message: any) {
  //   console.log('APP CONTROLLER received!!!:', message)
  //   // Do rules specific things
  // }
}
