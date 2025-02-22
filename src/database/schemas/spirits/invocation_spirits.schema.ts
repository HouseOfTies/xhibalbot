import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvocationSpiritDocument = InvocationSpirit & Document;

@Schema({ timestamps: true })
export class InvocationSpirit {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'invocation_spirit_abilities' }],
  })
  abilities: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'invocation_spirits_awakening_mode' }],
  })
  awakeningModes: Types.ObjectId[];
}

export const InvocationSpiritSchema =
  SchemaFactory.createForClass(InvocationSpirit);
