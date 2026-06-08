/**
 * player.js - 玩家数据模块 v2.0
 * 
 * 增强特性：
 * - 持久化统计（最高分、总局数、总分数等）
 * - 成就系统
 * - 连续游戏次数追踪
 * - 称号进阶系统
 */

import { loadData, saveData, ACHIEVEMENTS, checkAchievements } from './utils.js';

/**
 * 创建玩家数据对象
 */
export function createPlayer() {
  // 从本地存储加载持久化数据
  const savedStats = loadData('playerStats', {
    totalGames: 0,
    totalScore: 0,
    bestScore: 0,
    bestCombo: 0,
    bestTime: 0,       // 最长存活时间
    totalDodges: 0,    // 总躲避次数
    achievements: [],   // 已解锁成就 ID 列表
  });

  return {
    // 动画状态
    x: 0,
    y: 0,
    statusTimer: 0,
    statusDuration: 0.5,
    disguiseTimer: 0,
    disguiseDuration: 0.35,

    // 表情
    expression: 'happy',

    // 本局临时统计
    sessionDodgeCount: 0,
    sessionItemsUsed: 0,

    // 持久化统计
    stats: savedStats,
  };
}

/**
 * 更新玩家状态动画
 */
export function updatePlayer(player, deltaTime) {
  if (player.statusTimer > 0) {
    player.statusTimer -= deltaTime;
    if (player.statusTimer <= 0) player.statusTimer = 0;
  }
  if (player.disguiseTimer > 0) {
    player.disguiseTimer -= deltaTime;
    if (player.disguiseTimer <= 0) player.disguiseTimer = 0;
  }
}

/**
 * 触发伪装工作动作
 */
export function triggerDisguise(player) {
  player.disguiseTimer = player.disguiseDuration;
  player.expression = 'nervous';
}

/**
 * 设置玩家表情
 */
export function setExpression(player, expression) {
  player.expression = expression;
}

/**
 * 游戏结束时更新持久化统计
 */
export function finalizeGameStats(player, state) {
  const score = Math.floor(state.score);
  const combo = state.maxCombo;
  const time = state.elapsedTime;

  player.stats.totalGames++;
  player.stats.totalScore += score;
  player.stats.bestScore = Math.max(player.stats.bestScore, score);
  player.stats.bestCombo = Math.max(player.stats.bestCombo, combo);
  player.stats.bestTime = Math.max(player.stats.bestTime, time);
  player.stats.totalDodges += state.dodgeCount;

  // 检查成就
  const newAchievements = checkAchievements(
    { ...player.stats, bestScore: Math.max(player.stats.bestScore, score), bestCombo: Math.max(player.stats.bestCombo, combo) },
    player.stats.achievements
  );

  // 完整 30 秒成就
  if (time >= 29.5 && !player.stats.achievements.includes(ACHIEVEMENTS.FULL_GAME.id)) {
    newAchievements.push(ACHIEVEMENTS.FULL_GAME.id);
  }

  // 近身闪避成就
  if (state.closeCallTriggered && !player.stats.achievements.includes(ACHIEVEMENTS.CLOSE_CALL.id)) {
    newAchievements.push(ACHIEVEMENTS.CLOSE_CALL.id);
  }

  // 道具使用成就
  if (state.itemsUsed >= 3 && !player.stats.achievements.includes(ACHIEVEMENTS.ITEM_COLLECTOR.id)) {
    newAchievements.push(ACHIEVEMENTS.ITEM_COLLECTOR.id);
  }

  // 添加新成就
  for (const achId of newAchievements) {
    if (!player.stats.achievements.includes(achId)) {
      player.stats.achievements.push(achId);
    }
  }

  // 保存到本地
  saveData('playerStats', player.stats);

  return {
    isNewBest: score >= player.stats.bestScore,
    newAchievements,
  };
}

/**
 * 获取玩家状态文字
 */
export function getStatusText(status) {
  const texts = {
    idle: '摸鱼中',
    working: '认真工作中',
  };
  return texts[status] || '摸鱼中';
}

/**
 * 获取成就对象
 */
export function getAchievementById(id) {
  return Object.values(ACHIEVEMENTS).find(a => a.id === id) || null;
}

/**
 * 获取玩家等级（根据总游戏次数）
 */
export function getPlayerLevel(stats) {
  const games = stats.totalGames;
  if (games < 5) return { level: 1, title: '新人', progress: games / 5 };
  if (games < 15) return { level: 2, title: '熟手', progress: (games - 5) / 10 };
  if (games < 30) return { level: 3, title: '老手', progress: (games - 15) / 15 };
  if (games < 60) return { level: 4, title: '高手', progress: (games - 30) / 30 };
  return { level: 5, title: '传说', progress: 1 };
}
