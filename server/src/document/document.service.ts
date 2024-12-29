import { Injectable } from '@nestjs/common'
import { DbService } from 'src/db/db.service'

@Injectable()
export class DocumentService {
  constructor(private readonly dbService: DbService) {}
  async findAll() {
    return this.dbService.client.document.findMany()
  }
}
