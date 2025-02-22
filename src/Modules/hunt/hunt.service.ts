import { Command, Ctx, Update, Action } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { PlayerService } from '../player/player.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';
import { MonsterService } from '../monsters/monsters.service';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';

@Update()
export class HuntService {
  constructor(
    private playerService: PlayerService,
    private monsterService: MonsterService,
    private experienceService: ExperienceService,
    private cooldownService: RedisCooldownService,
  ) {}

  @Command('hunt')
  async onHuntCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();

    // ⏳ Verificar si el usuario está en cooldown
    const cooldown = await this.cooldownService.checkCooldown(
      userId,
      'hunt',
      60,
    );
    if (!cooldown.allowed) {
      return ctx.reply(
        `⏳ Estás en cooldown. Intenta de nuevo en ${cooldown.timeRemaining} segundos.`,
      );
    }

    const player = await this.playerService.findOrCreate(userId);

    if (player.inCombat) {
      return ctx.reply(
        '⚔️ ¡Estás en medio de un combate! Usa los botones para continuar.',
      );
    }

    if (Math.random() > 0.7) {
      await this.cooldownService.resetCooldown(userId, 'hunt');
      return ctx.reply(
        '🌿 No has encontrado nada... intenta de nuevo en 60 segundos.',
      );
    }

    // 🔎 Buscar un monstruo acorde al nivel del jugador
    const monster = await this.monsterService.findMonsterForLevel(player.level);
    if (!monster) {
      return ctx.reply('❌ No hay monstruos disponibles para tu nivel.');
    }

    // ⚔️ Guardar estado de combate
    await this.playerService.startCombat(userId, monster);

    // 📢 Mensaje de aparición del monstruo
    const monsterMessage = `🔥 **¡Un ${monster.name} ha aparecido!** 🔥  
   🆚 Nivel: ${monster.levelRange.min} - ${monster.levelRange.max}  
   
⚔️ **¿Qué quieres hacer?**`;

    // Botones de acción
    ctx.reply(
      monsterMessage,
      Markup.inlineKeyboard([
        [Markup.button.callback('⚔️ Atacar', `attack_${userId}`)],
        [Markup.button.callback('🏃 Huir', `flee_${userId}`)],
      ]),
    );
  }

  /* // Acción de ataque
  @Action(/attack_(.+)/)
  async onAttack(@Ctx() ctx: Context) {
    const userId = ctx.match[1];
    const player = await this.playerService.findById(userId);

    if (!player || !player.inCombat) {
      return ctx.reply('❌ No estás en un combate.');
    }

    const monster = await this.monsterService.findById(player.currentMonster);
    if (!monster) {
      return ctx.reply('❌ Error al recuperar el monstruo.');
    }

    // 🎯 Calcular daño del jugador
    const playerDamage = Math.floor(Math.random() * 10) + 5;
    monster.currentHealth -= playerDamage;

    // 🐉 Calcular daño del monstruo
    const monsterDamage =
      Math.floor(
        Math.random() *
          (monster.attacks[0].maxDamage - monster.attacks[0].minDamage),
      ) + monster.attacks[0].minDamage;
    player.health -= monsterDamage;

    // Guardar cambios en la base de datos
    await this.monsterService.updateMonsterHealth(monster);
    await this.playerService.updatePlayerHealth(player);

    // 💀 Verificar si alguien murió
    if (player.health <= 0) {
      await this.playerService.endCombat(userId);
      await this.playerService.loseExp(userId, 100); // Pierde 100 de experiencia
      return ctx.reply(
        `💀 Has sido derrotado por el ${monster.name}. Pierdes experiencia...`,
      );
    }

    if (monster.currentHealth <= 0) {
      await this.playerService.endCombat(userId);
      await this.playerService.gainExp(userId, monster.experience);
      return ctx.reply(
        `🏆 ¡Has vencido al ${monster.name}! Ganas ${monster.experience} de experiencia.`,
      );
    }

    // ⚔️ Si ambos siguen vivos, continuar el combate
    return ctx.reply(
      `⚔️ **Atacaste al ${monster.name} e hiciste ${playerDamage} de daño.**  
💀 **El ${monster.name} te atacó e hizo ${monsterDamage} de daño.**  
❤️ **Tu vida:** ${player.health}  
🐉 **Vida del ${monster.name}:** ${monster.currentHealth}  

⚔️ **¿Qué quieres hacer ahora?**`,
      Markup.inlineKeyboard([
        [Markup.button.callback('⚔️ Atacar', `attack_${userId}`)],
        [Markup.button.callback('🏃 Huir', `flee_${userId}`)],
      ]),
    );
  }

  // Acción de huir
  @Action(/flee_(.+)/)
  async onFlee(@Ctx() ctx: Context) {
    const userId = ctx.match[1];

    await this.playerService.endCombat(userId);
    return ctx.reply('🏃 ¡Has huido del combate sin consecuencias!');
  } */
}
