import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerInvocationSpiritDocument = PlayerInvocationSpirit & Document;

@Schema({ timestamps: true })
export class PlayerInvocationSpirit {
  @Prop({ type: Types.ObjectId, ref: 'Player', required: true })
  playerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'invocation_spirits', required: true })
  invocationSpiritId: Types.ObjectId;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'invocation_spirit_abilities' }],
  })
  unlockedAbilities: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'invocation_spirit_abilities',
    default: null,
  })
  passiveAbility: Types.ObjectId | null;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'invocation_spirits_awakening_mode' }],
  })
  unlockedAwakeningModes: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'invocation_spirits_awakening_mode',
    default: null,
  })
  activeAwakeningMode: Types.ObjectId | null;
}

export const PlayerInvocationSpiritSchema = SchemaFactory.createForClass(
  PlayerInvocationSpirit,
);
