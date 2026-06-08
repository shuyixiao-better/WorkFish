/**
 * player.js - 玩家数据模块
 * 管理玩家相关的数据和逻辑
 */

/**
 * 创建玩家数据对象
 * @returns {Object} 玩家数据
 */
export function createPlayer() {
  return {
    // 玩家位置（用于绘制，可扩展）
    x: 0,
    y: 0,

    // 玩家状态动画
    statusTimer: 0,        // 状态切换计时器
    statusDuration: 0.5,   // 状态切换动画时长

    // 伪装工作动画
    disguiseTimer: 0,      // 伪装动画计时器
    disguiseDuration: 0.3, // 伪装动画时长

    // 表情状态
    expression: 'happy',   // happy, nervous, scared, relieved

    // 累计统计
    totalGames: 0,         // 总游戏次数
    totalScore: 0,         // 总分数
    bestScore: 0,          // 最高分
    bestCombo: 0,          // 最高连击
  };
}

/**
 * 更新玩家状态动画
 * @param {Object} player - 玩家数据
 * @param {number} deltaTime - 帧间隔时间（秒）
 */
export function updatePlayer(player, deltaTime) {
  // 更新状态切换动画
  if (player.statusTimer > 0) {
    player.statusTimer -= deltaTime;
    if (player.statusTimer <= 0) {
      player.statusTimer = 0;
    }
  }

  // 更新伪装动画
  if (player.disguiseTimer > 0) {
    player.disguiseTimer -= deltaTime;
    if (player.disguiseTimer <= 0) {
      player.disguiseTimer = 0;
    }
  }
}

/**
 * 触发伪装工作动作
 * @param {Object} player - 玩家数据
 */
export function triggerDisguise(player) {
  player.disguiseTimer = player.disguiseDuration;
  player.expression = 'nervous';
}

/**
 * 设置玩家表情
 * @param {Object} player - 玩家数据
 * @param {string} expression - 表情类型
 */
export function setExpression(player, expression) {
  player.expression = expression;
}

/**
 * 更新玩家统计
 * @param {Object} player - 玩家数据
 * @param {number} score - 本局分数
 * @param {number} combo - 最高连击
 */
export function updateStats(player, score, combo) {
  player.totalGames++;
  player.totalScore += score;
  player.bestScore = Math.max(player.bestScore, score);
  player.bestCombo = Math.max(player.bestCombo, combo);
}

/**
 * 获取玩家表情图标
 * @param {string} expression - 表情类型
 * @returns {string} 表情图标
 */
export function getExpressionIcon(expression) {
  const icons = {
    'happy': '😊',
    'nervous': '😰',
    'scared': '😱',
    'relieved': '😅',
    'working': '💼',
  };
  return icons[expression] || '😊';
}

/**
 * 获取玩家状态文字
 * @param {string} status - 状态
 * @returns {string} 状态文字
 */
export function getStatusText(status) {
  const texts = {
    'idle': '摸鱼中',
    'working': '认真工作中',
  };
  return texts[status] || '摸鱼中';
}
