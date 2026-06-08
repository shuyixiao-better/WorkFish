/**
 * gameState.js - 游戏状态管理模块 v2.0
 * 
 * 新增系统：
 * - 怀疑值（Suspicion）：老板出现时持续累积，增加紧迫感
 * - 道具槽位与效果状态
 * - 成就解锁追踪
 * - 持久化统计数据
 * - 关卡/难度递增
 * - 连击倍率系统
 */

/**
 * 游戏状态枚举
 */
export const GameStatus = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
};

/**
 * 玩家状态枚举
 */
export const PlayerStatus = {
  IDLE: 'idle',       // 摸鱼中
  WORKING: 'working', // 认真工作中（伪装）
};

/**
 * 道具类型
 */
export const ItemType = {
  COFFEE: 'coffee',       // 咖啡：老板出现时时间减缓
  HEADPHONE: 'headphone', // 耳机：提前预警老板
  COLLEAGUE: 'colleague', // 同事：自动处理下次老板
};

/**
 * 创建初始游戏状态
 */
export function createGameState() {
  return {
    // ---- 游戏状态 ----
    status: GameStatus.MENU,
    paused: false,

    // ---- 时间 ----
    totalTime: 30,
    remainingTime: 30,
    elapsedTime: 0,

    // ---- 分数 ----
    score: 0,
    combo: 0,
    maxCombo: 0,
    dodgeCount: 0,
    itemsUsed: 0,

    // ---- 玩家状态 ----
    playerStatus: PlayerStatus.IDLE,

    // ---- 老板 ----
    bossVisible: false,
    bossAppearTime: 0,
    bossTimeout: 1.3,
    nextBossTime: 0,
    bossStyle: 'normal',     // 'normal' | 'sneaky' | 'urgent'

    // ---- 怀疑值系统 (0~100) ----
    suspicion: 0,
    suspicionRate: 0,        // 当前累积速率

    // ---- 道具系统 ----
    activeItem: null,        // { type, remaining } 当前激活的道具
    nextItemSpawnTime: 0,    // 下一个道具出现时间

    // ---- 提示信息 ----
    message: '',
    messageTimer: 0,
    messageDuration: 1.5,
    messageType: 'normal',   // 'normal' | 'warning' | 'success' | 'danger'

    // ---- 视觉效果 ----
    shakeTimer: 0,
    shakeIntensity: 0,
    buttonPulse: 0,
    flashAlpha: 0,           // 全屏闪白
    flashColor: '#FFFFFF',

    // ---- 浮动文字 ----
    scorePopups: [],

    // ---- 菜单页 ----
    floatingEmojis: [],
    menuBgPhase: 0,

    // ---- 页面过渡 ----
    transitionAlpha: 1,
    transitionTarget: null,

    // ---- 成就通知 ----
    achievementPopup: null,   // { achievement, timer }
    achievementTimer: 0,

    // ---- 连击特效 ----
    comboGlow: 0,

    // ---- 近身闪避 ----
    closeCallTriggered: false,
    closeCallTimer: 0,

    // ---- 画面冻结 (Hit Stop) ----
    hitStopTimer: 0,

    // ---- 冲击波环 ----
    impactRings: [],

    // ---- 时序评级弹出 ----
    ratingPopups: [],

    // ---- 速度线 ----
    speedLines: [],
    speedLineAlpha: 0,

    // ---- 飞散纸张 ----
    flyingPapers: [],

    // ---- 成功辐射线 ----
    successRayTimer: 0,

    // ---- 游戏结束动画 ----
    gameOverAnimTimer: 0,
    gameOverAnimDuration: 1.8,   // 从游戏场景过渡到结算页的动画时长
  };
}

/**
 * 重置游戏状态为初始值
 */
