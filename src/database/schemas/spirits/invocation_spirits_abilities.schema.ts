import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvocationSpiritAbilityDocument = InvocationSpiritAbility &
  Document;

export enum AbilityType {
  OFFENSIVE = 'Offensive', // Daño directo al enemigo
  DEFENSIVE = 'Defensive', // Reduce daño recibido
  STATUS = 'Status', // Aplica debuff al enemigo
  BUFF = 'Buff', // Mejora al jugador (ej: curación en combate)
  PASSIVE = 'Passive', // Habilidad que afecta fuera de combate
}

@Schema({ timestamps: true })
export class InvocationSpiritAbility {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Object.values(AbilityType) })
  type: AbilityType; // Tipo de habilidad

  @Prop({ required: true })
  manaCost: number; // Costo de synergy mana

  @Prop({ required: true })
  cooldown: number; // Tiempo de espera antes de volver a usar

  @Prop({ required: false, default: null })
  effectValue: number | null; // Cantidad de curación, daño o buff

  @Prop({ default: false })
  onlyInCombat: boolean; // Si la habilidad solo puede usarse en combate
}

export const InvocationSpiritAbilitySchema = SchemaFactory.createForClass(
  InvocationSpiritAbility,
);
