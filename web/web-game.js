/**
 * web-game.js - Web版本游戏入口（用于Cloudflare部署）
 * 老板来了 - 上班摸鱼醒脑神器
 */

// ============ 工具函数 ============
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function formatTime(seconds) {
  return `${Math.ceil(seconds)}s`;
}

function formatScore(score) {
  return Math.floor(score).toString();
}

function getTitle(score) {
  if (score < 200) return '实习摸鱼员';
  if (score < 500) return '职场老油条';
  if (score < 800) return '办公室影帝';
  return '摸鱼宗师';
}

function getBossInterval(elapsedTime) {
  if (elapsedTime < 10) return [4, 6];
  if (elapsedTime < 20) return [3, 4];
  return [2, 3];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isPointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

function easeOutQuad(t) {
  return t * (2 - t);
}

// ============ 游戏状态 ============
const GameStatus = { MENU: 'menu', PLAYING: 'playing', GAME_OVER: 'gameOver' };
const PlayerStatus = { IDLE: 'idle', WORKING: 'working' };

function createGameState() {
  return {
    status: GameStatus.MENU,
    totalTime: 30,
    remainingTime: 30,
    elapsedTime: 0,
    score: 0,
    combo: 0,
    dodgeCount: 0,
    playerStatus: PlayerStatus.IDLE,
    bossVisible: false,
    bossAppearTime: 0,
    bossTimeout: 1.2,
    nextBossTime: 0,
    message: '',
    messageTimer: 0,
    messageDuration: 1.5,
    shakeTimer: 0,
    shakeIntensity: 0,
    paused: false,
  };
}

function resetGameState(state) {
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

function updateGameTime(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;
  state.remainingTime -= deltaTime;
  state.elapsedTime += deltaTime;
  if (state.remainingTime <= 0) {
    state.remainingTime = 0;
    state.status = GameStatus.GAME_OVER;
  }
}

function updateScore(state, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;
  if (state.playerStatus === PlayerStatus.IDLE) {
    state.score += 10 * deltaTime;
  }
}

function updateMessage(state, deltaTime) {
  if (state.messageTimer > 0) {
    state.messageTimer -= deltaTime;
    if (state.messageTimer <= 0) {
      state.message = '';
      state.messageTimer = 0;
    }
  }
}

function updateShake(state, deltaTime) {
  if (state.shakeTimer > 0) {
    state.shakeTimer -= deltaTime;
    if (state.shakeTimer <= 0) {
      state.shakeTimer = 0;
      state.shakeIntensity = 0;
    }
  }
}

function showMessage(state, message, duration = 1.5) {
  state.message = message;
  state.messageTimer = duration;
}

function triggerShake(state, intensity = 5, duration = 0.3) {
  state.shakeIntensity = intensity;
  state.shakeTimer = duration;
}

function getShakeOffset(state) {
  if (state.shakeTimer <= 0) return { x: 0, y: 0 };
  const intensity = state.shakeIntensity * (state.shakeTimer / 0.3);
  return {
    x: (Math.random() - 0.5) * intensity * 2,
    y: (Math.random() - 0.5) * intensity * 2,
  };
}

// ============ 玩家 ============
function createPlayer() {
  return {
    x: 0, y: 0,
    statusTimer: 0, statusDuration: 0.5,
    disguiseTimer: 0, disguiseDuration: 0.3,
    expression: 'happy',
    totalGames: 0, totalScore: 0, bestScore: 0, bestCombo: 0,
  };
}

function updatePlayer(player, deltaTime) {
  if (player.statusTimer > 0) player.statusTimer -= deltaTime;
  if (player.disguiseTimer > 0) player.disguiseTimer -= deltaTime;
}

function triggerDisguise(player) {
  player.disguiseTimer = player.disguiseDuration;
  player.expression = 'nervous';
}

function setExpression(player, expression) {
  player.expression = expression;
}

function updateStats(player, score, combo) {
  player.totalGames++;
  player.totalScore += score;
  player.bestScore = Math.max(player.bestScore, score);
  player.bestCombo = Math.max(player.bestCombo, combo);
}

function getStatusText(status) {
  return status === 'idle' ? '摸鱼中' : '认真工作中';
}

// ============ 老板 ============
function createBoss() {
  return {
    x: 0, y: 0, width: 120, height: 150,
    appearTimer: 0, appearDuration: 0.3,
    disappearTimer: 0, disappearDuration: 0.2,
    expression: 'angry',
    isAppearing: false, isDisappearing: false,
    warningProgress: 0,
  };
}

function updateBoss(state, boss, deltaTime) {
  if (state.status !== GameStatus.PLAYING || state.paused) return;

  if (boss.isAppearing) {
    boss.appearTimer += deltaTime;
    if (boss.appearTimer >= boss.appearDuration) {
      boss.isAppearing = false;
      boss.appearTimer = boss.appearDuration;
    }
  }

  if (boss.isDisappearing) {
    boss.disappearTimer += deltaTime;
    if (boss.disappearTimer >= boss.disappearDuration) {
      boss.isDisappearing = false;
      boss.disappearTimer = 0;
      state.bossVisible = false;
    }
  }

  if (state.bossVisible && !boss.isDisappearing) {
    const elapsed = (Date.now() / 1000) - state.bossAppearTime;
    boss.warningProgress = Math.min(elapsed / state.bossTimeout, 1);
    if (elapsed >= state.bossTimeout) {
      state.status = GameStatus.GAME_OVER;
      showMessage(state, '你被老板抓包了！', 2);
      triggerShake(state, 10, 0.5);
    }
  }
}

function shouldBossAppear(state, boss) {
  if (state.status !== GameStatus.PLAYING) return false;
  if (state.bossVisible || boss.isDisappearing) return false;
  return state.elapsedTime >= state.nextBossTime;
}

function makeBossAppear(state, boss, canvasWidth, canvasHeight) {
  state.bossVisible = true;
  state.bossAppearTime = Date.now() / 1000;
  state.playerStatus = PlayerStatus.IDLE;
  boss.isAppearing = true;
  boss.isDisappearing = false;
  boss.appearTimer = 0;
  boss.disappearTimer = 0;
  boss.warningProgress = 0;
  boss.x = (canvasWidth - boss.width) / 2;
  boss.y = canvasHeight * 0.2;
  boss.expression = 'angry';

  const interval = getBossInterval(state.elapsedTime);
  state.nextBossTime = state.elapsedTime + randomFloat(interval[0], interval[1]);
  showMessage(state, '老板来了！', 0.8);
  triggerShake(state, 3, 0.2);
}

function handleDisguise(state, boss) {
  if (!state.bossVisible || boss.isDisappearing) return false;
  const reactionTime = (Date.now() / 1000) - state.bossAppearTime;
  if (reactionTime <= state.bossTimeout) {
    state.dodgeCount++;
    state.combo++;
    state.score += 50;
    boss.isDisappearing = true;
    boss.disappearTimer = 0;
    boss.expression = 'surprised';
    const comboText = state.combo > 1 ? ` (${state.combo}连击!)` : '';
    showMessage(state, `安全！老板没发现${comboText}`, 1.5);
    return true;
  }
  return false;
}

function getAppearProgress(boss) {
  return boss.isAppearing ? boss.appearTimer / boss.appearDuration : 1;
}

// ============ 场景绘制 ============
function drawOfficeBackground(ctx, width, height) {
  // 墙壁
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  // 墙纸纹理
  ctx.fillStyle = '#e8e8e8';
  for (let y = 0; y < height; y += 40) {
    for (let x = 0; x < width; x += 40) {
      if ((x + y) % 80 === 0) ctx.fillRect(x, y, 20, 20);
    }
  }

  // 地板
  const floorY = height * 0.7;
  const gradient = ctx.createLinearGradient(0, floorY, 0, height);
  gradient.addColorStop(0, '#8B7355');
  gradient.addColorStop(1, '#6B5B45');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, floorY, width, height - floorY);

  // 地板纹理
  ctx.strokeStyle = '#5B4B35';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, floorY);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 窗户
  drawWindow(ctx, width * 0.15, height * 0.1, 120, 150);
  // 时钟
  drawClock(ctx, width * 0.75, height * 0.12, 40);
  // 办公桌
  drawDesk(ctx, width * 0.2, height * 0.45, width * 0.6, 120);
  // 电脑
  drawComputer(ctx, width * 0.35, height * 0.3, 150, 100);
  // 椅子
  drawChair(ctx, width * 0.4, height * 0.55, 80, 60);
  // 植物
  drawPlant(ctx, width * 0.85, height * 0.4, 50, 80);
}