export function resetGameState(state) {
  state.status = GameStatus.PLAYING;
  state.paused = false;
  state.remainingTime = state.totalTime;
  state.elapsedTime = 0;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.dodgeCount = 0;
  state.itemsUsed = 0;
  state.playerStatus = PlayerStatus.IDLE;
  state.bossVisible = false;
  state.bossAppearTime = 0;
  state.bossStyle = 'normal';
  state.suspicion = 0;
  state.suspicionRate = 0;
  state.activeItem = null;
  state.nextItemSpawnTime = 5 + Math.random() * 3;
  state.message = '';
  state.messageTimer = 0;
  state.messageType = 'normal';
  state.shakeTimer = 0;
  state.shakeIntensity = 0;
  state.buttonPulse = 0;
  state.flashAlpha = 0;
  state.flashColor = '#FFFFFF';
  state.scorePopups = [];
  state.floatingEmojis = [];
  state.transitionAlpha = 1;
  state.transitionTarget = null;
  state.achievementPopup = null;
  state.achievementTimer = 0;
  state.comboGlow = 0;
  state.closeCallTriggered = false;
  state.closeCallTimer = 0;
  state.hitStopTimer = 0;
  state.impactRings = [];
  state.ratingPopups = [];
  state.speedLines = [];
  state.speedLineAlpha = 0;
  state.flyingPapers = [];
  state.successRayTimer = 0;
  state.gameOverAnimTimer = 0;
  return state;
}

/**
 * 更新游戏时间
 */
export function updateGameTime(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;

  // 咖啡道具效果：减缓倒计时
  let timeScale = 1;
  if (state.activeItem && state.activeItem.type === ItemType.COFFEE && state.bossVisible) {
    timeScale = 0.5; // 老板出现时减缓 50%
  }

  state.remainingTime -= deltaTime * timeScale;
  state.elapsedTime += deltaTime;

  if (state.remainingTime <= 0) {
    state.remainingTime = 0;
    state.status = GameStatus.GAME_OVER;
    // 时间耗尽也需要视觉反馈
    triggerShake(state, 10, 0.5);
    triggerFlash(state, '#FF4444', 0.25);
  }
}

/**
 * 更新分数（每秒自动增加摸鱼分）
 */
export function updateScore(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;
  if (state.playerStatus === PlayerStatus.IDLE) {
    // 基础每秒 10 分 + 连击加成
    const comboBonus = 1 + state.combo * 0.1;
    state.score += 10 * deltaTime * comboBonus;
  }
}

/**
 * 更新怀疑值
 */
export function updateSuspicion(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING) return;

  if (state.bossVisible) {
    // 老板在场时怀疑值持续累积，后期更快
    const elapsed = state.elapsedTime;
    const baseRate = 15; // 基础速率
    const timeBonus = Math.min(elapsed / 30, 1) * 20; // 后期加成
    state.suspicionRate = baseRate + timeBonus;
    state.suspicion = Math.min(100, state.suspicion + state.suspicionRate * deltaTime);
  } else {
    // 老板不在时怀疑值缓慢衰减
    state.suspicionRate = 0;
    state.suspicion = Math.max(0, state.suspicion - 8 * deltaTime);
  }
}

/**
 * 更新道具状态
 */
export function updateActiveItem(state, deltaTime) {
  if (!state.activeItem) return;
  state.activeItem.remaining -= deltaTime;
  if (state.activeItem.remaining <= 0) {
    state.activeItem = null;
  }
}

/**
 * 更新消息显示
 */
export function updateMessage(state, deltaTime) {
  if (state.messageTimer > 0) {
    state.messageTimer -= deltaTime;
    if (state.messageTimer <= 0) {
      state.message = '';
      state.messageTimer = 0;
      state.messageType = 'normal';
    }
  }
}

/**
 * 更新震动效果
 */
export function updateShake(state, deltaTime) {
  if (state.shakeTimer > 0) {
    state.shakeTimer -= deltaTime;
    if (state.shakeTimer <= 0) {
      state.shakeTimer = 0;
      state.shakeIntensity = 0;
    }
  }
}

/**
 * 更新按钮脉冲效果
 */
export function updateButtonPulse(state, deltaTime) {
  if (state.bossVisible) {
    state.buttonPulse += deltaTime * 4;
    if (state.buttonPulse > 1) state.buttonPulse -= 1;
  } else {
    state.buttonPulse = Math.max(0, state.buttonPulse - deltaTime * 3);
  }
}

/**
 * 更新闪屏效果
 */
export function updateFlash(state, deltaTime) {
  if (state.flashAlpha > 0) {
    state.flashAlpha = Math.max(0, state.flashAlpha - deltaTime * 3);
  }
}

/**
 * 更新连击光效
 */
export function updateComboGlow(state, deltaTime) {
  if (state.combo >= 3) {
    state.comboGlow = Math.min(1, state.comboGlow + deltaTime * 2);
  } else {
    state.comboGlow = Math.max(0, state.comboGlow - deltaTime * 2);
  }
}

