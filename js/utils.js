/**
 * utils.js - 工具函数模块 v2.0
 * 专业级色彩系统、绘制工具、缓动函数、本地存储适配
 * 
 * 设计语言：现代扁平化 + 微质感，参考 Airbnb/Linear 的设计系统
 */

// ============================================================
//  全局色彩系统 - 专业级设计 Token
// ============================================================
export const COLORS = {
  // ---- 品牌色 ----
  primary: '#E8453C',
  primaryLight: '#FF7B73',
  primaryDark: '#C53028',
  primaryGlow: 'rgba(232,69,60,0.35)',

  // ---- 语义色 ----
  success: '#30D684',
  successDark: '#22B56E',
  successGlow: 'rgba(48,214,132,0.3)',
  warning: '#FFB627',
  warningDark: '#E5A020',
  warningGlow: 'rgba(255,182,39,0.3)',
  danger: '#E8453C',
  dangerDark: '#C53028',
  dangerGlow: 'rgba(232,69,60,0.3)',
  info: '#4DA3FF',
  infoDark: '#3580D4',

  // ---- 办公室场景 ----
  wallBase: '#F0EBE3',
  wallPattern: '#E8E2D8',
  wallAccent: '#DDD5C8',
  floorBase: '#9B8B74',
  floorDark: '#7A6C58',
  floorPlank: 'rgba(0,0,0,0.06)',
  baseboard: '#C8B89E',

  // ---- 木纹 ----
  deskTop: '#C9A87C',
  deskTopLight: '#D4B78E',
  deskEdge: '#A88B64',
  deskLeg: '#8B7355',
  deskHighlight: 'rgba(255,255,255,0.12)',

  // ---- 天空 ----
  skyTop: '#7EC8E3',
  skyMid: '#A8DDF0',
  skyBottom: '#D4EEF7',
  cloud: 'rgba(255,255,255,0.85)',

  // ---- 文字 ----
  textPrimary: '#1A1D23',
  textSecondary: '#5F6B7A',
  textTertiary: '#8E99A8',
  textOnDark: '#F8F9FA',
  textOnDarkMuted: 'rgba(248,249,250,0.65)',

  // ---- UI 表面 ----
  surfaceLight: 'rgba(255,255,255,0.95)',
  surfaceGlass: 'rgba(255,255,255,0.08)',
  surfaceGlassBorder: 'rgba(255,255,255,0.12)',
  surfaceDark: 'rgba(26,29,35,0.88)',
  surfaceDarkBorder: 'rgba(255,255,255,0.08)',

  // ---- 毛玻璃 ----
  glass: 'rgba(26,29,35,0.45)',
  glassBorder: 'rgba(255,255,255,0.15)',
  glassHighlight: 'rgba(255,255,255,0.06)',

  // ---- 分数 ----
  scoreGold: '#FFD700',
  scoreGoldGlow: 'rgba(255,215,0,0.35)',

  // ---- 怀疑值 ----
  suspicionLow: '#30D684',
  suspicionMid: '#FFB627',
  suspicionHigh: '#E8453C',

  // ---- 道具色 ----
  itemCoffee: '#8B6340',
  itemCoffeeGlow: 'rgba(139,99,64,0.4)',
  itemHeadphone: '#4DA3FF',
  itemHeadphoneGlow: 'rgba(77,163,255,0.4)',
  itemColleague: '#30D684',
  itemColleagueGlow: 'rgba(48,214,132,0.4)',

  // ---- 菜单页 ----
  menuGradTop: '#FFB347',
  menuGradMid: '#FF8C42',
  menuGradBottom: '#E8453C',

  // ---- 结算页 ----
  overGradTop: '#2C3040',
  overGradMid: '#1E2230',
  overGradBottom: '#14171E',

  // ---- 角色 ----
  playerSkin: '#FFD5B8',
  playerSkinShadow: '#E8B898',
  playerHair: '#3D2B1F',
  playerShirt: '#5B9BD5',
  playerShirtDark: '#4A85B8',
  playerPants: '#3D4555',
  bossSkin: '#F0C8A0',
  bossSkinShadow: '#D4A878',
  bossHair: '#1A1A2E',
  bossSuit: '#2C3E50',
  bossSuitDark: '#1E2D3D',
  bossTie: '#C0392B',

  // ---- 粒子 ----
  particleSuccess: '#30D684',
  particleDanger: '#E8453C',
  particleGold: '#FFD700',
  particleStar: '#FFE066',
  particleCombo: '#FF6B9D',

  // ---- 按钮主题 ----
  btnPrimary: ['#FF7B73', '#E8453C'],
  btnSuccess: ['#4AE88E', '#30D684'],
  btnWarning: ['#FFD166', '#FFB627'],
  btnDisabled: ['#6B7280', '#4B5563'],
  btnDanger: ['#FF7B73', '#C53028'],
  btnInfo: ['#6BB8FF', '#4DA3FF'],
};

