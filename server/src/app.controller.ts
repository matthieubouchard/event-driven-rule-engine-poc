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
import { User, Prisma } from '@prisma/client'
// import { UserDto } from './dto/user.dto'

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
  getHello(): { message: string } {
    return this.appService.getHello()
  }

  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({
    // type: User,
    isArray: true,
  })
  @Get('users')
  async getUsers(): Promise<Array<User>> {
    const users = await this.dbService.client.user.findMany()
    return users
  }
  @Post('login')
  login(@Body() creds: LoginDto): { success: boolean } {
    console.log('creds!!!!!!!!!!', creds)
    return { success: true }
  }
}
