export const VOCATIONS = [
  {
    vocationId: 0,
    clientId: 0,
    name: 'Normal Human',
    description: 'A normal human',
    fromVocation: 0,
    magicShield: 0,
    gainCap: 10,
    gainHp: 5,
    gainMana: 5,
    gainHpTicks: 6,
    gainHpAmount: 1,
    gainManaTicks: 6,
    gainManaAmount: 1,
    manaMultiplier: 4.0,
    formula: {
      meleeDamage: 1.0,
      distDamage: 1.0,
      defense: 1.0,
      armor: 1.0,
    },
    skillMultipliers: {
      skillFist: 1.5,
      skillSword: 2.0,
      skillAxe: 2.0,
      skillDist: 2.0,
      skillShielding: 2.0,
      skillFishing: 1.5,
      magicLevel: 1.1,
    },
  },
  {
    vocationId: 5,
    clientId: 13,
    name: 'Grand Magician',
    description: 'A grand magician',
    fromVocation: 1,
    magicShield: 1,
    gainCap: 10,
    gainHp: 5,
    gainMana: 30,
    gainHpTicks: 4,
    gainHpAmount: 10,
    gainManaTicks: 2,
    gainManaAmount: 10,
    manaMultiplier: 1.1,
    formula: {
      meleeDamage: 1.0,
      distDamage: 1.0,
      defense: 1.0,
      armor: 1.0,
    },
    skillMultipliers: {
      skillFist: 1.5,
      skillSword: 2.0,
      skillAxe: 2.0,
      skillDist: 2.0,
      skillShielding: 2.0,
      skillFishing: 1.5,
      magicLevel: 1.5,
    },
  },
];
