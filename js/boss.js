/**
 * boss.js - 老板AI模块 v2.0
 * 
 * 增强特性：
 * - 三种出现风格：normal（普通）、sneaky（偷袭）、urgent（紧急巡查）
 * - 根据游戏阶段动态调整行为
 * - 更丰富的入场动画类型
 * - 耳机预警支持
 * - 同事掩护自动处理
 */

import { randomFloat, getBossInterval, getBossTimeout } from './utils.js';
import {
  GameStatus, PlayerStatus,
  showMessage, triggerShake, triggerFlash,
  triggerCloseCall
} from './gameState.js';
import { getTimingRating, getRatingScoreMultiplier, getRatingConfig } from './effects.js';

/**
 * 创建老板数据对象
 */
export function createBoss() {
  return {
    // 位置
    x: 0,
    y: 0,

    // 外观
    width: 140,
    height: 180,

    // 出现动画
    appearTimer: 0,
    appearDuration: 0.4,
    disappearTimer: 0,
    disappearDuration: 0.3,

    // 入场类型
    appearType: 'scale',       // 'scale' | 'slideRight' | 'slideUp' | 'fadeZoom'
    disappearType: 'fade',     // 'fade' | 'shrink' | 'slideLeft'

    // 表情
    expression: 'angry',       // 'angry' | 'surprised' | 'suspicious' | 'furious'

    // 老板风格
    style: 'normal',           // 'normal' | 'sneaky' | 'urgent'

    // 状态
    isAppearing: false,
    isDisappearing: false,

    // 感叹号动画
    exclamationTimer: 0,

    // 预警状态（耳机道具）
    warningActive: false,
    warningTimer: 0,

    // 巡逻步行动画
    walkPhase: 0,

    // 阴影强度
    shadowIntensity: 0,
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

  // 更新感叹号动画
  if (state.bossVisible && !boss.isDisappearing) {
    boss.exclamationTimer += deltaTime;
  } else {
    boss.exclamationTimer = 0;
  }

  // 更新巡逻步行动画
  boss.walkPhase += deltaTime * 3;

  // 更新阴影强度
  if (state.bossVisible) {
    boss.shadowIntensity = Math.min(1, boss.shadowIntensity + deltaTime * 2);
  } else {
    boss.shadowIntensity = Math.max(0, boss.shadowIntensity - deltaTime * 3);
  }

  // 更新预警（耳机道具效果）
  if (boss.warningActive) {
    boss.warningTimer -= deltaTime;
    if (boss.warningTimer <= 0) {
      boss.warningActive = false;
    }
  }

  // 老板可见时检查超时
  if (state.bossVisible && !boss.isDisappearing) {
    const elapsed = (Date.now() / 1000) - state.bossAppearTime;
    const timeout = state.bossTimeout;

    if (elapsed >= timeout) {
      // 超时 - 游戏结束
      state.status = GameStatus.GAME_OVER;
      showMessage(state, '你被老板抓包了！', 2, 'danger');
      triggerShake(state, 14, 0.7);
      triggerFlash(state, '#FF4D3D', 0.3);
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
 * 让老板出现 - 增强版
 */
export function makeBossAppear(state, boss, canvasWidth, canvasHeight, headphoneWarning) {
  state.bossVisible = true;
  state.bossAppearTime = Date.now() / 1000;
  state.playerStatus = PlayerStatus.IDLE;

  // 动态反应时间
  state.bossTimeout = getBossTimeout(state.elapsedTime);

  // 重置动画
  boss.isAppearing = true;
  boss.isDisappearing = false;
  boss.appearTimer = 0;
  boss.disappearTimer = 0;
  boss.exclamationTimer = 0;
  boss.warningActive = false;

  // 选择出现风格（根据游戏进度）
  const elapsed = state.elapsedTime;
  const styleRoll = Math.random();

  if (elapsed > 20) {
    // 后期：更多紧急巡查
    boss.style = styleRoll < 0.3 ? 'sneaky' : styleRoll < 0.6 ? 'urgent' : 'normal';
  } else if (elapsed > 10) {
    boss.style = styleRoll < 0.35 ? 'sneaky' : styleRoll < 0.55 ? 'urgent' : 'normal';
  } else {
    boss.style = styleRoll < 0.4 ? 'sneaky' : 'normal';
  }

  state.bossStyle = boss.style;

  // 根据风格调整参数
  switch (boss.style) {
    case 'sneaky':
      boss.appearDuration = 0.5;    // 偷袭：出现更慢
      state.bossTimeout += 0.2;     // 多给一点反应时间
      break;
    case 'urgent':
      boss.appearDuration = 0.25;   // 紧急：出现更快
      state.bossTimeout -= 0.15;    // 反应时间更短
      break;
    default:
      boss.appearDuration = 0.35;
  }

  // 选择入场动画
  const animTypes = ['scale', 'slideRight', 'slideUp', 'fadeZoom'];
  boss.appearType = animTypes[Math.floor(Math.random() * animTypes.length)];

  // 老板位置
  boss.x = (canvasWidth - boss.width) / 2;
  boss.y = canvasHeight * 0.16;

  // 表情
  if (elapsed > 22) {
    boss.expression = styleRoll < 0.5 ? 'furious' : 'angry';
  } else if (elapsed > 12) {
    boss.expression = Math.random() > 0.4 ? 'angry' : 'suspicious';
  } else {
    boss.expression = Math.random() > 0.5 ? 'suspicious' : 'angry';
  }

  // 计算下次出现时间
  const interval = getBossInterval(elapsed);
  const nextInterval = randomFloat(interval[0], interval[1]);
  state.nextBossTime = state.elapsedTime + nextInterval;

  // 提示和震动
  const styleText = {
    normal: '老板来了！',
    sneaky: '老板悄悄靠近...',
    urgent: '老板紧急巡查！！',
  };
  showMessage(state, styleText[boss.style] || '老板来了！', 0.8, boss.style === 'urgent' ? 'danger' : 'warning');

  const shakeIntensity = boss.style === 'urgent' ? 6 : 4;
  triggerShake(state, shakeIntensity, 0.3);
}

/**
 * 触发耳机预警
 */
export function triggerHeadphoneWarning(boss, secondsBefore) {
  boss.warningActive = true;
  boss.warningTimer = secondsBefore;
}

/**
 * 处理玩家点击伪装按钮 - 增强版（含时序评级）
 */
export function handleDisguise(state, boss) {
  if (!state.bossVisible || boss.isDisappearing) return { success: false };

  const reactionTime = (Date.now() / 1000) - state.bossAppearTime;
  const timeout = state.bossTimeout;

  if (reactionTime <= timeout) {
    // 成功伪装
    state.dodgeCount++;
    state.combo++;
    state.maxCombo = Math.max(state.maxCombo, state.combo);

    // ---- 时序评级 ----
    const rating = getTimingRating(reactionTime, timeout);
    const ratingConfig = getRatingConfig(rating);
    const ratingMultiplier = getRatingScoreMultiplier(rating);

    // 连击倍率 + 时序评级倍率
    const comboMultiplier = Math.min(state.combo, 10);
    const baseScore = 50;
    const rawScore = baseScore * comboMultiplier;
    const bonusScore = Math.floor(rawScore * ratingMultiplier);
    state.score += bonusScore;

    // 近身闪避检测（在最后 0.3 秒内躲避）
    const isCloseCall = reactionTime > timeout - 0.3;
    if (isCloseCall) {
      state.score += 100; // 近身闪避额外加分
      triggerCloseCall(state);
      showMessage(state, '极限闪避！+100', 1.5, 'success');
    } else {
      const comboText = state.combo > 1 ? ` (${state.combo}连击!)` : '';
      const ratingText = ratingConfig.label;
      showMessage(state, `${ratingText} 安全！${comboText}`, 1.2, 'success');
    }

    // 老板消失
    boss.isDisappearing = true;
    boss.disappearTimer = 0;
    boss.expression = 'surprised';

    // 选择消失动画
    const disappearTypes = ['fade', 'shrink', 'slideLeft'];
    boss.disappearType = disappearTypes[Math.floor(Math.random() * disappearTypes.length)];

    triggerFlash(state, '#35C759', 0.1);

    return {
      success: true,
      closeCall: isCloseCall,
      combo: state.combo,
      score: bonusScore,
      rating,              // 时序评级
      ratingConfig,        // 评级配置（颜色、标签等）
      reactionTime,        // 反应时间
      timeout,             // 超时时间
    };
  }

  return { success: false };
}

/**
 * 同事掩护自动处理
 */
export function handleColleagueCover(state, boss, canvasCenterX) {
  state.dodgeCount++;
  state.combo++;
  state.maxCombo = Math.max(state.maxCombo, state.combo);
  state.score += 50;

  boss.isDisappearing = true;
  boss.disappearTimer = 0;
  boss.expression = 'surprised';
  boss.disappearType = 'slideLeft';

  // 注意：消息和分数弹出由 useColleagueCover() 处理，此处不再重复
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