// ============================================================
//  数学工具
// ============================================================

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * clamp((value - inMin) / (inMax - inMin), 0, 1);
}

/**
 * 检查点是否在矩形区域内
 */
export function isPointInRect(x, y, rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

/**
 * 检查点是否在圆形区域内
 */
export function isPointInCircle(px, py, cx, cy, r) {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}

// ============================================================
//  游戏逻辑工具
// ============================================================

/**
 * 格式化时间（倒计时显示）
 */
export function formatTime(seconds) {
  const s = Math.ceil(seconds);
  return s < 10 ? `0${s}s` : `${s}s`;
}

/**
 * 格式化大分数
 */
export function formatScore(score) {
  const s = Math.floor(score);
  if (s >= 10000) return `${(s / 1000).toFixed(1)}k`;
  return s.toString();
}

/**
 * 获取称号 - 更细化的分级
 */
export function getTitle(score) {
  if (score < 150) return '实习摸鱼员';
  if (score < 300) return '摸鱼新手';
  if (score < 500) return '职场老油条';
  if (score < 700) return '摸鱼达人';
  if (score < 900) return '办公室影帝';
  if (score < 1200) return '摸鱼宗师';
  return '摸鱼之王';
}

/**
 * 根据游戏时间获取老板出现间隔（秒）
 * 增加了更平滑的难度曲线
 */
export function getBossInterval(elapsedTime) {
  if (elapsedTime < 8) return [4.5, 6.5];
  if (elapsedTime < 15) return [3.5, 5];
  if (elapsedTime < 22) return [2.5, 4];
  return [1.8, 3];
}

/**
 * 根据游戏时间获取老板反应时间（秒）
 * 后期给玩家的反应时间更短
 */
export function getBossTimeout(elapsedTime) {
  if (elapsedTime < 10) return 1.3;
  if (elapsedTime < 20) return 1.15;
  return 1.0;
}

// ============================================================
//  缓动函数
// ============================================================

export function easeOutQuad(t) {
  return t * (2 - t);
}

export function easeInQuad(t) {
  return t * t;
}

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t) {
  return t * t * t;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutElastic(t) {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t - 1) * ((2 * Math.PI) / 0.3)) + 1;
}

export function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ============================================================
//  绘制工具函数
// ============================================================

/**
 * 绘制圆角矩形路径
 */
export function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

/**
 * 绘制带渐变的圆角矩形
 */
export function fillRoundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.closePath();
  ctx.fill();
}

/**
 * 绘制圆角矩形描边
 */
export function strokeRoundRect(ctx, x, y, w, h, r, color, lineWidth = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, r);
  ctx.closePath();
  ctx.stroke();
}

/**
 * 绘制阴影
 */
export function drawShadow(ctx, x, y, w, h, radius, offsetY, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRectPath(ctx, x, y + offsetY, w, h, radius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * 绘制高光效果
 */
export function drawHighlight(ctx, x, y, w, h, radius) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  roundRectPath(ctx, x + 4, y + 3, w - 8, h * 0.4, Math.min(radius - 2, h * 0.2));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * 绘制按钮 - 高品质版本
 */
export function drawRoundedButton(ctx, rect, text, colorTheme, opts = {}) {
  const { pulse = 0, fontSize = 22, textColor = '#fff', icon = '' } = opts;

  let colors;
  if (Array.isArray(colorTheme)) {
    colors = colorTheme;
  } else {
    const key = `btn${colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)}`;
    colors = COLORS[key] || [colorTheme, colorTheme];
  }

  const scale = 1 + pulse * 0.05;
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const r = rect.height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  // 外层阴影 - 柔和
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  roundRectPath(ctx, rect.x + 1, rect.y + 4, rect.width, rect.height, r);
  ctx.closePath();
  ctx.fill();

  // 内层阴影 - 紧贴
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  roundRectPath(ctx, rect.x, rect.y + 2, rect.width, rect.height, r);
  ctx.closePath();
  ctx.fill();

  // 主体渐变
  const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(1, colors[1]);
  ctx.fillStyle = grad;
  ctx.beginPath();
  roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, r);
  ctx.closePath();
  ctx.fill();

  // 顶部高光
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  roundRectPath(ctx, rect.x + 8, rect.y + 3, rect.width - 16, rect.height * 0.42, r * 0.6);
  ctx.closePath();
  ctx.fill();

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, r);
  ctx.closePath();
  ctx.stroke();

  // 脉冲光晕
  if (pulse > 0.1) {
    const glowAlpha = pulse * 0.25;
    ctx.strokeStyle = `rgba(255,255,255,${glowAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    roundRectPath(ctx, rect.x - 3, rect.y - 3, rect.width + 6, rect.height + 6, r + 3);
    ctx.closePath();
    ctx.stroke();
  }

  // 文字
  const displayText = icon ? `${icon}  ${text}` : text;
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 文字阴影
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillText(displayText, cx + 1, cy + 1);

  ctx.fillStyle = textColor;
  ctx.fillText(displayText, cx, cy);

  ctx.restore();
}

/**
 * 绘制 emoji
 */
export function drawEmoji(ctx, emoji, x, y, size) {
  ctx.save();
  ctx.font = `${size}px "PingFang SC", "Apple Color Emoji", "Segoe UI Emoji", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);
  ctx.restore();
}

