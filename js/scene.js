/**
 * scene.js - 场景绘制模块 v2.0
 * 
 * 全面升级的视觉系统：
 * - 更精致的办公室场景，带氛围光照
 * - 更专业的角色绘制（非幼稚 chibi 风格）
 * - 平滑的动画与细节
 * - 老板出场的戏剧性效果
 */

import { COLORS, roundRectPath, fillRoundRect } from './utils.js';
import { getShakeOffsetForEnv } from './effects.js';

// ============================================================
//  办公室背景
// ============================================================

export function drawOfficeBackground(ctx, width, height, suspicion, envShakeIntensity) {
  // ---- 墙壁 ----
  const wallGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  wallGrad.addColorStop(0, COLORS.wallBase);
  wallGrad.addColorStop(1, COLORS.wallPattern);
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, width, height * 0.7);

  // 墙壁细纹理
  ctx.fillStyle = 'rgba(0,0,0,0.015)';
  for (let x = 0; x < width; x += 28) {
    ctx.fillRect(x, 0, 1, height * 0.7);
  }

  // ---- 踢脚线 ----
  const floorY = height * 0.7;
  const baseGrad = ctx.createLinearGradient(0, floorY - 6, 0, floorY + 6);
  baseGrad.addColorStop(0, '#D4C4AA');
  baseGrad.addColorStop(0.5, COLORS.baseboard);
  baseGrad.addColorStop(1, '#B8A88E');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, floorY - 6, width, 12);

  // ---- 地板 ----
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
  floorGrad.addColorStop(0, '#A08B70');
  floorGrad.addColorStop(0.3, COLORS.floorBase);
  floorGrad.addColorStop(1, COLORS.floorDark);
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY + 6, width, height - floorY - 6);

  // 地板木纹
  ctx.strokeStyle = COLORS.floorPlank;
  ctx.lineWidth = 1;
  for (let y = floorY + 20; y < height; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // ---- 场景物件 ----
  drawWindow(ctx, width * 0.08, height * 0.06, width * 0.32, height * 0.25);
  drawClock(ctx, width * 0.78, height * 0.1, Math.min(38, width * 0.08));
  drawPoster(ctx, width * 0.68, height * 0.2, width * 0.22, height * 0.18);
  drawDesk(ctx, width * 0.1, height * 0.44, width * 0.75, height * 0.24);
  drawComputer(ctx, width * 0.25, height * 0.27, Math.min(160, width * 0.35), Math.min(105, height * 0.14));
  drawCoffeeCup(ctx, width * 0.68, height * 0.40, 20, 26, envShakeIntensity || 0);
  drawPapers(ctx, width * 0.72, height * 0.42, 48, 18);
  drawChair(ctx, width * 0.35, height * 0.52, 85, 60);
  drawPlant(ctx, width * 0.85, height * 0.36, 50, 78);

  // ---- 氛围光照 ----
  // 窗户投射的光束
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#FFE8A0';
  ctx.beginPath();
  ctx.moveTo(width * 0.08, height * 0.06);
  ctx.lineTo(width * 0.42, height * 0.06);
  ctx.lineTo(width * 0.55, height * 0.7);
  ctx.lineTo(width * 0.02, height * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ---- 怀疑值氛围（红色叠加） ----
  if (suspicion > 20) {
    const alpha = (suspicion - 20) / 200; // 最多 ~0.4
    ctx.save();
    ctx.globalAlpha = Math.min(alpha, 0.25);
    ctx.fillStyle = '#FF2020';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

// ============================================================
//  场景物件
// ============================================================

function drawWindow(ctx, x, y, w, h) {
  // 窗框
  ctx.fillStyle = '#D8C8B0';
  fillRoundRect(ctx, x - 5, y - 5, w + 10, h + 10, 4, '#D8C8B0');

  // 天空
  const skyGrad = ctx.createLinearGradient(x, y, x, y + h);
  skyGrad.addColorStop(0, COLORS.skyTop);
  skyGrad.addColorStop(0.5, COLORS.skyMid);
  skyGrad.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(x, y, w, h);

  // 云朵
  drawCloud(ctx, x + w * 0.2, y + h * 0.2, w * 0.2);
  drawCloud(ctx, x + w * 0.65, y + h * 0.4, w * 0.15);
  drawCloud(ctx, x + w * 0.35, y + h * 0.6, w * 0.12);

  // 窗格
  ctx.strokeStyle = '#C8B8A0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + w, y + h / 2);
  ctx.stroke();

  // 玻璃反光
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(x + 4, y + 4, w * 0.4, h * 0.4);

  // 窗台
  const sillGrad = ctx.createLinearGradient(0, y + h, 0, y + h + 10);
  sillGrad.addColorStop(0, '#D8C8B0');
  sillGrad.addColorStop(1, '#C8B8A0');
  ctx.fillStyle = sillGrad;
  ctx.fillRect(x - 8, y + h, w + 16, 10);
}

function drawCloud(ctx, cx, cy, size) {
  ctx.fillStyle = COLORS.cloud;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  ctx.arc(cx + size * 0.35, cy - size * 0.12, size * 0.38, 0, Math.PI * 2);
  ctx.arc(cx + size * 0.6, cy + size * 0.05, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function drawClock(ctx, x, y, r) {
  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.arc(x + 1.5, y + 2, r, 0, Math.PI * 2);
  ctx.fill();

  // 钟面
  ctx.fillStyle = '#FFFDF5';
  ctx.strokeStyle = '#5C4B3A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 刻度
  ctx.fillStyle = '#5C4B3A';
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    const dist = r * 0.78;
    const dotR = i % 3 === 0 ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  // 时针
  const now = Date.now() / 1000;
  const hourAngle = ((9 + (now % 60) / 60) * Math.PI) / 6 - Math.PI / 2;
  ctx.strokeStyle = '#3D3226';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * r * 0.45, y + Math.sin(hourAngle) * r * 0.45);
  ctx.stroke();

  // 分针
  const minAngle = ((now % 3600) / 3600) * Math.PI * 2 - Math.PI / 2;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(minAngle) * r * 0.65, y + Math.sin(minAngle) * r * 0.65);
  ctx.stroke();

  // 中心
  ctx.fillStyle = '#E8453C';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawPoster(ctx, x, y, w, h) {
  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  fillRoundRect(ctx, x + 2, y + 2, w, h, 4, 'rgba(0,0,0,0.06)');

  // 边框
  ctx.fillStyle = '#FFFDF5';
  ctx.strokeStyle = '#D8C8B0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 装饰色条
  ctx.fillStyle = '#E8453C';
  ctx.fillRect(x + 6, y + 8, 3, h - 16);

  // 文字
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = `bold ${Math.max(9, w * 0.11)}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.textAlign = 'center';
  const lines = ['今天', '也要', '努力', '工作!'];
  const lineH = h * 0.18;
  lines.forEach((line, i) => {
    ctx.fillText(line, x + w / 2 + 4, y + 20 + i * lineH);
  });

  // 装饰圆
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 4, y + h - h * 0.15, w * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawDesk(ctx, x, y, w, h) {
  const topH = h * 0.14;

  // 桌腿
  ctx.fillStyle = COLORS.deskLeg;
  ctx.fillRect(x + 12, y + topH, 10, h * 0.86);
  ctx.fillRect(x + w - 22, y + topH, 10, h * 0.86);

  // 横梁
  ctx.fillStyle = COLORS.deskLeg;
  ctx.fillRect(x + 8, y + h * 0.55, w - 16, 5);

  // 桌面渐变
  const topGrad = ctx.createLinearGradient(0, y, 0, y + topH);
  topGrad.addColorStop(0, COLORS.deskTopLight);
  topGrad.addColorStop(0.5, COLORS.deskTop);
  topGrad.addColorStop(1, COLORS.deskEdge);
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - 4, y + topH);
  ctx.lineTo(x + 4, y + topH);
  ctx.closePath();
  ctx.fill();

  // 桌面高光
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(x + 10, y + 2, w - 20, 2);

  // 木纹
  ctx.strokeStyle = 'rgba(120,80,40,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const ly = y + 5 + i * (topH - 5) / 4;
    ctx.beginPath();
    ctx.moveTo(x + 15, ly);
    ctx.lineTo(x + w - 20, ly);
    ctx.stroke();
  }
}

function drawComputer(ctx, x, y, w, h) {
  // 底座
  ctx.fillStyle = '#3A3A3A';
  fillRoundRect(ctx, x + w / 2 - 32, y + h + 8, 64, 6, 3, '#3A3A3A');

  // 支架
  ctx.fillStyle = '#444';
  ctx.fillRect(x + w / 2 - 8, y + h - 4, 16, 16);

  // 显示器外壳
  const monitorGrad = ctx.createLinearGradient(x, y, x, y + h);
  monitorGrad.addColorStop(0, '#2A2A2E');
  monitorGrad.addColorStop(1, '#1E1E22');
  ctx.fillStyle = monitorGrad;
  ctx.beginPath();
  roundRectPath(ctx, x, y, w, h, 5);
  ctx.closePath();
  ctx.fill();

  // 屏幕
  ctx.fillStyle = '#0D1117';
  ctx.beginPath();
  roundRectPath(ctx, x + 5, y + 5, w - 10, h - 14, 3);
  ctx.closePath();
  ctx.fill();

  // 屏幕内容 - 代码编辑器
  const codeX = x + 10;
  const codeY = y + 14;
  const lineH = Math.max(9, (h - 28) / 8);
  const codeLines = [
    { text: 'def work():', color: '#FF7B72' },
    { text: '  while True:', color: '#FF7B72' },
    { text: '    look_busy()', color: '#79C0FF' },
    { text: '    if boss_near():', color: '#FF7B72' },
    { text: '      alt_tab()', color: '#7EE787' },
    { text: '    else:', color: '#FF7B72' },
    { text: '      browse_web()', color: '#79C0FF' },
  ];

  ctx.font = `${Math.max(7, lineH * 0.8)}px "Courier New", monospace`;
  ctx.textAlign = 'left';
  codeLines.forEach((line, i) => {
    // 行号
    ctx.fillStyle = '#484F58';
    ctx.fillText(`${i + 1}`, codeX - 6, codeY + i * lineH);
    // 代码
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, codeX + 8, codeY + i * lineH);
  });

  // 光标闪烁
  const blink = Math.sin(Date.now() / 500) > 0;
  if (blink) {
    const cursorLine = codeLines.length;
    ctx.fillStyle = '#C9D1D9';
    ctx.fillRect(codeX + 8, codeY + cursorLine * lineH - 2, 6, lineH * 0.7);
  }

  // 状态栏
  ctx.fillStyle = '#161B22';
  ctx.fillRect(x + 5, y + h - 9, w - 10, 9);
  ctx.fillStyle = '#8B949E';
  ctx.font = `${Math.max(6, lineH * 0.6)}px Arial`;
  ctx.textAlign = 'right';
  ctx.fillText('摸鱼模式 v2.0', x + w - 10, y + h - 2);

  // LED 指示灯
  ctx.fillStyle = '#30D684';
  ctx.beginPath();
  ctx.arc(x + w - 8, y - 3, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // LED 光晕
  ctx.fillStyle = 'rgba(48,214,132,0.25)';
  ctx.beginPath();
  ctx.arc(x + w - 8, y - 3, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCoffeeCup(ctx, x, y, w, h, envShakeIntensity) {
  // 环境抖动偏移（老板出现时咖啡杯会抖动）
  const shakeOffset = getShakeOffsetForEnv(Date.now() / 1000, envShakeIntensity || 0);
  ctx.save();
  ctx.translate(shakeOffset.x, shakeOffset.y);
  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2 + 1, y + h * 0.65 + 2, w * 0.55, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // 杯身
  const cupGrad = ctx.createLinearGradient(x, y, x + w, y);
  cupGrad.addColorStop(0, '#F8F9FA');
  cupGrad.addColorStop(0.5, '#FFFFFF');
  cupGrad.addColorStop(1, '#E9ECEF');
  ctx.fillStyle = cupGrad;
  ctx.fillRect(x, y + 2, w, h * 0.55);

  // 杯口
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + 2, w / 2, h * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // 咖啡
  ctx.fillStyle = '#5C3A1E';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + 3, w / 2 - 2, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  // 杯把
  ctx.strokeStyle = '#E9ECEF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x + w + 1, y + h * 0.25, w * 0.35, -0.2, Math.PI * 1.1);
  ctx.stroke();

  // 蒸汽
  const t = Date.now() / 1000;
  for (let i = 0; i < 3; i++) {
    const sx = x + w * 0.3 + i * w * 0.2;
    const sy = y - 3 + Math.sin(t * 1.8 + i * 1.2) * 6;
    const sr = 2.5 + i;
    ctx.fillStyle = `rgba(180,185,195,${0.4 - i * 0.1})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPapers(ctx, x, y, w, h) {
  // 文件 1
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.06);
  fillRoundRect(ctx, 0, 0, w * 0.7, h, 2, '#FFFFFF');
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  roundRectPath(ctx, 0, 0, w * 0.7, h, 2);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#CED4DA';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(4, 4 + i * 7, w * 0.6 - i * 4, 2);
  }
  ctx.restore();

  // 文件 2
  ctx.save();
  ctx.translate(x + 6, y + 5);
  ctx.rotate(-0.1);
  fillRoundRect(ctx, 0, 0, w * 0.65, h * 0.9, 2, '#FFFFFF');
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  roundRectPath(ctx, 0, 0, w * 0.65, h * 0.9, 2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawChair(ctx, x, y, w, h) {
  // 轮子
  for (let i = 0; i < 5; i++) {
    const cx = x + w * 0.12 + i * w * 0.19;
    ctx.fillStyle = '#3A3A3E';
    ctx.beginPath();
    ctx.arc(cx, y + h - 2, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 五星脚
  ctx.strokeStyle = '#484850';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h * 0.7);
    ctx.lineTo(
      x + w / 2 + Math.cos(angle) * w * 0.4,
      y + h * 0.7 + Math.sin(angle) * h * 0.25
    );
    ctx.stroke();
  }

  // 气杆
  ctx.fillStyle = '#5A5A62';
  ctx.fillRect(x + w / 2 - 4, y + h * 0.42, 8, h * 0.3);

  // 座垫
  const seatGrad = ctx.createLinearGradient(0, y + h * 0.15, 0, y + h * 0.48);
  seatGrad.addColorStop(0, '#505060');
  seatGrad.addColorStop(1, '#404050');
  ctx.fillStyle = seatGrad;
  ctx.beginPath();
  roundRectPath(ctx, x + 4, y + h * 0.15, w - 8, h * 0.32, 7);
  ctx.closePath();
  ctx.fill();

  // 靠背
  const backGrad = ctx.createLinearGradient(0, y - h * 0.32, 0, y + h * 0.15);
  backGrad.addColorStop(0, '#505060');
  backGrad.addColorStop(1, '#404050');
  ctx.fillStyle = backGrad;
  ctx.beginPath();
  roundRectPath(ctx, x + 8, y - h * 0.32, w - 16, h * 0.5, 5);
  ctx.closePath();
  ctx.fill();

  // 靠背高光
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath();
  roundRectPath(ctx, x + 12, y - h * 0.28, w * 0.3, h * 0.3, 3);
  ctx.closePath();
  ctx.fill();
}

function drawPlant(ctx, x, y, w, h) {
  const potTop = y + h * 0.5;

  // 花盆
  const potGrad = ctx.createLinearGradient(x, potTop, x + w, potTop);
  potGrad.addColorStop(0, '#D4845A');
  potGrad.addColorStop(1, '#B8653F');
  ctx.fillStyle = potGrad;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.1, potTop);
  ctx.lineTo(x + w * 0.9, potTop);
  ctx.lineTo(x + w * 0.75, y + h);
  ctx.lineTo(x + w * 0.25, y + h);
  ctx.closePath();
  ctx.fill();

  // 盆沿
  ctx.fillStyle = '#E8946E';
  ctx.fillRect(x + w * 0.05, potTop - 3, w * 0.9, 6);

  // 叶片
  const leaves = [
    { lx: x + w * 0.5, ly: potTop - 4, rx: 12, ry: 16, angle: -0.2, color: '#40C057' },
    { lx: x + w * 0.25, ly: potTop + 2, rx: 10, ry: 18, angle: -0.55, color: '#51CF66' },
    { lx: x + w * 0.75, ly: potTop + 4, rx: 9, ry: 17, angle: 0.45, color: '#40C057' },
    { lx: x + w * 0.15, ly: potTop + 8, rx: 8, ry: 14, angle: -0.75, color: '#2F9E44' },
    { lx: x + w * 0.82, ly: potTop, rx: 9, ry: 15, angle: 0.65, color: '#51CF66' },
    { lx: x + w * 0.5, ly: potTop - 16, rx: 10, ry: 14, angle: 0.1, color: '#69DB7C' },
  ];

  leaves.forEach(leaf => {
    ctx.save();
    ctx.translate(leaf.lx, leaf.ly);
    ctx.rotate(leaf.angle);
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, leaf.rx, leaf.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    // 叶脉
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, -leaf.ry * 0.6);
    ctx.lineTo(0, leaf.ry * 0.6);
    ctx.stroke();
    ctx.restore();
  });
}

// ============================================================
//  玩家角色 - 现代扁平化风格
// ============================================================

export function drawPlayerIdle(ctx, x, y, size, idleAnim) {
  const bounce = Math.sin(idleAnim * Math.PI * 2) * 2;
  const headR = size * 0.26;
  const bodyH = size * 0.52;
  const bodyW = size * 0.6;

  ctx.save();
  ctx.translate(x, y + bounce);

  // ---- 腿 ----
  ctx.fillStyle = COLORS.playerPants;
  ctx.fillRect(-bodyW * 0.14, bodyH * 0.48, bodyW * 0.22, bodyH * 0.28);
  ctx.fillRect(bodyW * 0.16, bodyH * 0.48, bodyW * 0.22, bodyH * 0.28);
  // 鞋
  ctx.fillStyle = '#2C3040';
  fillRoundRect(ctx, -bodyW * 0.16, bodyH * 0.74, bodyW * 0.26, 6, 3, '#2C3040');
  fillRoundRect(ctx, bodyW * 0.14, bodyH * 0.74, bodyW * 0.26, 6, 3, '#2C3040');

  // ---- 身体 ----
  const shirtGrad = ctx.createLinearGradient(0, 0, 0, bodyH);
  shirtGrad.addColorStop(0, COLORS.playerShirt);
  shirtGrad.addColorStop(1, COLORS.playerShirtDark);
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  roundRectPath(ctx, -bodyW / 2, bodyH * 0.04, bodyW, bodyH * 0.5, 7);
  ctx.closePath();
  ctx.fill();

  // 领口
  ctx.fillStyle = '#F0F0F0';
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.18, bodyH * 0.04);
  ctx.lineTo(0, bodyH * 0.18);
  ctx.lineTo(bodyW * 0.18, bodyH * 0.04);
  ctx.closePath();
  ctx.fill();

  // ---- 手臂 + 手机 ----
  ctx.fillStyle = COLORS.playerSkin;
  // 左手
  ctx.save();
  ctx.translate(-bodyW * 0.42, bodyH * 0.18);
  ctx.rotate(-0.2);
  ctx.beginPath();
  roundRectPath(ctx, -5, -3, 10, bodyH * 0.3, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 右手
  ctx.save();
  ctx.translate(bodyW * 0.12, bodyH * 0.22);
  ctx.rotate(0.25);
  ctx.beginPath();
  roundRectPath(ctx, -5, -3, 10, bodyH * 0.22, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 手机
  const phoneX = -bodyW * 0.04;
  const phoneY = bodyH * 0.2;
  ctx.fillStyle = '#1E2530';
  fillRoundRect(ctx, phoneX - 12, phoneY, 24, 38, 4, '#1E2530');
  // 手机屏幕
  const screenGrad = ctx.createLinearGradient(phoneX - 9, phoneY + 3, phoneX + 9, phoneY + 33);
  screenGrad.addColorStop(0, '#4DA3FF');
  screenGrad.addColorStop(1, '#7B61FF');
  ctx.fillStyle = screenGrad;
  fillRoundRect(ctx, phoneX - 9, phoneY + 3, 18, 30, 2, screenGrad);

  // ---- 头部 ----
  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.beginPath();
  ctx.arc(0, -headR * 0.25, headR + 1, 0, Math.PI * 2);
  ctx.fill();

  // 头
  const skinGrad = ctx.createRadialGradient(-headR * 0.2, -headR * 0.3, 0, 0, -headR * 0.1, headR);
  skinGrad.addColorStop(0, '#FFE5CC');
  skinGrad.addColorStop(1, COLORS.playerSkin);
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.1, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = COLORS.playerHair;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.3, headR + 2, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -headR * 0.12, headR - 1, Math.PI * 0.88, Math.PI * 2.12);
  ctx.fill();
  ctx.fillRect(-headR - 1, -headR * 0.3, headR * 2 + 2, headR * 0.22);

  // 眼睛 - 看手机，半眯
  ctx.fillStyle = '#1A1D23';
  ctx.beginPath();
  ctx.ellipse(-headR * 0.28, -headR * 0.18, 3.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headR * 0.28, -headR * 0.18, 3.5, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // 高光
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-headR * 0.28 - 1, -headR * 0.22, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.28 - 1, -headR * 0.22, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 腮红
  ctx.fillStyle = 'rgba(255,140,140,0.2)';
  ctx.beginPath();
  ctx.ellipse(-headR * 0.48, -headR * 0.02, 4.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headR * 0.48, -headR * 0.02, 4.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 微笑
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.04, headR * 0.18, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

export function drawPlayerWorking(ctx, x, y, size) {
  const headR = size * 0.26;
  const bodyH = size * 0.52;
  const bodyW = size * 0.6;

  ctx.save();
  ctx.translate(x, y);

  // ---- 腿 ----
  ctx.fillStyle = COLORS.playerPants;
  ctx.fillRect(-bodyW * 0.14, bodyH * 0.48, bodyW * 0.22, bodyH * 0.28);
  ctx.fillRect(bodyW * 0.16, bodyH * 0.48, bodyW * 0.22, bodyH * 0.28);
  ctx.fillStyle = '#2C3040';
  fillRoundRect(ctx, -bodyW * 0.16, bodyH * 0.74, bodyW * 0.26, 6, 3, '#2C3040');
  fillRoundRect(ctx, bodyW * 0.14, bodyH * 0.74, bodyW * 0.26, 6, 3, '#2C3040');

  // ---- 身体 ----
  const shirtGrad = ctx.createLinearGradient(0, 0, 0, bodyH);
  shirtGrad.addColorStop(0, COLORS.playerShirt);
  shirtGrad.addColorStop(1, COLORS.playerShirtDark);
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  roundRectPath(ctx, -bodyW / 2, bodyH * 0.04, bodyW, bodyH * 0.5, 7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F0F0F0';
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.18, bodyH * 0.04);
  ctx.lineTo(0, bodyH * 0.18);
  ctx.lineTo(bodyW * 0.18, bodyH * 0.04);
  ctx.closePath();
  ctx.fill();

  // ---- 手臂（打字姿势） ----
  ctx.fillStyle = COLORS.playerSkin;
  ctx.save();
  ctx.translate(-bodyW * 0.38, bodyH * 0.14);
  ctx.rotate(-0.35);
  ctx.beginPath();
  roundRectPath(ctx, -5, -3, 10, bodyH * 0.26, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(bodyW * 0.38, bodyH * 0.14);
  ctx.rotate(0.35);
  ctx.beginPath();
  roundRectPath(ctx, -5, -3, 10, bodyH * 0.26, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 手
  ctx.fillStyle = COLORS.playerSkin;
  ctx.beginPath();
  ctx.arc(-bodyW * 0.12, bodyH * 0.32, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bodyW * 0.12, bodyH * 0.32, 6, 0, Math.PI * 2);
  ctx.fill();

  // ---- 头部 ----
  const skinGrad = ctx.createRadialGradient(-headR * 0.2, -headR * 0.3, 0, 0, -headR * 0.1, headR);
  skinGrad.addColorStop(0, '#FFE5CC');
  skinGrad.addColorStop(1, COLORS.playerSkin);
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.1, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = COLORS.playerHair;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.3, headR + 2, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -headR * 0.12, headR - 1, Math.PI * 0.88, Math.PI * 2.12);
  ctx.fill();
  ctx.fillRect(-headR - 1, -headR * 0.3, headR * 2 + 2, headR * 0.22);

  // 眼睛 - 瞪大看屏幕
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-headR * 0.28, -headR * 0.18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.28, -headR * 0.18, 5, 0, Math.PI * 2);
  ctx.fill();
  // 瞳孔
  ctx.fillStyle = '#1A1D23';
  ctx.beginPath();
  ctx.arc(-headR * 0.3, -headR * 0.18, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.26, -headR * 0.18, 2.8, 0, Math.PI * 2);
  ctx.fill();
  // 高光
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-headR * 0.3 - 0.8, -headR * 0.22, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.26 - 0.8, -headR * 0.22, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 嘴（紧抿）
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-headR * 0.18, 0);
  ctx.lineTo(headR * 0.18, 0);
  ctx.stroke();

  // 汗滴
  ctx.fillStyle = 'rgba(135,206,235,0.7)';
  ctx.beginPath();
  ctx.moveTo(headR * 0.55, -headR * 0.42);
  ctx.quadraticCurveTo(headR * 0.6, -headR * 0.22, headR * 0.55, -headR * 0.22);
  ctx.quadraticCurveTo(headR * 0.5, -headR * 0.22, headR * 0.55, -headR * 0.42);
  ctx.fill();

  ctx.restore();
}

// ============================================================
//  老板角色 - 增强版
// ============================================================

export function drawBoss(ctx, x, y, width, expression, walkPhase) {
  const cx = x + width / 2;
  const h = width * 1.3;
  const headR = width * 0.2;
  const bodyTop = y + headR * 0.4;

  // 行走微动
  const walkBounce = walkPhase ? Math.sin(walkPhase) * 1.5 : 0;

  ctx.save();
  ctx.translate(cx, walkBounce);

  // ---- 阴影 ----
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(0, bodyTop + h * 0.88, width * 0.35, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- 腿 ----
  ctx.fillStyle = '#283040';
  const legOffset = walkPhase ? Math.sin(walkPhase) * 3 : 0;
  ctx.fillRect(-width * 0.18, bodyTop + h * 0.55, width * 0.16, h * 0.28 + legOffset);
  ctx.fillRect(width * 0.02, bodyTop + h * 0.55, width * 0.16, h * 0.28 - legOffset);

  // 皮鞋
  ctx.fillStyle = '#1A1D23';
  fillRoundRect(ctx, -width * 0.2, bodyTop + h * 0.82 + legOffset, width * 0.2, 7, 3, '#1A1D23');
  fillRoundRect(ctx, width * 0.0, bodyTop + h * 0.82 - legOffset, width * 0.2, 7, 3, '#1A1D23');

  // ---- 身体（西装） ----
  const suitGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + h * 0.58);
  suitGrad.addColorStop(0, COLORS.bossSuit);
  suitGrad.addColorStop(1, COLORS.bossSuitDark);
  ctx.fillStyle = suitGrad;
  ctx.beginPath();
  roundRectPath(ctx, -width * 0.3, bodyTop, width * 0.6, h * 0.56, 5);
  ctx.closePath();
  ctx.fill();

  // 衬衫
  ctx.fillStyle = '#F0F0F0';
  ctx.beginPath();
  ctx.moveTo(-width * 0.07, bodyTop + 2);
  ctx.lineTo(-width * 0.1, bodyTop + h * 0.28);
  ctx.lineTo(width * 0.1, bodyTop + h * 0.28);
  ctx.lineTo(width * 0.07, bodyTop + 2);
  ctx.closePath();
  ctx.fill();

  // 领带
  ctx.fillStyle = COLORS.bossTie;
  ctx.beginPath();
  ctx.moveTo(0, bodyTop + h * 0.04);
  ctx.lineTo(-width * 0.05, bodyTop + h * 0.18);
  ctx.lineTo(0, bodyTop + h * 0.3);
  ctx.lineTo(width * 0.05, bodyTop + h * 0.18);
  ctx.closePath();
  ctx.fill();

  // ---- 手臂 ----
  ctx.fillStyle = COLORS.bossSuit;
  // 左手（拿公文包）
  ctx.save();
  ctx.translate(-width * 0.28, bodyTop + h * 0.06);
  ctx.rotate(-0.12);
  ctx.beginPath();
  roundRectPath(ctx, -6, 0, 12, h * 0.32, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 右手
  ctx.save();
  ctx.translate(width * 0.22, bodyTop + h * 0.08);
  ctx.rotate(0.35);
  ctx.beginPath();
  roundRectPath(ctx, -5, 0, 10, h * 0.25, 5);
  ctx.closePath();
  ctx.fill();
  // 手
  ctx.fillStyle = COLORS.bossSkin;
  ctx.beginPath();
  ctx.arc(0, h * 0.25, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ---- 公文包 ----
  ctx.fillStyle = '#5C3A1E';
  fillRoundRect(ctx, -width * 0.35, bodyTop + h * 0.34, width * 0.2, h * 0.13, 3, '#5C3A1E');
  ctx.fillStyle = '#7A4E2A';
  ctx.fillRect(-width * 0.35, bodyTop + h * 0.34, width * 0.2, 3);
  ctx.strokeStyle = '#5C3A1E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-width * 0.25, bodyTop + h * 0.34, width * 0.07, Math.PI, Math.PI * 2);
  ctx.stroke();

  // ---- 头部 ----
  const skinGrad = ctx.createRadialGradient(-headR * 0.15, y + headR * 0.4, 0, 0, y + headR * 0.5, headR);
  skinGrad.addColorStop(0, '#F8D8B0');
  skinGrad.addColorStop(1, COLORS.bossSkin);
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.arc(0, y + headR * 0.5, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = COLORS.bossHair;
  ctx.beginPath();
  ctx.arc(0, y + headR * 0.3, headR + 1, Math.PI, Math.PI * 2.08);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, y + headR * 0.45, headR - 1, Math.PI * 0.92, Math.PI * 2.08);
  ctx.fill();
  ctx.fillRect(-headR - 1, y + headR * 0.25, headR * 2 + 2, headR * 0.28);

  // 眼睛
  const eyeY = y + headR * 0.5;
  drawBossEyes(ctx, headR, eyeY, expression);

  // 眉毛
  drawBossEyebrows(ctx, headR, eyeY, expression);

  // 嘴巴
  const mouthY = y + headR * 0.75;
  drawBossMouth(ctx, headR, mouthY, expression);

  // 愤怒特效
  if (expression === 'angry' || expression === 'furious') {
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.8;
    const wY = y + headR * 0.18;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-headR * 0.22, wY + i * 4);
      ctx.quadraticCurveTo(0, wY + i * 4 + 1.5, headR * 0.22, wY + i * 4);
      ctx.stroke();
    }
    if (expression === 'furious') {
      ctx.fillStyle = 'rgba(232,69,60,0.15)';
      ctx.beginPath();
      ctx.arc(0, y + headR * 0.5, headR * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawBossEyes(ctx, headR, eyeY, expression) {
  if (expression === 'angry' || expression === 'furious') {
    ctx.fillStyle = '#1A1D23';
    // 三角眼
    ctx.beginPath();
    ctx.moveTo(-headR * 0.4, eyeY);
    ctx.lineTo(-headR * 0.12, eyeY + 4);
    ctx.lineTo(-headR * 0.04, eyeY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(headR * 0.4, eyeY);
    ctx.lineTo(headR * 0.12, eyeY + 4);
    ctx.lineTo(headR * 0.04, eyeY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-headR * 0.22, eyeY + 1.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.28, eyeY + 1.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (expression === 'surprised') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-headR * 0.26, eyeY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.32, eyeY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1A1D23';
    ctx.beginPath();
    ctx.arc(-headR * 0.26, eyeY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.32, eyeY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 怀疑
    ctx.fillStyle = '#1A1D23';
    ctx.beginPath();
    ctx.ellipse(-headR * 0.28, eyeY, 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headR * 0.32, eyeY, 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-headR * 0.28 - 0.8, eyeY - 0.8, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.32 - 0.8, eyeY - 0.8, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBossEyebrows(ctx, headR, eyeY, expression) {
  ctx.strokeStyle = '#1A1D23';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  if (expression === 'angry' || expression === 'furious') {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.45, eyeY - 8);
    ctx.lineTo(-headR * 0.08, eyeY - 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headR * 0.45, eyeY - 8);
    ctx.lineTo(headR * 0.08, eyeY - 3);
    ctx.stroke();
  } else if (expression === 'surprised') {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.38, eyeY - 9);
    ctx.lineTo(-headR * 0.12, eyeY - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headR * 0.38, eyeY - 9);
    ctx.lineTo(headR * 0.12, eyeY - 5);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.38, eyeY - 5);
    ctx.lineTo(-headR * 0.12, eyeY - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headR * 0.42, eyeY - 7);
    ctx.lineTo(headR * 0.18, eyeY - 5);
    ctx.stroke();
  }
}

function drawBossMouth(ctx, headR, mouthY, expression) {
  ctx.strokeStyle = '#7A5838';
  ctx.lineWidth = 1.8;

  if (expression === 'angry' || expression === 'furious') {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.18, mouthY);
    ctx.lineTo(headR * 0.18, mouthY);
    ctx.stroke();
  } else if (expression === 'surprised') {
    ctx.beginPath();
    ctx.arc(0, mouthY + 1.5, headR * 0.15, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.14, mouthY);
    ctx.quadraticCurveTo(0, mouthY + 4, headR * 0.14, mouthY);
    ctx.stroke();
  }
}

// ============================================================
//  警告效果
// ============================================================

export function drawWarningVignette(ctx, width, height, progress) {
  const alpha = Math.min(progress * 0.55, 0.3);

  // 四边红色渐变
  const edges = [
    { grad: ctx.createLinearGradient(0, 0, 0, height * 0.07), rect: [0, 0, width, height * 0.07] },
    { grad: ctx.createLinearGradient(0, height, 0, height * 0.93), rect: [0, height * 0.93, width, height * 0.07] },
    { grad: ctx.createLinearGradient(0, 0, width * 0.035, 0), rect: [0, 0, width * 0.035, height] },
    { grad: ctx.createLinearGradient(width, 0, width * 0.965, 0), rect: [width * 0.965, 0, width * 0.035, height] },
  ];

  edges.forEach(({ grad, rect }) => {
    grad.addColorStop(0, `rgba(232,69,60,${alpha})`);
    grad.addColorStop(1, 'rgba(232,69,60,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(...rect);
  });
}

export function drawWarningBar(ctx, x, y, width, height, progress, actualTimeout) {
  // 背景
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  roundRectPath(ctx, x, y, width, height, height / 2);
  ctx.closePath();
  ctx.fill();

  // 进度条
  const barW = Math.max(width * (1 - progress), 0);
  if (barW > 0) {
    const grad = ctx.createLinearGradient(x, y, x + barW, y);
    if (progress < 0.4) {
      grad.addColorStop(0, '#30D684');
      grad.addColorStop(1, '#22B56E');
    } else if (progress < 0.7) {
      grad.addColorStop(0, '#FFD700');
      grad.addColorStop(1, '#FFB627');
    } else {
      grad.addColorStop(0, '#FF7B73');
      grad.addColorStop(1, '#E8453C');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    roundRectPath(ctx, x, y, barW, height, height / 2);
    ctx.closePath();
    ctx.fill();
  }

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPath(ctx, x, y, width, height, height / 2);
  ctx.closePath();
  ctx.stroke();

  // 倒计时
  const timeout = actualTimeout || 1.2;
  const remaining = Math.max((1 - progress) * timeout, 0);
  const pulse = progress > 0.7 ? Math.sin(Date.now() / 1000 * 10) * 0.3 + 0.7 : 1;
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${height - 6}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${remaining.toFixed(1)}s`, x + width / 2, y + height / 2);
  ctx.restore();
}
