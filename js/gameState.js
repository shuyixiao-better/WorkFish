/**
 * gameState.js - 游戏状态管理模块
 * 管理游戏的所有状态数据
 */

/**
 * 游戏状态枚举
 */
export const GameStatus = {
  MENU: 'menu',           // 菜单页
  PLAYING: 'playing',     // 游戏进行中
  GAME_OVER: 'gameOver',  // 游戏结束
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
 * @returns {Object} 游戏状态对象
 */
export function createGameState() {
  return {
    // 游戏状态
    status: GameStatus.MENU,

    // 游戏时间相关
    totalTime: 30,          // 总游戏时间（秒）
    remainingTime: 30,      // 剩余时间（秒）
    elapsedTime: 0,         // 已过时间（秒）

    // 分数相关
    score: 0,               // 当前分数
    combo: 0,               // 连续成功次数
    dodgeCount: 0,          // 成功躲避老板次数

    // 玩家状态
    playerStatus: PlayerStatus.IDLE,

    // 老板相关
    bossVisible: false,     // 老板是否可见
    bossAppearTime: 0,      // 老板出现的时间戳
    bossTimeout: 1.2,       // 玩家反应时间限制（秒）
    nextBossTime: 0,        // 下次老板出现的时间

    // 提示信息
    message: '',            // 当前显示的消息
    messageTimer: 0,        // 消息显示计时器
    messageDuration: 1.5,   // 消息显示时长（秒）

    // 动画相关
    shakeTimer: 0,          // 屏幕震动计时器
    shakeIntensity: 0,      // 震动强度

    // 游戏是否暂停
    paused: false,
  };
}

/**
 * 重置游戏状态为初始值
 * @param {Object} state - 游戏状态对象
 * @returns {Object} 重置后的游戏状态
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
  state.paused = false;
  return state;
}

/**
 * 更新游戏时间
 * @param {Object} state - 游戏状态对象
 * @param {number} deltaTime - 帧间隔时间（秒）
 */
export function updateGameTime(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) {
    return;
  }

  state.remainingTime -= deltaTime;
  state.elapsedTime += deltaTime;

  // 时间到，游戏结束
  if (state.remainingTime <= 0) {
    state.remainingTime = 0;
    state.status = GameStatus.GAME_OVER;
  }
}

/**
 * 更新分数（每秒自动增加）
 * @param {Object} state - 游戏状态对象
 * @param {number} deltaTime - 帧间隔时间（秒）
 */
export function updateScore(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) {
    return;
  }

  // 摸鱼中每秒加10分
  if (state.playerStatus === PlayerStatus.IDLE) {
    state.score += 10 * deltaTime;
  }
}

/**
 * 更新消息显示
 * @param {Object} state - 游戏状态对象
 * @param {number} deltaTime - 帧间隔时间（秒）
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
 * @param {Object} state - 游戏状态对象
 * @param {number} deltaTime - 帧间隔时间（秒）
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
 * 显示消息
 * @param {Object} state - 游戏状态对象
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长（秒）
 */
export function showMessage(state, message, duration = 1.5) {
  state.message = message;
  state.messageTimer = duration;
}

/**
 * 触发震动效果
 * @param {Object} state - 游戏状态对象
 * @param {number} intensity - 震动强度
 * @param {number} duration - 震动时长（秒）
 */
export function triggerShake(state, intensity = 5, duration = 0.3) {
  state.shakeIntensity = intensity;
  state.shakeTimer = duration;
}

/**
 * 获取震动偏移量
 * @param {Object} state - 游戏状态对象
 * @returns {Object} {x, y} 偏移量
 */
export function getShakeOffset(state) {
  if (state.shakeTimer <= 0) {
    return { x: 0, y: 0 };
  }

  const intensity = state.shakeIntensity * (state.shakeTimer / 0.3);
  return {
    x: (Math.random() - 0.5) * intensity * 2,
    y: (Math.random() - 0.5) * intensity * 2,
  };
}
