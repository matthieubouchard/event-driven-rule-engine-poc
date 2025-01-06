import { Injectable } from '@nestjs/common'

import { PrismaClient } from '@prisma/client'

@Injectable()
export class DbService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  get client(): PrismaClient {
    return this.prisma
  }
}
