import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocationDocument = Vocation & Document;

@Schema({ timestamps: true })
export class Vocation {
  @Prop({ required: true, unique: true })
  vocationId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  magicShield: number;

  @Prop({ default: 10 })
  gainCap: number;

  @Prop({ default: 5 })
  gainHp: number;

  @Prop({ default: 5 })
  gainMana: number;

  @Prop({ default: 6 })
  gainHpTicks: number;

  @Prop({ default: 1 })
  gainHpAmount: number;

  @Prop({ default: 6 })
  gainManaTicks: number;

  @Prop({ default: 1 })
  gainManaAmount: number;

  @Prop({ default: 4.0 })
  manaMultiplier: number;

  @Prop({ default: 0 })
  fromVocation: number;

  @Prop({
    type: Map,
    of: Number,
    default: {
      meleeDamage: 1.0,
      distDamage: 1.0,
      defense: 1.0,
      armor: 1.0,
    },
  })
  formula: Record<string, number>;

  @Prop({
    type: Map,
    of: Number,
    default: {
      skillFist: 1.5,
      skillSword: 2.0,
      skillAxe: 2.0,
      skillDist: 2.0,
      skillShielding: 2.0,
      skillFishing: 1.5,
      magicLevel: 1.1,
    },
  })
  skillMultipliers: Record<string, number>;
}

export const VocationSchema = SchemaFactory.createForClass(Vocation);
