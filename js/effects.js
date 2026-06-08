/**
 * effects.js - 视觉特效系统
 * 
 * 提供"游戏果汁"(game juice)效果，让游戏更有打击感和反馈感：
 * - 速度线（Speed Lines）：紧急时刻的径向线条
 * - 冲击波环（Impact Ring）：成功躲避时的扩散圆环
 * - 色差偏移（Chromatic Aberration）：失败/震动时的RGB分离
 * - 暗角脉冲（Vignette Pulse）：随怀疑值脉动的暗角
 * - 连击火焰（Combo Fire）：高连击时的上升火焰粒子
 * - 完美定格（Hit Stop）：完美时序的短暂画面冻结
 * - 慢动作（Slow Motion）：极限闪避的时间减速
 * - 环境反应：咖啡抖动、纸张飞散
 */

import { randomFloat, COLORS } from './utils.js';

// ============================================================
//  时序评级系统
// ============================================================

export const TimingRating = {
  PERFECT: 'perfect',   // 0~0.3s：完美
  GREAT: 'great',       // 0.3~0.6s：出色
  GOOD: 'good',         // 0.6~0.9s：不错
  CLOSE: 'close',       // 0.9~timeout：极限
};

export function getTimingRating(reactionTime, timeout) {
  const ratio = reactionTime / timeout;
  if (ratio < 0.25) return TimingRating.PERFECT;
  if (ratio < 0.5) return TimingRating.GREAT;
  if (ratio < 0.75) return TimingRating.GOOD;
  return TimingRating.CLOSE;
}

export function getRatingScoreMultiplier(rating) {
  switch (rating) {
    case TimingRating.PERFECT: return 3.0;
    case TimingRating.GREAT: return 2.0;
    case TimingRating.GOOD: return 1.5;
    case TimingRating.CLOSE: return 1.0;
    default: return 1.0;
  }
}

export function getRatingConfig(rating) {
  const configs = {
    [TimingRating.PERFECT]: {
      label: '完美!',
      color: '#FFD700',
      glowColor: 'rgba(255,215,0,0.6)',
      fontSize: 32,
      hitStop: 0.12,       // 画面冻结时间
      ringSpeed: 400,      // 冲击波扩散速度
      ringWidth: 4,
      particles: 20,
    },
    [TimingRating.GREAT]: {
      label: '出色!',
      color: '#30D684',
      glowColor: 'rgba(48,214,132,0.5)',
      fontSize: 28,
      hitStop: 0.06,
      ringSpeed: 300,
      ringWidth: 3,
      particles: 14,
    },
    [TimingRating.GOOD]: {
      label: '不错',
      color: '#4DA3FF',
      glowColor: 'rgba(77,163,255,0.4)',
      fontSize: 24,
      hitStop: 0,
      ringSpeed: 200,
      ringWidth: 2,
      particles: 10,
    },
    [TimingRating.CLOSE]: {
      label: '极限!',
      color: '#FF6B9D',
      glowColor: 'rgba(255,107,157,0.5)',
      fontSize: 26,
      hitStop: 0.08,
      ringSpeed: 350,
      ringWidth: 3,
      particles: 16,
    },
  };
  return configs[rating] || configs[TimingRating.GOOD];
}

// ============================================================
//  冲击波环
// ============================================================

export function createImpactRing(x, y, config) {
  return {
    x, y,
    radius: 5,
    maxRadius: 120,
    speed: config.ringSpeed || 300,
    width: config.ringWidth || 3,
    color: config.color || '#FFD700',
    alpha: 1,
    active: true,
  };
}

export function updateImpactRing(ring, dt) {
  if (!ring.active) return false;
  ring.radius += ring.speed * dt;
  ring.alpha = Math.max(0, 1 - ring.radius / ring.maxRadius);
  if (ring.radius >= ring.maxRadius) {
    ring.active = false;
    return false;
  }
  return true;
}

