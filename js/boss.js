/**
 * boss.js - 老板出现和检测逻辑模块
 * 管理老板的出现时机、显示、消失逻辑和视觉效果
 */

import { randomFloat, getBossInterval } from './utils.js';
import { GameStatus, PlayerStatus, showMessage, triggerShake } from './gameState.js';

/**
 * 创建老板数据对象
 */
export function createBoss() {
  return {
    // 老板位置
    x: 0,
    y: 0,

    // 老板外观
    width: 140,
    height: 180,

    // 老板动画
    appearTimer: 0,
    appearDuration: 0.35,
    disappearTimer: 0,
    disappearDuration: 0.25,

    // 动画类型：'scale'（缩放出现）| 'slideRight'（从右滑入）
    appearType: 'scale',

    // 老板表情
    expression: 'angry',

    // 老板状态
    isAppearing: false,
    isDisappearing: false,

    // 警告进度条
    warningProgress: 0,

    // "!" 指示器动画
    exclamationTimer: 0,
  };
}

/**
 * 更新老板逻辑
 */
export function updateBoss(state, boss, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;

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

  // 更新 "!" 感叹号动画
  if (state.bossVisible && !boss.isDisappearing) {
    boss.exclamationTimer += deltaTime;
  } else {
    boss.exclamationTimer = 0;
  }

  // 老板可见时更新警告进度
  if (state.bossVisible && !boss.isDisappearing) {
    const elapsed = (Date.now() / 1000) - state.bossAppearTime;
    boss.warningProgress = Math.min(elapsed / state.bossTimeout, 1);

    // 检查是否超时
    if (elapsed >= state.bossTimeout) {
      state.status = GameStatus.GAME_OVER;
      showMessage(state, '你被老板抓包了！', 2);
      triggerShake(state, 12, 0.6);
    }
  }
}

/**
 * 检查是否应该让老板出现
 */
export function shouldBossAppear(state, boss) {
  if (state.status !== GameStatus.PLAYING) return false;
  if (state.bossVisible || boss.isDisappearing) return false;
  return state.elapsedTime >= state.nextBossTime;
}

/**
 * 让老板出现
 */
export function makeBossAppear(state, boss, canvasWidth, canvasHeight) {
  state.bossVisible = true;
  state.bossAppearTime = Date.now() / 1000;
  state.playerStatus = PlayerStatus.IDLE;

  // 重置老板动画
  boss.isAppearing = true;
  boss.isDisappearing = false;
  boss.appearTimer = 0;
  boss.disappearTimer = 0;
  boss.warningProgress = 0;
  boss.exclamationTimer = 0;

  // 随机选择出现动画类型
  boss.appearType = Math.random() > 0.5 ? 'scale' : 'slideRight';

  // 设置老板位置
  boss.x = (canvasWidth - boss.width) / 2;
  boss.y = canvasHeight * 0.18;

  // 表情：根据游戏进度，后期老板更生气
  if (state.elapsedTime > 20) {
    boss.expression = 'angry';
  } else if (state.elapsedTime > 10) {
    boss.expression = Math.random() > 0.5 ? 'angry' : 'suspicious';
  } else {
    boss.expression = 'suspicious';
  }

  // 计算下次出现时间
  const interval = getBossInterval(state.elapsedTime);
  const nextInterval = randomFloat(interval[0], interval[1]);
  state.nextBossTime = state.elapsedTime + nextInterval;

  // 显示提示和震动
  showMessage(state, '老板来了！', 0.8);
  triggerShake(state, 4, 0.25);
}

/**
 * 处理玩家点击伪装按钮
 */
export function handleDisguise(state, boss) {
  if (!state.bossVisible || boss.isDisappearing) return false;

  const reactionTime = (Date.now() / 1000) - state.bossAppearTime;

  if (reactionTime <= state.bossTimeout) {
    // 成功伪装
    state.dodgeCount++;
    state.combo++;
    state.score += 50;

    // 老板惊讶消失
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
 * 获取老板出现动画进度 (0-1)
 */
export function getAppearProgress(boss) {
  if (!boss.isAppearing) return 1;
  return boss.appearTimer / boss.appearDuration;
}

/**
 * 获取老板消失动画进度 (0-1)
 */
export function getDisappearProgress(boss) {
  if (!boss.isDisappearing) return 0;
  return boss.disappearTimer / boss.disappearDuration;
}

/**
 * 获取老板表情图标
 */
export function getBossExpressionIcon(expression) {
  const icons = {
    'angry': '😠',
    'suspicious': '🤨',
    'surprised': '😲',
  };
  return icons[expression] || '😠';
}
