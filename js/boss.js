/**
 * boss.js - 老板出现和检测逻辑模块
 * 管理老板的出现时机、显示和消失逻辑
 */

import { randomFloat, getBossInterval } from './utils.js';
import { GameStatus, PlayerStatus, showMessage, triggerShake } from './gameState.js';

/**
 * 创建老板数据对象
 * @returns {Object} 老板数据
 */
export function createBoss() {
  return {
    // 老板位置
    x: 0,
    y: 0,

    // 老板外观
    width: 120,
    height: 150,

    // 老板动画
    appearTimer: 0,        // 出现动画计时器
    appearDuration: 0.3,   // 出现动画时长
    disappearTimer: 0,     // 消失动画计时器
    disappearDuration: 0.2,// 消失动画时长

    // 老板表情
    expression: 'angry',   // angry, suspicious, surprised

    // 老板状态
    isAppearing: false,    // 是否正在出现
    isDisappearing: false, // 是否正在消失

    // 警告进度条
    warningProgress: 0,    // 警告进度 (0-1)
  };
}

/**
 * 更新老板逻辑
 * @param {Object} state - 游戏状态
 * @param {Object} boss - 老板数据
 * @param {number} deltaTime - 帧间隔时间（秒）
 */
export function updateBoss(state, boss, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) {
    return;
  }

  // 更新出现动画
  if (boss.isAppearing) {
    boss.appearTimer += deltaTime;
    if (boss.appearTimer >= boss.appearDuration) {
      boss.isAppearing = false;
      boss.appearTimer = boss.appearDuration;
    }
  }

  // 更新消失动画
  if (boss.isDisappearing) {
    boss.disappearTimer += deltaTime;
    if (boss.disappearTimer >= boss.disappearDuration) {
      boss.isDisappearing = false;
      boss.disappearTimer = 0;
      state.bossVisible = false;
    }
  }

  // 老板可见时更新警告进度
  if (state.bossVisible && !boss.isDisappearing) {
    const elapsed = (Date.now() / 1000) - state.bossAppearTime;
    boss.warningProgress = Math.min(elapsed / state.bossTimeout, 1);

    // 检查是否超时
    if (elapsed >= state.bossTimeout) {
      // 超时，游戏结束
      state.status = GameStatus.GAME_OVER;
      showMessage(state, '你被老板抓包了！', 2);
      triggerShake(state, 10, 0.5);
    }
  }
}

/**
 * 检查是否应该让老板出现
 * @param {Object} state - 游戏状态
 * @param {Object} boss - 老板数据
 * @returns {boolean} 是否应该出现
 */
export function shouldBossAppear(state, boss) {
  if (state.status !== GameStatus.PLAYING) {
    return false;
  }

  // 老板已经可见或正在消失
  if (state.bossVisible || boss.isDisappearing) {
    return false;
  }

  // 检查是否到达下次出现时间
  const currentTime = state.elapsedTime;
  if (currentTime >= state.nextBossTime) {
    return true;
  }

  return false;
}

/**
 * 让老板出现
 * @param {Object} state - 游戏状态
 * @param {Object} boss - 老板数据
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 */
export function makeBossAppear(state, boss, canvasWidth, canvasHeight) {
  // 设置老板出现
  state.bossVisible = true;
  state.bossAppearTime = Date.now() / 1000;
  state.playerStatus = PlayerStatus.IDLE;

  // 重置老板动画
  boss.isAppearing = true;
  boss.isDisappearing = false;
  boss.appearTimer = 0;
  boss.disappearTimer = 0;
  boss.warningProgress = 0;

  // 设置老板位置（居中偏上）
  boss.x = (canvasWidth - boss.width) / 2;
  boss.y = canvasHeight * 0.2;

  // 设置老板表情
  boss.expression = 'angry';

  // 计算下次出现时间
  const interval = getBossInterval(state.elapsedTime);
  const nextInterval = randomFloat(interval[0], interval[1]);
  state.nextBossTime = state.elapsedTime + nextInterval;

  // 显示提示
  showMessage(state, '老板来了！', 0.8);
  triggerShake(state, 3, 0.2);
}

/**
 * 处理玩家点击伪装按钮
 * @param {Object} state - 游戏状态
 * @param {Object} boss - 老板数据
 * @returns {boolean} 是否成功伪装
 */
export function handleDisguise(state, boss) {
  // 只有老板可见时才能伪装
  if (!state.bossVisible || boss.isDisappearing) {
    return false;
  }

  // 计算反应时间
  const reactionTime = (Date.now() / 1000) - state.bossAppearTime;

  // 检查是否在规定时间内
  if (reactionTime <= state.bossTimeout) {
    // 成功伪装
    state.dodgeCount++;
    state.combo++;
    state.score += 50;

    // 老板消失
    boss.isDisappearing = true;
    boss.disappearTimer = 0;
    boss.expression = 'surprised';

    // 显示成功提示
    const comboText = state.combo > 1 ? ` (${state.combo}连击!)` : '';
    showMessage(state, `安全！老板没发现${comboText}`, 1.5);

    return true;
  }

  return false;
}

/**
 * 获取老板出现动画进度
 * @param {Object} boss - 老板数据
 * @returns {number} 动画进度 (0-1)
 */
export function getAppearProgress(boss) {
  if (!boss.isAppearing) {
    return 1;
  }
  return boss.appearTimer / boss.appearDuration;
}

/**
 * 获取老板消失动画进度
 * @param {Object} boss - 老板数据
 * @returns {number} 动画进度 (0-1)
 */
export function getDisappearProgress(boss) {
  if (!boss.isDisappearing) {
    return 0;
  }
  return boss.disappearTimer / boss.disappearDuration;
}

/**
 * 获取老板表情图标
 * @param {string} expression - 表情类型
 * @returns {string} 表情图标
 */
export function getBossExpressionIcon(expression) {
  const icons = {
    'angry': '😠',
    'suspicious': '🤨',
    'surprised': '😲',
  };
  return icons[expression] || '😠';
}
