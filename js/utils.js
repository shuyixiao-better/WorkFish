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
  // ---- 品牌色（冷蓝色调） ----
  primary: '#4A90E2',
  primaryLight: '#6BA8F0',
  primaryDark: '#357ABD',
  primaryGlow: 'rgba(74,144,226,0.35)',

  // ---- 语义色 ----
  success: '#35C759',
  successDark: '#28A745',
  successGlow: 'rgba(53,199,89,0.3)',
  warning: '#FFB627',
  warningDark: '#E5A020',
  warningGlow: 'rgba(255,182,39,0.3)',
  danger: '#FF6B4A',
  dangerDark: '#FF4D3D',
  dangerGlow: 'rgba(255,107,74,0.3)',
  info: '#4A90E2',
  infoDark: '#357ABD',

  // ---- 办公室场景 ----
  wallBase: '#F4F8FB',
  wallPattern: '#EAF0F5',
  wallAccent: '#DEE6EE',
  floorBase: '#D8B98A',
  floorDark: '#C4A274',
  floorPlank: 'rgba(0,0,0,0.05)',
  baseboard: '#D0C0A8',

  // ---- 木纹 ----
  deskTop: '#B88A5A',
  deskTopLight: '#C99E6E',
  deskEdge: '#A07848',
  deskLeg: '#8B7355',
  deskHighlight: 'rgba(255,255,255,0.12)',

  // ---- 天空 ----
  skyTop: '#7EC8E3',
  skyMid: '#A8DDF0',
  skyBottom: '#D4EEF7',
  cloud: 'rgba(255,255,255,0.85)',

  // ---- 文字 ----
  textPrimary: '#263238',
  textSecondary: '#607D8B',
  textTertiary: '#90A4AE',
  textOnDark: '#F8F9FA',
  textOnDarkMuted: 'rgba(248,249,250,0.65)',

  // ---- UI 表面 ----
  surfaceLight: 'rgba(255,255,255,0.95)',
  surfaceGlass: 'rgba(255,255,255,0.08)',
  surfaceGlassBorder: 'rgba(255,255,255,0.12)',
  surfaceDark: 'rgba(38,50,56,0.88)',
  surfaceDarkBorder: 'rgba(224,231,239,0.8)',

  // ---- 毛玻璃（半透明白色卡片） ----
  glass: 'rgba(255,255,255,0.92)',
  glassBorder: 'rgba(224,231,239,0.8)',
  glassHighlight: 'rgba(255,255,255,0.5)',
  glassShadow: 'rgba(38,50,56,0.10)',

  // ---- 分数 ----
  scoreGold: '#FFB340',
  scoreGoldGlow: 'rgba(255,179,64,0.35)',

  // ---- 怀疑值 ----
  suspicionLow: '#35C759',
  suspicionMid: '#FFB627',
  suspicionHigh: '#FF6B4A',

  // ---- 道具色 ----
  itemCoffee: '#8B6340',
  itemCoffeeGlow: 'rgba(139,99,64,0.4)',
  itemHeadphone: '#4A90E2',
  itemHeadphoneGlow: 'rgba(74,144,226,0.4)',
  itemColleague: '#35C759',
  itemColleagueGlow: 'rgba(53,199,89,0.4)',

  // ---- 菜单页 ----
  menuGradTop: '#DDF2FF',
  menuGradMid: '#EAF6FF',
  menuGradBottom: '#F8FCFF',

  // ---- 结算页（浅色卡片风格） ----
  overGradTop: '#EEF4F9',
  overGradMid: '#F6FAFB',
  overGradBottom: '#FFFFFF',

  // ---- 角色 ----
  playerSkin: '#FFD5B8',
  playerSkinShadow: '#E8B898',
  playerHair: '#3D2B1F',
  playerShirt: '#4A90E2',
  playerShirtDark: '#357ABD',
  playerPants: '#3D4555',
  bossSkin: '#F0C8A0',
  bossSkinShadow: '#D4A878',
  bossHair: '#1A1A2E',
  bossSuit: '#2C3E50',
  bossSuitDark: '#1E2D3D',
  bossTie: '#FF6B4A',

  // ---- 粒子 ----
  particleSuccess: '#35C759',
  particleDanger: '#FF6B4A',
  particleGold: '#FFB340',
  particleStar: '#FFE066',
  particleCombo: '#FF6B9D',

  // ---- 按钮主题（渐变） ----
  btnPrimary: ['#5BA0F0', '#4A90E2'],
  btnSuccess: ['#4CD964', '#35C759'],
  btnWarning: ['#FFD166', '#FFB627'],
  btnDisabled: ['#B0BEC5', '#90A4AE'],
  btnDanger: ['#FF7A59', '#FF4D3D'],
  btnInfo: ['#6BB8FF', '#4A90E2'],

  // ---- 卡片/分割 ----
  cardWhite: '#FFFFFF',
  divider: '#E0E7EF',

  // ---- 状态色 ----
  statusIdle: '#35C759',
  statusWorking: '#4A90E2',
  statusBoss: '#FF6B4A',
};

