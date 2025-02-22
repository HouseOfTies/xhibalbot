import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonsterDocument = Monster & Document;

@Schema({ timestamps: true })
export class Monster {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nameDescription: string;

  @Prop({ required: true })
  race: string;

  @Prop({ required: true })
  raceId: number;

  @Prop({ required: true })
  speed: number;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true, type: { min: Number, max: Number } })
  levelRange: { min: number; max: number };

  @Prop({ required: true })
  maxHealth: number;

  @Prop({ required: true })
  currentHealth: number;

  @Prop([
    {
      name: String,
      interval: Number,
      minDamage: Number,
      maxDamage: Number,
      poison: { type: Number, required: false },
      chance: { type: Number, required: false },
      range: { type: Number, required: false },
      target: { type: Boolean, required: false },
      radius: { type: Number, required: false },
      length: { type: Number, required: false },
      spread: { type: Number, required: false },
      shootEffect: { type: String, required: false },
      areaEffect: { type: String, required: false },
    },
  ])
  attacks: {
    name: string;
    interval: number;
    minDamage: number;
    maxDamage: number;
    poison?: number;
    chance?: number;
    range?: number;
    target?: boolean;
    radius?: number;
    length?: number;
    spread?: number;
    shootEffect?: string;
    areaEffect?: string;
  }[];

  @Prop({
    type: {
      armor: Number,
      defense: Number,
      healing: {
        interval: Number,
        chance: Number,
        minHeal: Number,
        maxHeal: Number,
        areaEffect: { type: String, required: false },
      },
    },
    required: true,
  })
  defenses: {
    armor: number;
    defense: number;
    healing?: {
      interval: number;
      chance: number;
      minHeal: number;
      maxHeal: number;
      areaEffect?: string;
    };
  };

  @Prop([
    {
      type: String,
      percent: Number,
    },
  ])
  elements: { type: string; percent: number }[];

  @Prop([{ type: String }])
  immunities: string[];

  @Prop({
    type: {
      interval: Number,
      chance: Number,
      sentences: [String],
    },
    required: true,
  })
  voices: { interval: number; chance: number; sentences: string[] };

  @Prop([
    {
      item: { type: Types.ObjectId, ref: 'Item', required: false },
      itemName: { type: String, required: false },
      countmax: { type: Number, required: false },
      dropChance: { type: Number, required: true },
    },
  ])
  loot_table: {
    item?: Types.ObjectId;
    itemName?: string;
    countmax?: number;
    dropChance: number;
  }[];

  @Prop({ type: [String] })
  spawn_zones: string[];
}

export const MonsterSchema = SchemaFactory.createForClass(Monster);
