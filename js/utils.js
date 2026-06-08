/**
 * utils.js - 工具函数模块
 * 提供随机数、时间格式化、颜色常量等通用工具函数
 */

// ============================================================
//  全局颜色调色板
// ============================================================
export const COLORS = {
  // 主题色
  primary: '#FF6B6B',
  primaryDark: '#EE5A24',
  primaryLight: '#FF8787',
  success: '#51CF66',
  successDark: '#40C057',
  warning: '#FFD43B',
  warningDark: '#FAB005',
  danger: '#E03131',
  dangerDark: '#C92A2A',

  // 办公室场景色
  officeWall: '#FFF4E6',
  officeWallPattern: '#FFE8CC',
  officeFloor: '#8B6F4E',
  officeFloorDark: '#6B5B3A',
  baseboard: '#D4A574',

  // 木纹色
  deskTop: '#C4956A',
  deskEdge: '#A67C52',
  deskLeg: '#8B6340',
  deskHighlight: 'rgba(255,255,255,0.15)',

  // 天空色
  skyTop: '#87CEEB',
  skyBottom: '#E0F0FF',
  cloud: 'rgba(255,255,255,0.9)',

  // UI色
  textDark: '#343A40',
  textLight: '#F8F9FA',
  textMuted: '#868E96',
  uiGlass: 'rgba(0,0,0,0.35)',
  uiGlassBorder: 'rgba(255,255,255,0.2)',
  scoreGold: '#FFD700',
  scoreGoldGlow: 'rgba(255,215,0,0.4)',

  // 菜单页
  menuGradTop: '#FFD43B',
  menuGradBottom: '#FF922B',
  menuCard: 'rgba(255,255,255,0.15)',

  // 结算页
  gameOverGradTop: '#495057',
  gameOverGradBottom: '#212529',
  resultCard: 'rgba(255,255,255,0.08)',
  resultCardBorder: 'rgba(255,255,255,0.12)',

  // 角色色
  playerSkin: '#FFDEB4',
  playerHair: '#4A3728',
  playerShirt: '#74C0FC',
  playerPants: '#495057',
  bossSkin: '#F5C6A0',
  bossHair: '#1A1A2E',
  bossSuit: '#2C3E50',
  bossSuitDark: '#1A252F',
  bossTie: '#E03131',

  // 特效色
  particleSuccess: '#51CF66',
  particleDanger: '#FF6B6B',
  particleGold: '#FFD700',
  particleStar: '#FFD43B',

  // 按钮主题
  btnPrimary: ['#FF6B6B', '#EE5A24'],
  btnSuccess: ['#51CF66', '#40C057'],
  btnWarning: ['#FFD43B', '#FAB005'],
  btnDisabled: ['#ADB5BD', '#868E96'],
  btnDanger: ['#E03131', '#C92A2A'],
};

/**
 * 生成指定范围内的随机整数
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 格式化时间为秒显示
 */
export function formatTime(seconds) {
  return `${Math.ceil(seconds)}s`;
}

/**
 * 格式化分数显示
 */
export function formatScore(score) {
  return Math.floor(score).toString();
}

/**
 * 获取称号
 */
export function getTitle(score) {
  if (score < 200) return '实习摸鱼员';
  if (score < 500) return '职场老油条';
  if (score < 800) return '办公室影帝';
  return '摸鱼宗师';
}

/**
 * 根据游戏时间获取老板出现间隔
 */
export function getBossInterval(elapsedTime) {
  if (elapsedTime < 10) return [4, 6];
  if (elapsedTime < 20) return [3, 4];
  return [2, 3];
}

/**
 * 限制值在指定范围内
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
 * 线性插值
 */
export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
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

export function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
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

// ============================================================
//  通用绘制辅助函数
// ============================================================

/**
 * 绘制圆角矩形路径（不包含 beginPath/closePath）
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
 * 绘制简单的阴影背景（在调用实际绘制前调用）
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} radius - 圆角
 * @param {number} offsetY - 阴影偏移
 * @param {string} color - 阴影颜色
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
 * 绘制高光效果（在按钮/卡片顶部）
 */
export function drawHighlight(ctx, x, y, w, h, radius) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  roundRectPath(ctx, x + 4, y + 3, w - 8, h * 0.45, Math.min(radius - 2, (h * 0.45) / 2));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * 绘制带有多种主题的按钮
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} rect - {x, y, width, height}
 * @param {string} text - 按钮文字
 * @param {Array|string} colorTheme - [color, darkColor] 或预设名 'primary'|'success'|'warning'|'disabled'|'danger'
 * @param {Object} opts - 可选参数 { pulse: 0-1, fontSize: number, shadowColor: string }
 */
export function drawRoundedButton(ctx, rect, text, colorTheme, opts = {}) {
  const { pulse = 0, fontSize = 22, textColor = '#fff' } = opts;

  // 解析颜色主题
  let colors;
  if (Array.isArray(colorTheme)) {
    colors = colorTheme;
  } else {
    const key = `btn${colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)}`;
    colors = COLORS[key] || [colorTheme, colorTheme];
  }

  // 脉冲缩放
  const scale = 1 + pulse * 0.06;
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const r = rect.height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  roundRectPath(ctx, rect.x + 2, rect.y + 3, rect.width, rect.height, r);
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

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, r);
  ctx.closePath();
  ctx.stroke();

  // 高光
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  roundRectPath(ctx, rect.x + 6, rect.y + 4, rect.width - 12, rect.height * 0.4, r / 2);
  ctx.closePath();
  ctx.fill();

  // 文字
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);

  ctx.restore();
}

/**
 * 绘制emoji（大尺寸）
 */
export function drawEmoji(ctx, emoji, x, y, size) {
  ctx.save();
  ctx.font = `${size}px "PingFang SC", "Apple Color Emoji", "Segoe UI Emoji", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);
  ctx.restore();
}