/**
 * 更新近身闪避特效
 */
export function updateCloseCall(state, deltaTime) {
  if (state.closeCallTimer > 0) {
    state.closeCallTimer -= deltaTime;
    if (state.closeCallTimer <= 0) {
      state.closeCallTimer = 0;
      state.closeCallTriggered = false;
    }
  }
}

/**
 * 更新浮动分数弹出
 */
export function updateScorePopups(state, deltaTime) {
  for (let i = state.scorePopups.length - 1; i >= 0; i--) {
    const p = state.scorePopups[i];
    p.y += p.vy * deltaTime;
    p.alpha -= deltaTime * 1.0;
    p.scale = lerpScale(p.scale, 1, deltaTime * 3);
    if (p.alpha <= 0) {
      state.scorePopups.splice(i, 1);
    }
  }
}

/**
 * 更新成就弹窗
 */
export function updateAchievementPopup(state, deltaTime) {
  if (state.achievementPopup) {
    state.achievementTimer -= deltaTime;
    if (state.achievementTimer <= 0) {
      state.achievementPopup = null;
      state.achievementTimer = 0;
    }
  }
}

/**
 * 更新菜单页浮动 emoji
 */
export function updateFloatingEmojis(state, deltaTime) {
  if (!state.floatingEmojis || state.floatingEmojis.length === 0) return;
  for (let i = state.floatingEmojis.length - 1; i >= 0; i--) {
    const e = state.floatingEmojis[i];
    e.y += e.vy * deltaTime;
    e.alpha -= deltaTime * 0.2;
    if (e.alpha <= 0 || e.y < -80) {
      state.floatingEmojis.splice(i, 1);
    }
  }
}

/**
 * 更新画面冻结计时器
 * @returns {boolean} 是否处于冻结中
 */
export function updateHitStop(state, deltaTime) {
  if (state.hitStopTimer > 0) {
    state.hitStopTimer -= deltaTime;
    if (state.hitStopTimer <= 0) {
      state.hitStopTimer = 0;
    }
    return true;
  }
  return false;
}

/**
 * 更新游戏结束动画计时器
 */
export function updateGameOverAnim(state, deltaTime) {
  if (state.gameOverAnimTimer > 0 && state.gameOverAnimTimer < state.gameOverAnimDuration) {
    state.gameOverAnimTimer += deltaTime;
  }
}

// ============================================================
//  操作函数
// ============================================================

/**
 * 显示消息
 */
export function showMessage(state, message, duration = 1.5, type = 'normal') {
  state.message = message;
  state.messageTimer = duration;
  state.messageType = type;
}

/**
 * 触发震动效果
 */
export function triggerShake(state, intensity = 5, duration = 0.3) {
  state.shakeIntensity = intensity;
  state.shakeTimer = duration;
}

/**
 * 触发画面冻结（hit stop）
 */
export function triggerHitStop(state, duration = 0.08) {
  state.hitStopTimer = duration;
}

/**
 * 触发闪屏
 */
export function triggerFlash(state, color = '#FFFFFF', alpha = 0.4) {
  state.flashAlpha = alpha;
  state.flashColor = color;
}

/**
 * 触发近身闪避特效
 */
export function triggerCloseCall(state) {
  state.closeCallTriggered = true;
  state.closeCallTimer = 1.5;
}

/**
 * 添加浮动分数
 */
export function addScorePopup(state, text, x, y, color = '#FFD700', scale = 1.3) {
  state.scorePopups.push({
    x, y,
    text,
    alpha: 1,
    vy: -55,
    color,
    scale,
  });
}

/**
 * 获取震动偏移量
 */
export function getShakeOffset(state) {
  if (state.shakeTimer <= 0) return { x: 0, y: 0 };
  const t = state.shakeTimer / 0.3;
  const intensity = state.shakeIntensity * t;
  // 使用高频振荡而非纯随机，更平滑
  const time = Date.now() / 1000;
  return {
    x: Math.sin(time * 47) * intensity,
    y: Math.cos(time * 53) * intensity * 0.7,
  };
}

/**
 * 缩放插值辅助
 */
function lerpScale(current, target, speed) {
  return current + (target - current) * Math.min(speed, 1);
}
