/**
 * gameState.js - 游戏状态管理模块
 * 管理游戏的所有状态数据和视觉效果状态
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
  IDLE: 'idle',           // 摸鱼中
  WORKING: 'working',     // 认真工作中（伪装）
};

/**
 * 创建初始游戏状态
 */
export function createGameState() {
  return {
    // 游戏状态
    status: GameStatus.MENU,

    // 游戏时间相关
    totalTime: 30,
    remainingTime: 30,
    elapsedTime: 0,

    // 分数相关
    score: 0,
    combo: 0,
    dodgeCount: 0,

    // 玩家状态
    playerStatus: PlayerStatus.IDLE,

    // 老板相关
    bossVisible: false,
    bossAppearTime: 0,
    bossTimeout: 1.2,
    nextBossTime: 0,

    // 提示信息
    message: '',
    messageTimer: 0,
    messageDuration: 1.5,

    // 动画相关
    shakeTimer: 0,
    shakeIntensity: 0,

    // === 视觉效果状态 ===

    // 按钮脉冲动画（老板出现时伪装按钮跳动）
    buttonPulse: 0,

    // 浮动分数弹出 [{x, y, text, alpha, vy, color}]
    scorePopups: [],

    // 页面过渡透明度
    transitionAlpha: 1,

    // 菜单页浮动装饰emoji [{x, y, emoji, vy, alpha, phase}]
    floatingEmojis: [],

    // 游戏是否暂停
    paused: false,
  };
}

/**
 * 重置游戏状态为初始值
 */
export function resetGameState(state) {
  state.status = GameStatus.PLAYING;
  state.remainingTime = state.totalTime;
  state.elapsedTime = 0;
  state.score = 0;
  state.combo = 0;
  state.dodgeCount = 0;
  state.playerStatus = PlayerStatus.IDLE;
  state.bossVisible = false;
  state.bossAppearTime = 0;
  state.nextBossTime = 0;
  state.message = '';
  state.messageTimer = 0;
  state.shakeTimer = 0;
  state.shakeIntensity = 0;
  state.buttonPulse = 0;
  state.scorePopups = [];
  state.transitionAlpha = 1;
  state.floatingEmojis = [];
  state.paused = false;
  return state;
}

/**
 * 更新游戏时间
 */
export function updateGameTime(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;
  state.remainingTime -= deltaTime;
  state.elapsedTime += deltaTime;
  if (state.remainingTime <= 0) {
    state.remainingTime = 0;
    state.status = GameStatus.GAME_OVER;
  }
}

/**
 * 更新分数（每秒自动增加）
 */
export function updateScore(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;
  if (state.playerStatus === PlayerStatus.IDLE) {
    state.score += 10 * deltaTime;
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
    // 老板出现时脉冲循环
    state.buttonPulse += deltaTime * 4; // 速度
    if (state.buttonPulse > 1) state.buttonPulse -= 1;
  } else {
    // 平滑回到0
    state.buttonPulse = Math.max(0, state.buttonPulse - deltaTime * 3);
  }
}

/**
 * 更新浮动分数弹出
 */
export function updateScorePopups(state, deltaTime) {
  for (let i = state.scorePopups.length - 1; i >= 0; i--) {
    const p = state.scorePopups[i];
    p.y += p.vy * deltaTime;
    p.alpha -= deltaTime * 1.2;
    if (p.alpha <= 0) {
      state.scorePopups.splice(i, 1);
    }
  }
}

/**
 * 添加浮动分数
 */
export function addScorePopup(state, text, x, y, color = '#FFD700') {
  state.scorePopups.push({
    x, y,
    text,
    alpha: 1,
    vy: -60,
    color,
    scale: 1.2,
  });
}

/**
 * 更新菜单页浮动emoji
 */
export function updateFloatingEmojis(state, deltaTime) {
  if (state.floatingEmojis.length === 0) return;
  for (let i = state.floatingEmojis.length - 1; i >= 0; i--) {
    const e = state.floatingEmojis[i];
    e.y += e.vy * deltaTime;
    e.alpha -= deltaTime * 0.25;
    if (e.alpha <= 0 || e.y < -80) {
      state.floatingEmojis.splice(i, 1);
    }
  }
}

/**
 * 显示消息
 */
export function showMessage(state, message, duration = 1.5) {
  state.message = message;
  state.messageTimer = duration;
}

/**
 * 触发震动效果
 */
export function triggerShake(state, intensity = 5, duration = 0.3) {
  state.shakeIntensity = intensity;
  state.shakeTimer = duration;
}

/**
 * 获取震动偏移量
 */
export function getShakeOffset(state) {
  if (state.shakeTimer <= 0) return { x: 0, y: 0 };
  const intensity = state.shakeIntensity * (state.shakeTimer / 0.3);
  return {
    x: (Math.random() - 0.5) * intensity * 2,
    y: (Math.random() - 0.5) * intensity * 2,
  };
}
