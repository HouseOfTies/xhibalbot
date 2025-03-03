import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { PlayerService } from '../player/player.service';
import { MonsterService } from '../monsters/monsters.service';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';

@Update()
export class HuntService {
  constructor(
    private playerService: PlayerService,
    private monsterService: MonsterService,
    private cooldownService: RedisCooldownService,
  ) {}

  @Command('hunt')
  async onHuntCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    const cooldown = await this.cooldownService.checkCooldown(
      userId,
      'hunt',
      10,
    );
    if (!cooldown.allowed) {
      ctx.reply(
        `⏳ *Estás en cooldown.*\nIntenta de nuevo en *${cooldown.timeRemaining} segundos.*`,
        { parse_mode: 'Markdown' },
      );
      return;
    }

    const player = await this.playerService.findOrCreate(userId);
    if (player.inCombat) {
      ctx.reply(
        '⚔️ *¡Ya estás en medio de un combate!*\nUsa los botones para continuar.',
        { parse_mode: 'Markdown' },
      );
      return;
    }

    if (Math.random() > 0.7) {
      ctx.reply('🌿 *No has encontrado nada...*\nIntenta de nuevo más tarde.', {
        parse_mode: 'Markdown',
      });
      await this.cooldownService.resetCooldown(userId, 'hunt');
      return;
    }

    const monster = await this.monsterService.findMonsterForLevel(player.level);
    if (!monster) {
      ctx.reply('❌ *No hay monstruos disponibles para tu nivel.*', {
        parse_mode: 'Markdown',
      });
      return;
    }

    await this.playerService.startCombat(userId, monster);

    const combatMessage = await ctx.reply(
      `🔥 *¡${monster.name} [Level: ${monster.generatedLevel}] ha aparecido!* 🔥\n\n⚔️ *Opciones de combate:*`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('⚔️ Atacar', `attack_${userId}`)],
          [Markup.button.callback('🏃 Huir', `flee_${userId}`)],
        ]),
      },
    );

    await this.playerService.updateCombatMessageId(
      userId,
      combatMessage.message_id,
    );
    await this.playerService.updateUser(userId, {
      combatMessageId: combatMessage.message_id,
    });
  }

  @Action(/attack_(.+)/)
  async onAttack(@Ctx() ctx: Context) {
    const userId = (ctx as any).match[1];
    const player = await this.playerService.getUser(userId);
    if (!player || !player.inCombat || !player.currentMonster) {
      ctx.reply('❌ *No estás en un combate.*', { parse_mode: 'Markdown' });
      return;
    }

    const monster = player.currentMonster;
    const playerDamage = Math.floor(Math.random() * 10) + 5;
    const updatedMonster = await this.playerService.updateMonsterHealth(
      userId,
      playerDamage,
    );

    if (updatedMonster.currentHealth <= 0) {
      await this.playerService.endCombat(userId);
      await this.playerService.gainExp(userId, monster.experience);
      ctx.reply(
        `🏆 *¡Has vencido al ${monster.name}!* 🎉\nGanas *${monster.experience}* de experiencia.`,
        { parse_mode: 'Markdown' },
      );
      return;
    }

    const monsterAttack =
      monster.attacks[Math.floor(Math.random() * monster.attacks.length)];
    const monsterDamage =
      Math.floor(
        Math.random() * (monsterAttack.maxDamage - monsterAttack.minDamage),
      ) + monsterAttack.minDamage;
    const updatedPlayer = await this.playerService.updatePlayerHealth(
      userId,
      monsterDamage,
    );

    if (updatedPlayer.health <= 0) {
      await this.playerService.endCombat(userId);
      await this.playerService.loseExp(userId, 100);
      ctx.reply(
        `💀 *Has sido derrotado por ${monster.name}.*\nPierdes experiencia...`,
        { parse_mode: 'Markdown' },
      );
      return;
    }

    try {
      await ctx.editMessageText(
        `⚔️ *Atacaste a: ${monster.name} e hiciste ${playerDamage} de daño.*  
💀 *${monster.name} te atacó e hizo ${monsterDamage} de daño.*  

---
❤️ *Tu vida:* ${updatedPlayer.health}/${updatedPlayer.healthMax}  
🐉 *Vida del ${monster.name}:* ${updatedMonster.currentHealth}/${updatedMonster.maxHealth}  
---

⚔️ *¿Qué quieres hacer ahora?*`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('⚔️ Atacar', `attack_${userId}`)],
            [Markup.button.callback('🏃 Huir', `flee_${userId}`)],
          ]),
        },
      );
    } catch (error) {
      console.error('Error al editar el mensaje:', error);
    }
  }

  @Action(/flee_(.+)/)
  async onFlee(@Ctx() ctx: Context) {
    const userId = (ctx as any).match[1];
    await this.playerService.endCombat(userId);
    ctx.editMessageText('🏃 *¡Has huido del combate sin consecuencias!*', {
      parse_mode: 'Markdown',
    });
  }
}