// ============================================================
//  移动端 H5 兼容字体链
//  按优先级：系统 emoji → iOS → Android → Windows → 通用回退
// ============================================================
export const FONT = {
  // 中文字体链（覆盖 iOS / Android / Windows）
  cn: '"PingFang SC", "Noto Sans SC", "Source Han Sans CN", "Microsoft YaHei", "WenQuanYi Micro Hei", "Helvetica Neue", Arial, sans-serif',
  // 等宽字体（代码显示）
  mono: '"SF Mono", "Menlo", "Consolas", "Noto Sans Mono", "Courier New", monospace',
  // Emoji 字体链（仅用于 drawEmoji 回退）
  emoji: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "EmojiOne", sans-serif',
};

/**
 * 生成指定大小的字体字符串
 * @param {number} size - 字号 px
 * @param {boolean} bold - 是否粗体
 * @param {string} family - 'cn' | 'mono' | 'emoji'
 */
export function font(size, bold = false, family = 'cn') {
  const weight = bold ? 'bold ' : '';
  return `${weight}${size}px ${FONT[family] || FONT.cn}`;
}

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
  if (score < 200) return '实习摸鱼员';
  if (score < 500) return '职场老油条';
  if (score < 800) return '摸鱼达人';
  return '办公室影帝';
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
 * 绘制阴影卡片 — 白色卡片 + 柔和阴影 + 微边框
 */
export function drawShadowCard(ctx, x, y, w, h, radius, opts = {}) {
  const { shadowColor = COLORS.glassShadow, shadowBlur = 12, shadowOffsetY = 4,
          fillColor = COLORS.cardWhite, borderColor = COLORS.divider, borderWidth = 1 } = opts;

  ctx.save();
  // 阴影层
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadowOffsetY;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 边框
  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.closePath();
    ctx.stroke();
  }
}

/**
 * 绘制渐变按钮（三层：阴影 → 渐变体 → 高光条）
 * 比 drawRoundedButton 更精简的现代风格
 */
export function drawGradientButton(ctx, rect, text, colors, opts = {}) {
  const { fontSize = 20, textColor = '#FFFFFF', radius, pulse = 0 } = opts;
  const r = radius || rect.height / 2;
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const scale = 1 + pulse * 0.04;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  // 阴影
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // 渐变体
  const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(1, colors[1]);
  ctx.fillStyle = grad;
  ctx.beginPath();
  roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, r);
  ctx.closePath();
  ctx.fill();

  // 清除阴影后画高光
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  ctx.beginPath();
  roundRectPath(ctx, rect.x + 6, rect.y + 2, rect.width - 12, rect.height * 0.42, r * 0.5);
  ctx.closePath();
  ctx.fill();

  // 文字
  ctx.fillStyle = textColor;
  ctx.font = font(fontSize, true);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);

  ctx.restore();
}

/**
 * 绘制徽章/标签
 */