function drawWindow(ctx, x, y, w, h) {
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#87CEEB');
  g.addColorStop(0.5, '#B0E0E6');
  g.addColorStop(1, '#87CEEB');
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + w, y + h / 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(x + 10, y + 10, w / 3, h / 3);
}

function drawClock(ctx, x, y, radius) {
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#333';
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * radius * 0.8, y + Math.sin(angle) * radius * 0.8);
    ctx.lineTo(x + Math.cos(angle) * radius * 0.9, y + Math.sin(angle) * radius * 0.9);
    ctx.stroke();
  }

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const hourAngle = (9 * Math.PI) / 6 + (5 * Math.PI) / 360 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * radius * 0.5, y + Math.sin(hourAngle) * radius * 0.5);
  ctx.stroke();

  ctx.lineWidth = 2;
  const minuteAngle = (5 * Math.PI) / 30 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(minuteAngle) * radius * 0.7, y + Math.sin(minuteAngle) * radius * 0.7);
  ctx.stroke();

  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawDesk(ctx, x, y, w, h) {
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(x, y, w, h * 0.2);
  ctx.fillStyle = '#6B5B45';
  ctx.fillRect(x + 20, y + h * 0.2, 15, h * 0.8);
  ctx.fillRect(x + w - 35, y + h * 0.2, 15, h * 0.8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(x + 5, y + 2, w - 10, h * 0.1);
}

function drawComputer(ctx, x, y, w, h) {
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  const lines = ['function work() {', '  // TODO: 假装在写代码', '  return "摸鱼";', '}'];
  lines.forEach((line, i) => ctx.fillText(line, x + 15, y + 25 + i * 15));
  ctx.fillStyle = '#333';
  ctx.fillRect(x + w / 2 - 15, y + h, 30, 20);
  ctx.fillRect(x + w / 2 - 30, y + h + 20, 60, 5);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(x + 15, y + 15, w / 3, h / 3);
}

function drawChair(ctx, x, y, w, h) {
  ctx.fillStyle = '#555';
  ctx.fillRect(x, y, w, h * 0.4);
  ctx.fillStyle = '#444';
  ctx.fillRect(x + 10, y - h * 0.5, w - 20, h * 0.5);
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 10, y + h * 0.4, 8, h * 0.6);
  ctx.fillRect(x + w - 18, y + h * 0.4, 8, h * 0.6);
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(x + 14, y + h, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w - 14, y + h, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlant(ctx, x, y, w, h) {
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.6);
  ctx.lineTo(x + w, y + h * 0.6);
  ctx.lineTo(x + w * 0.8, y + h);
  ctx.lineTo(x + w * 0.2, y + h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#228B22';
  const leaves = [
    { x: x + w * 0.5, y: y + h * 0.3 },
    { x: x + w * 0.3, y: y + h * 0.4 },
    { x: x + w * 0.7, y: y + h * 0.4 },
    { x: x + w * 0.2, y: y + h * 0.5 },
    { x: x + w * 0.8, y: y + h * 0.5 },
  ];
  leaves.forEach(pos => {
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, 15, 25, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayerIdle(ctx, x, y, size) {
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x - size / 2, y, size, size * 1.2);
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.4, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x - size * 0.12, y - size * 0.3, 3, 0, Math.PI * 2);
  ctx.arc(x + size * 0.12, y - size * 0.3, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y - size * 0.2, size * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#333';
  ctx.fillRect(x - size * 0.5, y + size * 0.2, size * 0.3, size * 0.5);
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x - size * 0.48, y + size * 0.22, size * 0.26, size * 0.46);
}

function drawPlayerWorking(ctx, x, y, size) {
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x - size / 2, y, size, size * 1.2);
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.4, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x - size * 0.12, y - size * 0.3, 4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.12, y - size * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size * 0.15, y - size * 0.15);
  ctx.lineTo(x + size * 0.15, y - size * 0.15);
  ctx.stroke();
  ctx.fillStyle = '#87CEEB';
  ctx.beginPath();
  ctx.ellipse(x + size * 0.35, y - size * 0.1, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.ellipse(x - size * 0.3, y + size * 0.4, 8, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + size * 0.3, y + size * 0.4, 8, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBoss(ctx, x, y, size, expression) {
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(x - size / 2, y, size, size * 1.3);
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.1);
  ctx.lineTo(x - size * 0.08, y + size * 0.5);
  ctx.lineTo(x, y + size * 0.6);
  ctx.lineTo(x + size * 0.08, y + size * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.3, size * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.45, Math.PI * 0.8, Math.PI * 2.2);
  ctx.fill();

  ctx.fillStyle = '#333';
  if (expression === 'angry') {
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.25, y - size * 0.45);
    ctx.lineTo(x - size * 0.05, y - size * 0.38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + size * 0.25, y - size * 0.45);
    ctx.lineTo(x + size * 0.05, y - size * 0.38);
    ctx.stroke();
  } else if (expression === 'surprised') {
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.3, 6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.3, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  if (expression === 'angry') {
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, y - size * 0.1);
    ctx.lineTo(x + size * 0.2, y - size * 0.1);
    ctx.stroke();
  } else if (expression === 'surprised') {
    ctx.beginPath();
    ctx.arc(x, y - size * 0.08, size * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x, y - size * 0.1, size * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + size * 0.3, y + size * 0.2, size * 0.3, size * 0.4);
  ctx.fillStyle = '#654321';
  ctx.fillRect(x + size * 0.3, y + size * 0.2, size * 0.3, size * 0.05);
}

// ============ UI绘制 ============
function drawMenuPage(ctx, width, height, button) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 装饰
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(width * 0.15, height * 0.7, 60, 45);
  ctx.fillRect(width * 0.15 + 20, height * 0.7 + 45, 20, 10);
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.75, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '30px Arial';
  ctx.fillText('💼', width * 0.2, height * 0.8);
  ctx.fillText('📱', width * 0.85, height * 0.85);

  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('老板来了', width / 2, height * 0.25);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillText('老板来了', width / 2 + 3, height * 0.25 + 3);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '24px Arial';
  ctx.fillText('上班摸鱼醒脑神器', width / 2, height * 0.35);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '16px Arial';
  ctx.fillText('老板会随机出现，快点击"伪装工作"按钮！', width / 2, height * 0.5);
  ctx.fillText('反应太慢就会被抓包哦~', width / 2, height * 0.55);

  drawButton(ctx, button, '开始摸鱼', '#ff6b6b', '#ee5a24');

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '14px Arial';
  ctx.fillText('适合上班摸鱼时玩的30秒醒脑小游戏', width / 2, height * 0.85);
}

function drawGameUI(ctx, width, height, state, button) {
  // 顶部信息栏
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, 50);

  ctx.fillStyle = state.remainingTime <= 5 ? '#ff6b6b' : '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`⏱ ${formatTime(state.remainingTime)}`, 15, 25);

  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'center';
  ctx.fillText(`⭐ ${formatScore(state.score)}`, width / 2, 25);

  if (state.combo > 1) {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${state.combo}x COMBO`, width / 2, 45);
  }

  ctx.fillStyle = state.playerStatus === PlayerStatus.IDLE ? '#2ecc71' : '#f39c12';
  ctx.textAlign = 'right';
  ctx.font = '16px Arial';
  ctx.fillText(getStatusText(state.playerStatus), width - 15, 25);

  // 状态表情
  const statusIcon = state.playerStatus === PlayerStatus.IDLE ? '😊' : '😰';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(statusIcon, width / 2, 80);

  // 消息
  if (state.message) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    const msgWidth = 280;
    const msgHeight = 50;
    const msgX = (width - msgWidth) / 2;
    const msgY = height * 0.15;
    roundRect(ctx, msgX, msgY, msgWidth, msgHeight, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.message, width / 2, msgY + msgHeight / 2);
  }

  // 伪装按钮
  const buttonColor = state.bossVisible ? '#ff6b6b' : '#95a5a6';
  const buttonHoverColor = state.bossVisible ? '#ee5a24' : '#7f8c8d';
  const buttonText = state.bossVisible ? '伪装工作！' : '伪装工作';
  drawButton(ctx, button, buttonText, buttonColor, buttonHoverColor);

  // 警告进度条
  if (state.bossVisible) {
    const barWidth = width * 0.6;
    const barHeight = 25;
    const barX = (width - barWidth) / 2;
    const barY = height * 0.88;
    const progress = Math.min(((Date.now() / 1000) - state.bossAppearTime) / state.bossTimeout, 1);
    drawWarningBar(ctx, barX, barY, barWidth, barHeight, progress);
  }
}

function drawGameOverPage(ctx, width, height, state, button) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#2c3e50');
  gradient.addColorStop(1, '#3498db');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('游戏结束', width / 2, height * 0.12);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  roundRect(ctx, width * 0.1, height * 0.18, width * 0.8, height * 0.45, 15);
  ctx.fill();

  const title = getTitle(state.score);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(`🏆 ${title}`, width / 2, height * 0.25);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(formatScore(state.score), width / 2, height * 0.35);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '18px Arial';
  ctx.fillText('分', width / 2 + 50, height * 0.35);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.42);
  ctx.lineTo(width * 0.8, height * 0.42);
  ctx.stroke();

  const stats = [
    { label: '坚持时长', value: `${state.totalTime}秒`, icon: '⏱' },
    { label: '躲避次数', value: `${state.dodgeCount}次`, icon: '🛡' },
    { label: '最高连击', value: `${state.combo}x`, icon: '🔥' },
  ];
  stats.forEach((stat, index) => {
    const y = height * 0.48 + index * 45;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${stat.icon} ${stat.label}`, width * 0.2, y);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(stat.value, width * 0.8, y);
  });

  const comment = getComment(state.score);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(comment, width / 2, height * 0.7);

  drawButton(ctx, button, '再来一局', '#2ecc71', '#27ae60');

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '14px Arial';
  ctx.fillText('分享给同事，看看谁更能摸鱼！', width / 2, height * 0.88);
}

