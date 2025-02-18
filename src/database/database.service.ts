import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    console.log(
      '📦 MongoDB connected:',
      this.connection.readyState === 1 ? '✅ Connected' : '❌ Error',
    );
  }
}