export function drawImpactRing(ctx, ring) {
  if (!ring.active || ring.alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = ring.alpha * 0.8;
  ctx.strokeStyle = ring.color;
  ctx.lineWidth = ring.width * ring.alpha;
  ctx.beginPath();
  ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
  ctx.stroke();

  // 内发光
  ctx.globalAlpha = ring.alpha * 0.3;
  ctx.lineWidth = ring.width * ring.alpha * 3;
  ctx.stroke();
  ctx.restore();
}

// ============================================================
//  速度线
// ============================================================

export function createSpeedLines(cx, cy, count, intensity) {
  const lines = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + randomFloat(-0.1, 0.1);
    lines.push({
      angle,
      startDist: randomFloat(80, 140),
      length: randomFloat(60, 150) * intensity,
      width: randomFloat(1, 3) * intensity,
      alpha: randomFloat(0.3, 0.7),
      speed: randomFloat(100, 250),
    });
  }
  return lines;
}

export function drawSpeedLines(ctx, lines, cx, cy, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  lines.forEach(line => {
    const cos = Math.cos(line.angle);
    const sin = Math.sin(line.angle);
    const x1 = cx + cos * line.startDist;
    const y1 = cy + sin * line.startDist;
    const x2 = cx + cos * (line.startDist + line.length);
    const y2 = cy + sin * (line.startDist + line.length);

    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = line.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.restore();
}

// ============================================================
//  画面暗角脉冲
// ============================================================

export function drawPulseVignette(ctx, width, height, intensity, time) {
  if (intensity <= 0) return;

  const pulse = Math.sin(time * 4) * 0.15 + 0.85;
  const alpha = intensity * pulse * 0.35;

  const cx = width / 2;
  const cy = height / 2;
  const outerR = Math.max(width, height) * 0.8;
  const innerR = Math.min(width, height) * 0.3;

  const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.6, `rgba(180,30,30,${alpha * 0.3})`);
  grad.addColorStop(1, `rgba(100,10,10,${alpha})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

// ============================================================
//  环境反应
// ============================================================

/**
 * 绘制抖动的咖啡杯蒸汽（老板出现时增强抖动）
 */
export function getShakeOffsetForEnv(time, intensity) {
  return {
    x: Math.sin(time * 25) * intensity * 2,
    y: Math.cos(time * 30) * intensity * 1.5,
  };
}

/**
 * 生成飞散的纸张粒子
 */
export function createFlyingPapers(cx, cy, count) {
  const papers = [];
  for (let i = 0; i < count; i++) {
    papers.push({
      x: cx + randomFloat(-40, 40),
      y: cy + randomFloat(-20, 20),
      vx: randomFloat(-120, 120),
      vy: randomFloat(-200, -80),
      rotation: randomFloat(0, Math.PI * 2),
      rotSpeed: randomFloat(-5, 5),
      width: randomFloat(12, 22),
      height: randomFloat(8, 16),
      alpha: 1,
      gravity: randomFloat(150, 250),
    });
  }
  return papers;
}

export function updateFlyingPaper(p, dt) {
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.vy += p.gravity * dt;
  p.vx *= 0.98;
  p.rotation += p.rotSpeed * dt;
  p.alpha -= dt * 0.8;
  return p.alpha > 0;
}

export function drawFlyingPaper(ctx, p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.alpha);
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 0.5;
  ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
  ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
  // 文字线
  ctx.fillStyle = '#CED4DA';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-p.width / 2 + 2, -p.height / 2 + 3 + i * 4, p.width * 0.6, 1.5);
  }
  ctx.restore();
}

// ============================================================
//  时序评级弹出动画
// ============================================================

export function createRatingPopup(rating, x, y) {
  const config = getRatingConfig(rating);
  return {
    text: config.label,
    x, y,
    baseY: y,
    color: config.color,
    glowColor: config.glowColor,
    fontSize: config.fontSize,
    timer: 0,
    duration: 1.2,
    scale: 2.0,   // 初始缩放（弹出效果）
    alpha: 1,
  };
}

export function updateRatingPopup(popup, dt) {
  popup.timer += dt;
  const t = popup.timer / popup.duration;

  // 弹出缩放：快速缩小到1.0然后轻微过冲
  if (t < 0.15) {
    popup.scale = 2.0 - (t / 0.15) * 1.2; // 2.0 -> 0.8
  } else if (t < 0.25) {
    popup.scale = 0.8 + ((t - 0.15) / 0.1) * 0.3; // 0.8 -> 1.1
  } else {
    popup.scale = 1.1 - ((t - 0.25) / 0.75) * 0.1; // 1.1 -> 1.0
  }

  // 上浮
  popup.y = popup.baseY - t * 40;

  // 淡出
  popup.alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;

  return popup.timer < popup.duration;
}

export function drawRatingPopup(ctx, popup) {
  if (popup.alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = Math.max(0, popup.alpha);
  ctx.translate(popup.x, popup.y);
  ctx.scale(popup.scale, popup.scale);

  // 光晕
  ctx.shadowColor = popup.glowColor;
  ctx.shadowBlur = 16;

  // 描边
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 4;
  ctx.font = `bold ${popup.fontSize}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeText(popup.text, 0, 0);

  // 主体
  ctx.fillStyle = popup.color;
  ctx.fillText(popup.text, 0, 0);

  ctx.shadowBlur = 0;
  ctx.restore();
}

// ============================================================
//  游戏结束特效
// ============================================================

/**
 * 失败时的增强震屏（阻尼振荡 + 方向偏移 + 二次余震）
 * 远比纯随机偏移更有冲击力
 */
export function getEnhancedShakeOffset(timer, intensity, duration) {
  if (timer <= 0) return { x: 0, y: 0 };

  const t = timer / duration; // 1 -> 0
  const dampened = intensity * t * t; // 二次衰减

  // 主振荡
  const freq = 35;
  const mainX = Math.sin(timer * freq) * dampened;
  const mainY = Math.cos(timer * freq * 0.7) * dampened * 0.6;

  // 二次余震（在主震后约 0.2 秒触发）
  const secondaryDelay = 0.2;
  const secondaryTime = (duration - timer) - secondaryDelay;
  let secX = 0, secY = 0;
  if (secondaryTime > 0 && secondaryTime < 0.3) {
    const secDamp = intensity * 0.4 * (1 - secondaryTime / 0.3);
    secX = Math.sin(secondaryTime * 50) * secDamp;
    secY = Math.cos(secondaryTime * 45) * secDamp * 0.5;
  }

  return {
    x: mainX + secX,
    y: mainY + secY,
  };
}

/**
 * 游戏结束时的画面灰度叠加
 */
export function drawGameOverDesaturation(ctx, width, height, progress) {
  if (progress <= 0) return;

  // 半透明黑色叠加
  ctx.fillStyle = `rgba(20,23,30,${progress * 0.5})`;
  ctx.fillRect(0, 0, width, height);

  // 边缘暗角加重
  const grad = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.2,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${progress * 0.4})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 失败文字弹出
 */
export function drawFailText(ctx, width, height, timer) {
  if (timer <= 0) return;

  const maxDuration = 2.0;
  const t = Math.min(timer / maxDuration, 1);

  // 弹出缩放
  let scale;
  if (t < 0.1) {
    scale = 0.3 + (t / 0.1) * 1.2; // 0.3 -> 1.5
  } else if (t < 0.2) {
    scale = 1.5 - ((t - 0.1) / 0.1) * 0.4; // 1.5 -> 1.1
  } else {
    scale = 1.1 - ((t - 0.2) / 0.8) * 0.1; // 1.1 -> 1.0
  }

  const alpha = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
  const y = height * 0.38;

  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.translate(width / 2, y);
  ctx.scale(scale, scale);

  // 外发光
  ctx.shadowColor = 'rgba(232,69,60,0.6)';
  ctx.shadowBlur = 20;

  // 描边
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 5;
  ctx.font = 'bold 36px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeText('被老板抓包了!', 0, 0);

  // 主体
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('被老板抓包了!', 0, 0);

  ctx.shadowBlur = 0;
  ctx.restore();
}

/**
 * 成功时的金色辐射线
 */
export function drawSuccessRays(ctx, cx, cy, timer, intensity) {
  if (timer <= 0 || intensity <= 0) return;

  const alpha = Math.min(timer, 0.5) * intensity * 0.3;
  const rayCount = 12;
  const maxLen = 180 * intensity;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(timer * 0.5); // 缓慢旋转

  for (let i = 0; i < rayCount; i++) {
    const angle = (Math.PI * 2 * i) / rayCount;
    ctx.fillStyle = COLORS.scoreGold;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const cos1 = Math.cos(angle - 0.04);
    const sin1 = Math.sin(angle - 0.04);
    const cos2 = Math.cos(angle + 0.04);
    const sin2 = Math.sin(angle + 0.04);
    ctx.lineTo(cos1 * maxLen, sin1 * maxLen);
    ctx.lineTo(cos2 * maxLen, sin2 * maxLen);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