function getComment(score) {
  if (score < 100) return '加油！下次争取多摸一会儿~';
  if (score < 300) return '不错！已经有点摸鱼的感觉了！';
  if (score < 500) return '厉害！你是摸鱼界的新星！';
  if (score < 800) return '太强了！老板都拿你没办法！';
  return '绝世高手！你是摸鱼界的传说！';
}

function drawButton(ctx, rect, text, color, hoverColor) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  roundRect(ctx, rect.x + 3, rect.y + 3, rect.width, rect.height, rect.height / 2);
  ctx.fill();

  const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, hoverColor);
  ctx.fillStyle = gradient;
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, rect.height / 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, rect.height / 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  roundRect(ctx, rect.x + 5, rect.y + 5, rect.width - 10, rect.height / 3, rect.height / 4);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);
}

function drawWarningBar(ctx, x, y, width, height, progress) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  roundRect(ctx, x, y, width, height, height / 2);
  ctx.fill();

  const barWidth = width * progress;
  if (barWidth > 0) {
    const gradient = ctx.createLinearGradient(x, y, x + barWidth, y);
    if (progress < 0.5) {
      gradient.addColorStop(0, '#2ecc71');
      gradient.addColorStop(1, '#27ae60');
    } else if (progress < 0.8) {
      gradient.addColorStop(0, '#f1c40f');
      gradient.addColorStop(1, '#f39c12');
    } else {
      gradient.addColorStop(0, '#e74c3c');
      gradient.addColorStop(1, '#c0392b');
    }
    ctx.fillStyle = gradient;
    roundRect(ctx, x, y, barWidth, height, height / 2);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, width, height, height / 2);
  ctx.stroke();

  const remaining = Math.max((1 - progress) * 1.2, 0);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${height - 8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${remaining.toFixed(1)}s`, x + width / 2, y + height / 2);
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ============ 游戏主类 ============
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = createGameState();
    this.player = createPlayer();
    this.boss = createBoss();
    this.startButton = { x: 0, y: 0, width: 0, height: 0 };
    this.disguiseButton = { x: 0, y: 0, width: 0, height: 0 };
    this.restartButton = { x: 0, y: 0, width: 0, height: 0 };
    this.particles = [];
    this.lastTime = 0;
    this.animationId = null;

    this.resize();
    this.bindEvents();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);

    this.width = width;
    this.height = height;
    this.updateButtonPositions();
  }

  updateButtonPositions() {
    const buttonWidth = this.width * 0.6;
    const buttonHeight = 55;
    const buttonX = (this.width - buttonWidth) / 2;

    this.startButton = { x: buttonX, y: this.height * 0.65, width: buttonWidth, height: buttonHeight };
    this.disguiseButton = { x: buttonX, y: this.height * 0.78, width: buttonWidth, height: buttonHeight };
    this.restartButton = { x: buttonX, y: this.height * 0.78, width: buttonWidth, height: buttonHeight };
  }

  bindEvents() {
    const handleTouch = (e) => {
      e.preventDefault();
      const touch = e.touches ? e.touches[0] : e;
      const x = touch.clientX;
      const y = touch.clientY;

      switch (this.state.status) {
        case GameStatus.MENU:
          if (isPointInRect(x, y, this.startButton)) this.startGame();
          break;
        case GameStatus.PLAYING:
          if (isPointInRect(x, y, this.disguiseButton)) this.handleDisguiseAction();
          break;
        case GameStatus.GAME_OVER:
          if (isPointInRect(x, y, this.restartButton)) this.restartGame();
          break;
      }
    };

    this.canvas.addEventListener('touchstart', handleTouch, { passive: false });
    this.canvas.addEventListener('mousedown', handleTouch);

    window.addEventListener('resize', () => this.resize());
  }

  startGame() {
    resetGameState(this.state);
    this.boss = createBoss();
    this.particles = [];
    this.state.nextBossTime = randomFloat(4, 6);
    this.startGameLoop();
  }

  restartGame() {
    this.startGame();
  }

  handleDisguiseAction() {
    if (this.state.bossVisible) {
      const success = handleDisguise(this.state, this.boss);
      if (success) {
        triggerDisguise(this.player);
        setExpression(this.player, 'relieved');
        this.spawnParticles('success');
      }
    }
  }

  startGameLoop() {
    this.lastTime = Date.now();
    this.gameLoop();
  }

  gameLoop() {
    const now = Date.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  update(deltaTime) {
    if (this.state.status !== GameStatus.PLAYING) return;

    updateGameTime(this.state, deltaTime);
    updateScore(this.state, deltaTime);
    updateMessage(this.state, deltaTime);
    updateShake(this.state, deltaTime);
    updatePlayer(this.player, deltaTime);
    updateBoss(this.state, this.boss, deltaTime);

    if (shouldBossAppear(this.state, this.boss)) {
      makeBossAppear(this.state, this.boss, this.width, this.height);
      setExpression(this.player, 'nervous');
    }

    this.updateParticles(deltaTime);

    if (this.state.status === GameStatus.GAME_OVER) {
      updateStats(this.player, this.state.score, this.state.combo);
      this.spawnParticles('gameOver');
    }
  }

  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.alpha -= deltaTime * 2;
      p.size -= deltaTime * 10;
      if (p.alpha <= 0 || p.size <= 0) this.particles.splice(i, 1);
    }
  }

  spawnParticles(type) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = randomFloat(100, 300);
      this.particles.push({
        x: centerX, y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: randomFloat(3, 8),
        alpha: 1,
        color: type === 'success' ? '#2ecc71' : '#e74c3c',
      });
    }
  }

  render() {
    const ctx = this.ctx;
    const shakeOffset = getShakeOffset(this.state);

    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);
    ctx.clearRect(-10, -10, this.width + 20, this.height + 20);

    switch (this.state.status) {
      case GameStatus.MENU:
        drawMenuPage(ctx, this.width, this.height, this.startButton);
        break;
      case GameStatus.PLAYING:
        this.renderGame();
        break;
      case GameStatus.GAME_OVER:
        drawGameOverPage(ctx, this.width, this.height, this.state, this.restartButton);
        this.renderParticles();
        break;
    }

    ctx.restore();
  }

  renderGame() {
    const ctx = this.ctx;
    drawOfficeBackground(ctx, this.width, this.height);

    const playerX = this.width * 0.45;
    const playerY = this.height * 0.35;
    const playerSize = 60;

    if (this.state.playerStatus === PlayerStatus.WORKING) {
      drawPlayerWorking(ctx, playerX, playerY, playerSize);
    } else {
      drawPlayerIdle(ctx, playerX, playerY, playerSize);
    }

    if (this.state.bossVisible) {
      const appearProgress = getAppearProgress(this.boss);
      const scale = easeOutQuad(appearProgress);
      ctx.save();
      ctx.translate(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-this.boss.width / 2, -this.boss.height / 2);
      drawBoss(ctx, 0, 0, this.boss.width, this.boss.expression);
      ctx.restore();
    }

    drawGameUI(ctx, this.width, this.height, this.state, this.disguiseButton);
    this.renderParticles();
  }

  renderParticles() {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// ============ 初始化 ============
function initGame() {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  game.startGameLoop();
  return game;
}

// 启动游戏
const game = initGame();
