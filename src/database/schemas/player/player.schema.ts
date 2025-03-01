import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true, unique: true })
  userId: number;

  @Prop({ default: 150 })
  health: number;

  @Prop({ default: 150 })
  healthMax: number;

  @Prop({ default: 0 })
  mana: number;

  @Prop({ default: 0 })
  manaMax: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 1 })
  miningLevel: number;

  @Prop({ default: 0 })
  miningExperience: number;

  @Prop({ default: 0 })
  magLevel: number;

  @Prop({ default: 0 })
  magLevelExp: number;

  @Prop({ default: 400 })
  cap: number;

  @Prop({ default: 2520 })
  stamina: number;

  @Prop({ default: 0 })
  blessings: number;

  @Prop({ default: 0 })
  speed: number;

  @Prop({ default: 10 })
  skillFistLevel: number;

  @Prop({ default: 0 })
  skillFistExp: number;

  @Prop({ default: 10 })
  skillSwordLevel: number;

  @Prop({ default: 0 })
  skillSwordExp: number;

  @Prop({ default: 10 })
  skillDistLevel: number;

  @Prop({ default: 0 })
  skillDistExp: number;

  @Prop({ default: 10 })
  skillShieldingLevel: number;

  @Prop({ default: 0 })
  skillShieldingExp: number;

  @Prop({ default: 0 })
  vocationId: number;

  @Prop({ default: 0 })
  synergyMana: number;

  @Prop({ default: 100 })
  synergyManaMax: number;

  @Prop({ default: false })
  inCombat: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'player_invocation_spirit' }],
    maxlength: 3,
  })
  ownedInvocationSpirits: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'player_invocation_spirit',
    default: null,
  })
  selectedInvocationSpirit: Types.ObjectId | null;

  @Prop({ default: 0 })
  goldCoins: number;

  @Prop({ default: 0 })
  platinumCoins: number;

  @Prop({ default: 0 })
  crystalCoins: number;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ type: Types.ObjectId, ref: 'Vocation', required: true })
  vocation: Types.ObjectId;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