/**
 * 绘制带描边的文字
 */
export function drawStrokedText(ctx, text, x, y, font, fillColor, strokeColor, strokeWidth) {
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

// ============================================================
//  本地存储适配（微信小游戏 + Web 回退）
// ============================================================

const STORAGE_PREFIX = 'bossComing_';

/**
 * 保存数据到本地
 */
export function saveData(key, value) {
  const fullKey = STORAGE_PREFIX + key;
  const data = JSON.stringify(value);
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync(fullKey, data);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(fullKey, data);
    }
  } catch (e) {
    console.warn('存储写入失败:', e);
  }
}

/**
 * 从本地读取数据
 */
export function loadData(key, defaultValue = null) {
  const fullKey = STORAGE_PREFIX + key;
  try {
    let raw = null;
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      raw = wx.getStorageSync(fullKey);
    } else if (typeof localStorage !== 'undefined') {
      raw = localStorage.getItem(fullKey);
    }
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('存储读取失败:', e);
  }
  return defaultValue;
}

// ============================================================
//  成就定义
// ============================================================

export const ACHIEVEMENTS = {
  FIRST_DODGE: { id: 'first_dodge', name: '初次逃脱', desc: '首次成功躲避老板', icon: '🛡️' },
  COMBO_5: { id: 'combo_5', name: '五连闪避', desc: '达成5连击', icon: '🔥' },
  COMBO_10: { id: 'combo_10', name: '完美表演', desc: '达成10连击', icon: '🌟' },
  CLOSE_CALL: { id: 'close_call', name: '惊魂一刻', desc: '触发一次极限闪避', icon: '😱' },
  SCORE_500: { id: 'score_500', name: '摸鱼达人', desc: '单局得分超过500', icon: '💪' },
  SCORE_1000: { id: 'score_1000', name: '摸鱼之王', desc: '单局得分超过1000', icon: '👑' },
  FULL_GAME: { id: 'full_game', name: '完美谢幕', desc: '成功坚持30秒', icon: '🎬' },
  ITEM_COLLECTOR: { id: 'item_collector', name: '道具收集者', desc: '单局使用3个道具', icon: '🎒' },
};

/**
 * 检查并解锁成就
 */
export function checkAchievements(stats, newAchievements) {
  const unlocked = [];

  if (stats.totalDodges >= 1 && !newAchievements.includes(ACHIEVEMENTS.FIRST_DODGE.id)) {
    unlocked.push(ACHIEVEMENTS.FIRST_DODGE.id);
  }
  if (stats.bestCombo >= 5 && !newAchievements.includes(ACHIEVEMENTS.COMBO_5.id)) {
    unlocked.push(ACHIEVEMENTS.COMBO_5.id);
  }
  if (stats.bestCombo >= 10 && !newAchievements.includes(ACHIEVEMENTS.COMBO_10.id)) {
    unlocked.push(ACHIEVEMENTS.COMBO_10.id);
  }
  if (stats.bestScore >= 500 && !newAchievements.includes(ACHIEVEMENTS.SCORE_500.id)) {
    unlocked.push(ACHIEVEMENTS.SCORE_500.id);
  }
  if (stats.bestScore >= 1000 && !newAchievements.includes(ACHIEVEMENTS.SCORE_1000.id)) {
    unlocked.push(ACHIEVEMENTS.SCORE_1000.id);
  }

  return unlocked;
}