export function drawBadge(ctx, x, y, text, bgColor, textColor, opts = {}) {
  const { fontSize = 11, padX = 8, padY = 3, radius = 6 } = opts;
  ctx.font = font(fontSize, true);
  const tw = ctx.measureText(text).width;
  const w = tw + padX * 2;
  const h = fontSize + padY * 2;

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  roundRectPath(ctx, x - w / 2, y - h / 2, w, h, radius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

/**
 * 绘制进度条
 */
export function drawProgressBar(ctx, x, y, w, h, progress, color, bgColor) {
  // 背景
  ctx.fillStyle = bgColor || 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.closePath();
  ctx.fill();

  // 进度
  const fillW = Math.max(w * Math.min(progress, 1), 0);
  if (fillW > 0) {
    const grad = ctx.createLinearGradient(x, y, x + fillW, y);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    roundRectPath(ctx, x, y, fillW, h, h / 2);
    ctx.closePath();
    ctx.fill();
  }
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
  ctx.font = font(fontSize, true);
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
 * 绘制 emoji（回退到 fillText，用于装饰性大 emoji）
 * 移动端 H5 Canvas 中 emoji 渲染不可靠，尽量用 drawIcon 替代
 */
export function drawEmoji(ctx, emoji, x, y, size) {
  ctx.save();
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);
  ctx.restore();
}

// ============================================================
//  矢量图标系统 — 替代 emoji fillText，解决移动端 H5 emoji 渲染问题
// ============================================================

/**
 * 绘制矢量图标（替代 emoji 字符）
 * 在 Canvas 2D 中直接画形状，保证跨平台一致性
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} iconId — 图标标识符
 * @param {number} x — 中心 x
 * @param {number} y — 中心 y
 * @param {number} size — 图标尺寸（约等于 emoji 字号）
 */
export function drawIcon(ctx, iconId, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 24; // 以 24px 为基准缩放

  switch (iconId) {
    case 'timer':
    case 'clock':
      _drawIconTimer(ctx, s);
      break;
    case 'star':
      _drawIconStar(ctx, s);
      break;
    case 'shield':
      _drawIconShield(ctx, s);
      break;
    case 'fire':
      _drawIconFire(ctx, s);
      break;
    case 'sparkles':
      _drawIconSparkles(ctx, s);
      break;
    case 'trophy':
      _drawIconTrophy(ctx, s);
      break;
    case 'backpack':
      _drawIconBackpack(ctx, s);
      break;
    case 'headphones':
      _drawIconHeadphones(ctx, s);
      break;
    case 'crown':
      _drawIconCrown(ctx, s);
      break;
    case 'clap':
      _drawIconClap(ctx, s);
      break;
    case 'muscle':
      _drawIconMuscle(ctx, s);
      break;
    case 'scream':
      _drawIconScream(ctx, s);
      break;
    case 'movie':
      _drawIconMovie(ctx, s);
      break;
    case 'laptop':
      _drawIconLaptop(ctx, s);
      break;
    case 'phone':
      _drawIconPhone(ctx, s);
      break;
    case 'coffee':
      _drawIconCoffee(ctx, s);
      break;
    case 'briefcase':
      _drawIconBriefcase(ctx, s);
      break;
    case 'paper':
      _drawIconPaper(ctx, s);
      break;
    case 'handshake':
      _drawIconHandshake(ctx, s);
      break;
    default:
      // 未知图标 — 画一个圆点占位
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
  }

  ctx.restore();
}

// ---- 内部图标绘制函数 ----

function _drawIconTimer(ctx, s) {
  // 秒表/计时器图标
  ctx.strokeStyle = '#B0BEC5';
  ctx.lineWidth = 2 * s;
  ctx.lineCap = 'round';
  // 圆
  ctx.beginPath();
  ctx.arc(0, 1 * s, 9 * s, 0, Math.PI * 2);
  ctx.stroke();
  // 顶部按钮
  ctx.beginPath();
  ctx.moveTo(0, -8 * s);
  ctx.lineTo(0, -10 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-3 * s, -10 * s);
  ctx.lineTo(3 * s, -10 * s);
  ctx.stroke();
  // 指针
  ctx.strokeStyle = '#FF6B4A';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(0, 1 * s);
  ctx.lineTo(0, -4 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 1 * s);
  ctx.lineTo(4 * s, 3 * s);
  ctx.stroke();
  // 中心点
  ctx.fillStyle = '#FF6B4A';
  ctx.beginPath();
  ctx.arc(0, 1 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
}

function _drawIconStar(ctx, s) {
  // 五角星
  const spikes = 5;
  const outerR = 10 * s;
  const innerR = 4 * s;
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  // 高光
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.arc(-2 * s, -3 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();
}

function _drawIconShield(ctx, s) {
  // 盾牌
  ctx.fillStyle = '#35C759';
  ctx.beginPath();
  ctx.moveTo(0, -10 * s);
  ctx.quadraticCurveTo(10 * s, -8 * s, 10 * s, -2 * s);
  ctx.quadraticCurveTo(10 * s, 6 * s, 0, 11 * s);
  ctx.quadraticCurveTo(-10 * s, 6 * s, -10 * s, -2 * s);
  ctx.quadraticCurveTo(-10 * s, -8 * s, 0, -10 * s);
  ctx.closePath();
  ctx.fill();
  // 对勾
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-4 * s, 0);
  ctx.lineTo(-1 * s, 3.5 * s);
  ctx.lineTo(5 * s, -3 * s);
  ctx.stroke();
}

function _drawIconFire(ctx, s) {
  // 火焰
  ctx.fillStyle = '#FF6B35';
  ctx.beginPath();
  ctx.moveTo(0, -10 * s);
  ctx.quadraticCurveTo(6 * s, -6 * s, 7 * s, 0);
  ctx.quadraticCurveTo(8 * s, 6 * s, 3 * s, 9 * s);
  ctx.quadraticCurveTo(1 * s, 10 * s, 0, 8 * s);
  ctx.quadraticCurveTo(-1 * s, 10 * s, -3 * s, 9 * s);
  ctx.quadraticCurveTo(-8 * s, 6 * s, -7 * s, 0);
  ctx.quadraticCurveTo(-6 * s, -6 * s, 0, -10 * s);
  ctx.closePath();
  ctx.fill();
  // 内焰
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(0, -3 * s);
  ctx.quadraticCurveTo(3 * s, -1 * s, 3 * s, 3 * s);
  ctx.quadraticCurveTo(2 * s, 6 * s, 0, 6 * s);
  ctx.quadraticCurveTo(-2 * s, 6 * s, -3 * s, 3 * s);
  ctx.quadraticCurveTo(-3 * s, -1 * s, 0, -3 * s);
  ctx.closePath();
  ctx.fill();
}

function _drawIconSparkles(ctx, s) {
  // 闪光星星 ✨
  ctx.fillStyle = '#FFD700';
  // 大四角星
  _drawFourPointStar(ctx, 0, 0, 8 * s, 3 * s);
  // 小四角星
  ctx.fillStyle = '#FFE44D';
  _drawFourPointStar(ctx, -7 * s, -5 * s, 4 * s, 1.5 * s);
  _drawFourPointStar(ctx, 6 * s, 5 * s, 3.5 * s, 1.2 * s);
}

function _drawFourPointStar(ctx, cx, cy, outerR, innerR) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / 4;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function _drawIconTrophy(ctx, s) {
  // 奖杯
  ctx.fillStyle = '#FFD700';
  // 杯身
  ctx.beginPath();
  ctx.moveTo(-7 * s, -8 * s);
  ctx.lineTo(7 * s, -8 * s);
  ctx.lineTo(5 * s, 2 * s);
  ctx.lineTo(-5 * s, 2 * s);
  ctx.closePath();
  ctx.fill();
  // 把手
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(-8 * s, -3 * s, 4 * s, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(8 * s, -3 * s, 4 * s, Math.PI * 0.5, -Math.PI * 0.5);
  ctx.stroke();
  // 底座
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(-4 * s, 2 * s, 8 * s, 3 * s);
  ctx.fillRect(-6 * s, 5 * s, 12 * s, 3 * s);
  // 高光
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(-5 * s, -7 * s, 3 * s, 8 * s);
}

function _drawIconBackpack(ctx, s) {
  // 背包
  ctx.fillStyle = '#5C6BC0';
  // 主体
  ctx.beginPath();
  ctx.moveTo(-7 * s, -4 * s);
  ctx.quadraticCurveTo(-7 * s, -8 * s, 0, -8 * s);
  ctx.quadraticCurveTo(7 * s, -8 * s, 7 * s, -4 * s);
  ctx.lineTo(7 * s, 8 * s);
  ctx.quadraticCurveTo(7 * s, 10 * s, 5 * s, 10 * s);
  ctx.lineTo(-5 * s, 10 * s);
  ctx.quadraticCurveTo(-7 * s, 10 * s, -7 * s, 8 * s);
  ctx.closePath();
  ctx.fill();
  // 前袋
  ctx.fillStyle = '#7986CB';
  ctx.beginPath();
  ctx.moveTo(-5 * s, 2 * s);
  ctx.lineTo(5 * s, 2 * s);
  ctx.lineTo(5 * s, 7 * s);
  ctx.quadraticCurveTo(5 * s, 9 * s, 3 * s, 9 * s);
  ctx.lineTo(-3 * s, 9 * s);
  ctx.quadraticCurveTo(-5 * s, 9 * s, -5 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  // 扣
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-2 * s, 1 * s, 4 * s, 2.5 * s);
}

function _drawIconHeadphones(ctx, s) {
  // 耳机
  ctx.strokeStyle = '#4A90E2';
  ctx.lineWidth = 3 * s;
  ctx.lineCap = 'round';
  // 头带
  ctx.beginPath();
  ctx.arc(0, -1 * s, 9 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  // 左耳罩
  ctx.fillStyle = '#4A90E2';
  ctx.beginPath();
  ctx.ellipse(-8.5 * s, 3 * s, 3.5 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // 右耳罩
  ctx.beginPath();
  ctx.ellipse(8.5 * s, 3 * s, 3.5 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // 耳罩内
  ctx.fillStyle = '#357ABD';
  ctx.beginPath();
  ctx.ellipse(-8.5 * s, 3 * s, 2 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(8.5 * s, 3 * s, 2 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function _drawIconCrown(ctx, s) {
  // 皇冠
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(-10 * s, 4 * s);
  ctx.lineTo(-8 * s, -6 * s);
  ctx.lineTo(-3 * s, 0);
  ctx.lineTo(0, -8 * s);
  ctx.lineTo(3 * s, 0);
  ctx.lineTo(8 * s, -6 * s);
  ctx.lineTo(10 * s, 4 * s);
  ctx.closePath();
  ctx.fill();
  // 底座
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(-9 * s, 4 * s, 18 * s, 3.5 * s);
  // 宝石
  ctx.fillStyle = '#FF6B4A';
  ctx.beginPath();
  ctx.arc(0, -4 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4A90E2';
  ctx.beginPath();
  ctx.arc(-6 * s, -2 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6 * s, -2 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
}

function _drawIconClap(ctx, s) {
  // 拍手
  ctx.fillStyle = '#FFD5B8';
  // 左手
  ctx.save();
  ctx.rotate(-0.3);
  ctx.beginPath();
  ctx.ellipse(-3 * s, 0, 5 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // 右手
  ctx.save();
  ctx.rotate(0.3);
  ctx.beginPath();
  ctx.ellipse(3 * s, 0, 5 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // 闪光线
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath(); ctx.moveTo(-2 * s, -9 * s); ctx.lineTo(-4 * s, -12 * s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(2 * s, -9 * s); ctx.lineTo(4 * s, -12 * s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -10 * s); ctx.lineTo(0, -13 * s); ctx.stroke();
}

function _drawIconMuscle(ctx, s) {
  // 肌肉手臂
  ctx.fillStyle = '#FFD5B8';
  ctx.beginPath();
  ctx.moveTo(-2 * s, 9 * s);
  ctx.lineTo(-4 * s, 2 * s);
  ctx.quadraticCurveTo(-8 * s, -2 * s, -6 * s, -6 * s);
  ctx.quadraticCurveTo(-4 * s, -10 * s, 0, -8 * s);
  ctx.quadraticCurveTo(4 * s, -10 * s, 6 * s, -6 * s);
  ctx.quadraticCurveTo(8 * s, -2 * s, 4 * s, 2 * s);
  ctx.lineTo(2 * s, 9 * s);
  ctx.closePath();
  ctx.fill();
  // 肌肉线条
  ctx.strokeStyle = '#E8B090';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.arc(-3 * s, -3 * s, 4 * s, -0.5, 1.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(3 * s, -3 * s, 4 * s, 1.9, 3.6);
  ctx.stroke();
}

function _drawIconScream(ctx, s) {
  // 惊叫脸
  ctx.fillStyle = '#FFE066';
  ctx.beginPath();
  ctx.arc(0, 0, 10 * s, 0, Math.PI * 2);
  ctx.fill();
  // 眼睛 - 瞪大
  ctx.fillStyle = '#1A1D23';
  ctx.beginPath();
  ctx.ellipse(-3.5 * s, -2 * s, 2 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3.5 * s, -2 * s, 2 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // 嘴 - O 型
  ctx.fillStyle = '#1A1D23';
  ctx.beginPath();
  ctx.ellipse(0, 4 * s, 3.5 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF6B4A';
  ctx.beginPath();
  ctx.ellipse(0, 5 * s, 2.5 * s, 2.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function _drawIconMovie(ctx, s) {
  // 电影板
  ctx.fillStyle = '#37474F';
  ctx.fillRect(-9 * s, -6 * s, 18 * s, 14 * s);
  // 条纹
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect((-8 + i * 4) * s, -6 * s, 2 * s, 4 * s);
  }
  // 底部
  ctx.fillStyle = '#263238';
  ctx.fillRect(-9 * s, -2 * s, 18 * s, 2 * s);
}

function _drawIconLaptop(ctx, s) {
  // 笔记本电脑
  ctx.fillStyle = '#546E7A';
  ctx.fillRect(-9 * s, -6 * s, 18 * s, 11 * s);
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(-7 * s, -4 * s, 14 * s, 7 * s);
  // 底座
  ctx.fillStyle = '#78909C';
  ctx.beginPath();
  ctx.moveTo(-11 * s, 5 * s);
  ctx.lineTo(11 * s, 5 * s);
  ctx.lineTo(10 * s, 8 * s);
  ctx.lineTo(-10 * s, 8 * s);
  ctx.closePath();
  ctx.fill();
}

function _drawIconPhone(ctx, s) {
  // 手机
  ctx.fillStyle = '#37474F';
  ctx.beginPath();
  ctx.moveTo(-5 * s, -10 * s);
  ctx.lineTo(5 * s, -10 * s);
  ctx.quadraticCurveTo(7 * s, -10 * s, 7 * s, -8 * s);
  ctx.lineTo(7 * s, 8 * s);
  ctx.quadraticCurveTo(7 * s, 10 * s, 5 * s, 10 * s);
  ctx.lineTo(-5 * s, 10 * s);
  ctx.quadraticCurveTo(-7 * s, 10 * s, -7 * s, 8 * s);
  ctx.lineTo(-7 * s, -8 * s);
  ctx.quadraticCurveTo(-7 * s, -10 * s, -5 * s, -10 * s);
  ctx.closePath();
  ctx.fill();
  // 屏幕
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(-5 * s, -7 * s, 10 * s, 13 * s);
  // Home 键
  ctx.fillStyle = '#546E7A';
  ctx.beginPath();
  ctx.arc(0, 8 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
}

function _drawIconCoffee(ctx, s) {
  // 咖啡杯
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 1 * s;
  ctx.beginPath();
  ctx.moveTo(-6 * s, -4 * s);
  ctx.lineTo(6 * s, -4 * s);
  ctx.lineTo(5 * s, 7 * s);
  ctx.quadraticCurveTo(5 * s, 9 * s, 3 * s, 9 * s);
  ctx.lineTo(-3 * s, 9 * s);
  ctx.quadraticCurveTo(-5 * s, 9 * s, -5 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 咖啡液
  ctx.fillStyle = '#5C3A1E';
  ctx.beginPath();
  ctx.ellipse(0, -2 * s, 5 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // 把手
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(7 * s, 1 * s, 3.5 * s, -0.5, 1.5);
  ctx.stroke();
  // 蒸汽
  ctx.strokeStyle = 'rgba(180,185,195,0.5)';
  ctx.lineWidth = 1.2 * s;
  ctx.beginPath();
  ctx.moveTo(-2 * s, -6 * s);
  ctx.quadraticCurveTo(-1 * s, -9 * s, -2 * s, -11 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2 * s, -6 * s);
  ctx.quadraticCurveTo(3 * s, -8 * s, 2 * s, -10 * s);
  ctx.stroke();
}

function _drawIconBriefcase(ctx, s) {
  // 公文包
  ctx.fillStyle = '#5C3A1E';
  ctx.beginPath();
  ctx.moveTo(-9 * s, -3 * s);
  ctx.lineTo(9 * s, -3 * s);
  ctx.quadraticCurveTo(10 * s, -3 * s, 10 * s, -1 * s);
  ctx.lineTo(10 * s, 7 * s);
  ctx.quadraticCurveTo(10 * s, 9 * s, 8 * s, 9 * s);
  ctx.lineTo(-8 * s, 9 * s);
  ctx.quadraticCurveTo(-10 * s, 9 * s, -10 * s, 7 * s);
  ctx.lineTo(-10 * s, -1 * s);
  ctx.quadraticCurveTo(-10 * s, -3 * s, -9 * s, -3 * s);
  ctx.closePath();
  ctx.fill();
  // 把手
  ctx.strokeStyle = '#5C3A1E';
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.arc(0, -5 * s, 4 * s, Math.PI, Math.PI * 2);
  ctx.stroke();
  // 扣
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-2 * s, -1 * s, 4 * s, 3 * s);
}

function _drawIconPaper(ctx, s) {
  // 文档
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 1 * s;
  ctx.fillRect(-7 * s, -9 * s, 14 * s, 18 * s);
  ctx.strokeRect(-7 * s, -9 * s, 14 * s, 18 * s);
  // 文字线
  ctx.fillStyle = '#CED4DA';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-4 * s, (-5 + i * 4) * s, (8 - i * 1.5) * s, 1.5 * s);
  }
}

function _drawIconHandshake(ctx, s) {
  // 握手
  ctx.fillStyle = '#FFD5B8';
  // 左手
  ctx.save();
  ctx.rotate(-0.15);
  ctx.beginPath();
  ctx.ellipse(-4 * s, 0, 7 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // 右手
  ctx.fillStyle = '#E8B090';
  ctx.save();
  ctx.rotate(0.15);
  ctx.beginPath();
  ctx.ellipse(4 * s, 0, 7 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // 手指
  ctx.fillStyle = '#FFD5B8';
  ctx.beginPath();
  ctx.ellipse(0, -4 * s, 3 * s, 2 * s, 0, 0, Math.PI * 2);
  ctx.fill();
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
  FIRST_DODGE: { id: 'first_dodge', name: '初次逃脱', desc: '首次成功躲避老板', icon: '🛡️', iconId: 'shield' },
  COMBO_5: { id: 'combo_5', name: '五连闪避', desc: '达成5连击', icon: '🔥', iconId: 'fire' },
  COMBO_10: { id: 'combo_10', name: '完美表演', desc: '达成10连击', icon: '🌟', iconId: 'star' },
  CLOSE_CALL: { id: 'close_call', name: '惊魂一刻', desc: '触发一次极限闪避', icon: '😱', iconId: 'scream' },
  SCORE_500: { id: 'score_500', name: '摸鱼达人', desc: '单局得分超过500', icon: '💪', iconId: 'muscle' },
  SCORE_1000: { id: 'score_1000', name: '摸鱼之王', desc: '单局得分超过1000', icon: '👑', iconId: 'crown' },
  FULL_GAME: { id: 'full_game', name: '完美谢幕', desc: '成功坚持30秒', icon: '🎬', iconId: 'movie' },
  ITEM_COLLECTOR: { id: 'item_collector', name: '道具收集者', desc: '单局使用3个道具', icon: '🎒', iconId: 'backpack' },
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
