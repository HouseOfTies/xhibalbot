import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ default: 100 })
  hp: number;

  @Prop({ default: 100 })
  mana: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  exp: number;

  @Prop({ default: 0 })
  miningExp: number;

  @Prop({ default: 1 })
  miningLevel: number;

  @Prop({ default: 'Normal Human' })
  vocation: string;

  @Prop({ default: [] })
  inventory: string[];

  @Prop({ default: 'en' })
  language: string;

  @Prop({ default: 0 })
  goldCoins: number;

  @Prop({ default: 0 })
  platinumCoins: number;

  @Prop({ default: 0 })
  crystalCoins: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
