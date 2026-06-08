/**
 * scene.js - 场景绘制模块
 * 绘制温馨的办公室场景和可爱的角色
 */

import { COLORS, roundRectPath } from './utils.js';

// ============================================================
//  办公室背景
// ============================================================

/**
 * 绘制完整的办公室背景
 */
export function drawOfficeBackground(ctx, width, height) {
  // 墙壁
  ctx.fillStyle = COLORS.officeWall;
  ctx.fillRect(0, 0, width, height);

  // 墙壁纹理 - 细条纹壁纸
  ctx.fillStyle = COLORS.officeWallPattern;
  for (let x = 0; x < width; x += 32) {
    ctx.fillRect(x, 0, 16, height * 0.7);
  }

  // 踢脚线
  const floorY = height * 0.7;
  ctx.fillStyle = COLORS.baseboard;
  ctx.fillRect(0, floorY - 4, width, 8);

  // 地板
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
  floorGrad.addColorStop(0, COLORS.officeFloor);
  floorGrad.addColorStop(1, COLORS.officeFloorDark);
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, width, height - floorY);

  // 地板木纹横线
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  for (let y = floorY + 15; y < height; y += 21) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 场景物件
  drawWindow(ctx, width * 0.13, height * 0.08, 130, 160);
  drawClock(ctx, width * 0.78, height * 0.1, 42);
  drawPoster(ctx, width * 0.72, height * 0.22, 90, 120);
  drawDesk(ctx, width * 0.15, height * 0.44, width * 0.7, height * 0.26);
  drawComputer(ctx, width * 0.28, height * 0.28, 160, 105);
  drawCoffeeCup(ctx, width * 0.70, height * 0.40, 22, 28);
  drawPapers(ctx, width * 0.72, height * 0.42, 50, 20);
  drawChair(ctx, width * 0.38, height * 0.54, 90, 65);
  drawPlant(ctx, width * 0.86, height * 0.38, 55, 85);
}

// ============================================================
//  场景物件
// ============================================================

/**
 * 窗户 - 带蓝天白云和阳光
 */
function drawWindow(ctx, x, y, w, h) {
  // 窗框外框
  ctx.fillStyle = '#E8D5C4';
  ctx.fillRect(x - 6, y - 6, w + 12, h + 12);

  // 天空背景
  const skyGrad = ctx.createLinearGradient(x, y, x, y + h);
  skyGrad.addColorStop(0, COLORS.skyTop);
  skyGrad.addColorStop(0.6, '#B0DDF5');
  skyGrad.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(x, y, w, h);

  // 云朵
  drawCloud(ctx, x + 20, y + 25, 35);
  drawCloud(ctx, x + 75, y + 55, 25);
  drawCloud(ctx, x + 15, y + 80, 20);

  // 阳光光束
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#FFE082';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.7, y);
  ctx.lineTo(x + w + 30, y + h * 0.6);
  ctx.lineTo(x + w + 30, y + h * 1.2);
  ctx.lineTo(x + w * 0.3, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 窗格分隔线
  ctx.strokeStyle = '#D4B896';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.moveTo(x, y + h / 2);
  ctx.lineTo(x + w, y + h / 2);
  ctx.stroke();

  // 玻璃反光
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x + 4, y + 4, w / 2 - 6, h / 2 - 6);

  // 窗台
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(x - 6, y + h, w + 12, 10);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x - 4, y + h, w + 8, 5);
}

/**
 * 云朵
 */
function drawCloud(ctx, cx, cy, size) {
  ctx.fillStyle = COLORS.cloud;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  ctx.arc(cx + size * 0.3, cy - size * 0.15, size * 0.35, 0, Math.PI * 2);
  ctx.arc(cx + size * 0.55, cy, size * 0.4, 0, Math.PI * 2);
  ctx.arc(cx + size * 0.25, cy + size * 0.1, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 时钟 - 带数字刻度
 */
function drawClock(ctx, x, y, radius) {
  // 阴影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.arc(x + 2, y + 3, radius, 0, Math.PI * 2);
  ctx.fill();

  // 钟面
  ctx.fillStyle = '#FFFEF9';
  ctx.strokeStyle = '#5C4B3A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 数字
  ctx.fillStyle = '#5C4B3A';
  ctx.font = 'bold 9px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    const dist = radius * 0.7;
    ctx.fillText(i.toString(), x + Math.cos(angle) * dist, y + Math.sin(angle) * dist);
  }

  // 时针 (指向9)
  ctx.strokeStyle = '#3D3226';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  const hAngle = (9 * Math.PI) / 6 + (20 * Math.PI) / 360 - Math.PI / 2;
  ctx.lineTo(x + Math.cos(hAngle) * radius * 0.45, y + Math.sin(hAngle) * radius * 0.45);
  ctx.stroke();

  // 分针 (指向4)
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  const mAngle = (20 * Math.PI) / 30 - Math.PI / 2;
  ctx.lineTo(x + Math.cos(mAngle) * radius * 0.65, y + Math.sin(mAngle) * radius * 0.65);
  ctx.stroke();

  // 中心点
  ctx.fillStyle = '#E03131';
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 励志海报
 */
function drawPoster(ctx, x, y, w, h) {
  // 海报边框
  ctx.fillStyle = '#FFFEF9';
  ctx.strokeStyle = '#D4B896';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 3);
  ctx.fill();
  ctx.stroke();

  // 装饰色条
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(x + 8, y + 8, 4, h - 16);

  // 文字
  ctx.fillStyle = '#343A40';
  ctx.font = 'bold 11px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('今天', x + w / 2 + 4, y + 22);
  ctx.fillText('也要', x + w / 2 + 4, y + 42);
  ctx.fillText('努力', x + w / 2 + 4, y + 62);
  ctx.fillText('工作!', x + w / 2 + 4, y + 82);

  // 小装饰
  ctx.fillStyle = '#FFD43B';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 4, y + h - 22, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF922B';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 4, y + h - 22, 6, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 办公桌 - 带木纹
 */
function drawDesk(ctx, x, y, w, h) {
  const deskTopH = h * 0.15;

  // 桌腿
  ctx.fillStyle = COLORS.deskLeg;
  ctx.fillRect(x + 15, y + deskTopH, 14, h * 0.85);
  ctx.fillRect(x + w - 29, y + deskTopH, 14, h * 0.85);

  // 左右侧板
  ctx.fillStyle = COLORS.deskEdge;
  ctx.fillRect(x + 3, y + deskTopH, 12, h * 0.85);
  ctx.fillRect(x + w - 15, y + deskTopH, 12, h * 0.85);

  // 横梁
  ctx.fillStyle = COLORS.deskLeg;
  ctx.fillRect(x + 10, y + h * 0.55, w - 20, 6);

  // 桌面
  const topGrad = ctx.createLinearGradient(0, y, 0, y + deskTopH);
  topGrad.addColorStop(0, COLORS.deskTop);
  topGrad.addColorStop(1, COLORS.deskEdge);
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - 5, y + deskTopH);
  ctx.lineTo(x + 5, y + deskTopH);
  ctx.closePath();
  ctx.fill();

  // 桌面高光边缘
  ctx.fillStyle = COLORS.deskHighlight;
  ctx.fillRect(x + 10, y + 2, w - 20, 3);

  // 木纹纹理
  ctx.strokeStyle = 'rgba(139,99,64,0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const ly = y + 6 + i * (deskTopH - 6) / 5 + Math.sin(i * 1.7) * 2;
    ctx.beginPath();
    ctx.moveTo(x + 20, ly);
    ctx.lineTo(x + w - 25, ly);
    ctx.stroke();
  }
}

/**
 * 电脑 - 带屏幕发光
 */
function drawComputer(ctx, x, y, w, h) {
  // 底座
  ctx.fillStyle = '#3D3D3D';
  ctx.beginPath();
  ctx.roundRect(x + w / 2 - 35, y + h + 10, 70, 7, 4);
  ctx.fill();

  // 支架
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x + w / 2 - 10, y + h - 5, 20, 20);

  // 显示器外框
  ctx.fillStyle = '#2C2C2C';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // 屏幕
  ctx.fillStyle = '#1A1A2E';
  ctx.beginPath();
  ctx.roundRect(x + 6, y + 6, w - 12, h - 12, 3);
  ctx.fill();

  // 屏幕内容 - 代码编辑器
  ctx.fillStyle = '#50FA7B';
  ctx.font = '9px "Courier New", monospace';
  ctx.textAlign = 'left';
  const lines = [
    'def work():',
    '  while True:',
    '    look_busy()',
    '    if boss_near:',
    '      alt_tab()',
    '    else:',
    '      browse_weibo()',
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, x + 11, y + 20 + i * 11);
  });

  // 屏幕状态栏
  ctx.fillStyle = '#2C2C2C';
  ctx.fillRect(x + 6, y + h - 16, w - 12, 10);
  ctx.fillStyle = '#888';
  ctx.font = '7px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('摸鱼模式 v2.0', x + w - 14, y + h - 8);

  // 屏幕微光
  ctx.fillStyle = 'rgba(80,250,123,0.03)';
  ctx.beginPath();
  ctx.roundRect(x + 8, y + 8, w / 3, h / 3, 2);
  ctx.fill();

  // 状态LED
  ctx.fillStyle = '#51CF66';
  ctx.beginPath();
  ctx.arc(x + w - 10, y - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(81,207,102,0.3)';
  ctx.beginPath();
  ctx.arc(x + w - 10, y - 4, 6, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 咖啡杯 - 带蒸汽
 */
function drawCoffeeCup(ctx, x, y, w, h) {
  // 杯身阴影
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2 + 1, y + h * 0.6 + 2, w / 2, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // 杯身
  const cupGrad = ctx.createLinearGradient(x, y, x + w, y);
  cupGrad.addColorStop(0, '#F8F9FA');
  cupGrad.addColorStop(1, '#E9ECEF');
  ctx.fillStyle = cupGrad;
  ctx.fillRect(x, y, w, h * 0.6);

  // 杯口
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y, w / 2, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // 咖啡液面
  ctx.fillStyle = '#6B4226';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + 1, w / 2 - 2, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // 杯把
  ctx.strokeStyle = '#E9ECEF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + w + 2, y + h * 0.25, w * 0.4, 0, Math.PI * 1.2);
  ctx.stroke();

  // 蒸汽
  const now = Date.now() / 1000;
  for (let i = 0; i < 3; i++) {
    const sx = x + w / 2 - 5 + i * 5;
    const sy = y - 5 + Math.sin(now * 2 + i) * 8;
    ctx.fillStyle = 'rgba(200,200,210,0.6)';
    ctx.beginPath();
    ctx.arc(sx, sy, 3 + i * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 散落的文件
 */
function drawPapers(ctx, x, y, w, h) {
  // 文件1
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.08);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(0, 0, w * 0.7, h, 2);
  ctx.fill();
  ctx.stroke();
  // 文字线
  ctx.fillStyle = '#CED4DA';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(5, 5 + i * 8, w * 0.7 - 8 - i * 5, 3);
  }
  ctx.restore();

  // 文件2
  ctx.save();
  ctx.translate(x + 8, y + 6);
  ctx.rotate(-0.12);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#DEE2E6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(0, 0, w * 0.65, h, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#CED4DA';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(5, 5 + i * 10, w * 0.6 - 5, 3);
  }
  ctx.restore();
}

/**
 * 椅子 - 旋转办公椅
 */
function drawChair(ctx, x, y, w, h) {
  // 轮子
  for (let i = 0; i < 5; i++) {
    const cx = x + w * 0.15 + i * w * 0.175;
    ctx.fillStyle = '#3D3D3D';
    ctx.beginPath();
    ctx.arc(cx, y + h - 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 五星脚
  ctx.strokeStyle = '#4A4A4A';
  ctx.lineWidth = 3;
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
  ctx.fillStyle = '#5C5C5C';
  ctx.fillRect(x + w / 2 - 5, y + h * 0.45, 10, h * 0.3);

  // 座垫
  const seatGrad = ctx.createLinearGradient(0, y + h * 0.15, 0, y + h * 0.5);
  seatGrad.addColorStop(0, '#5A5A6E');
  seatGrad.addColorStop(1, '#4A4A5A');
  ctx.fillStyle = seatGrad;
  ctx.beginPath();
  ctx.roundRect(x + 5, y + h * 0.15, w - 10, h * 0.35, 8);
  ctx.fill();
  // 座垫高光
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.roundRect(x + 10, y + h * 0.17, w / 2 - 10, h * 0.15, 4);
  ctx.fill();

  // 靠背
  const backGrad = ctx.createLinearGradient(0, y - h * 0.35, 0, y + h * 0.15);
  backGrad.addColorStop(0, '#5A5A6E');
  backGrad.addColorStop(1, '#4A4A5A');
  ctx.fillStyle = backGrad;
  ctx.beginPath();
  ctx.roundRect(x + 10, y - h * 0.35, w - 20, h * 0.55, 6);
  ctx.fill();
}

/**
 * 植物 - 绿萝
 */
function drawPlant(ctx, x, y, w, h) {
  // 花盆
  const potTop = y + h * 0.5;
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

  // 花盆边沿
  ctx.fillStyle = '#E8946E';
  ctx.fillRect(x + w * 0.05, potTop - 4, w * 0.9, 8);

  // 花盆装饰线
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.2, potTop + h * 0.15);
  ctx.lineTo(x + w * 0.8, potTop + h * 0.15);
  ctx.stroke();

  // 叶片 - 用心形/椭圆表现
  const leaves = [
    { lx: x + w * 0.5, ly: potTop - 5, rx: 14, ry: 18, angle: -0.2, color: '#40C057' },
    { lx: x + w * 0.25, ly: potTop, rx: 12, ry: 22, angle: -0.6, color: '#51CF66' },
    { lx: x + w * 0.75, ly: potTop + 5, rx: 11, ry: 20, angle: 0.5, color: '#40C057' },
    { lx: x + w * 0.15, ly: potTop + 10, rx: 10, ry: 16, angle: -0.8, color: '#2F9E44' },
    { lx: x + w * 0.8, ly: potTop - 2, rx: 10, ry: 18, angle: 0.7, color: '#51CF66' },
    { lx: x + w * 0.5, ly: potTop - 18, rx: 12, ry: 16, angle: 0.1, color: '#69DB7C' },
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
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -leaf.ry * 0.7);
    ctx.lineTo(0, leaf.ry * 0.7);
    ctx.stroke();

    ctx.restore();
  });
}

// ============================================================
//  玩家角色 - 可爱Chibi风
// ============================================================

/**
 * 摸鱼状态的玩家 - 坐着玩手机
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - 角色中心x
 * @param {number} y - 角色底部y
 * @param {number} size - 角色大小基数
 * @param {number} idleAnim - 闲置动画参数 0-1
 */
export function drawPlayerIdle(ctx, x, y, size, idleAnim = 0) {
  const bounce = Math.sin(idleAnim * Math.PI * 2) * 2;
  const headR = size * 0.28;
  const bodyH = size * 0.55;
  const bodyW = size * 0.65;

  ctx.save();
  ctx.translate(x, y + bounce);

  // --- 腿（坐姿，仅露小腿） ---
  ctx.fillStyle = COLORS.playerPants;
  ctx.fillRect(-bodyW * 0.15, bodyH * 0.5, bodyW * 0.25, bodyH * 0.3);
  ctx.fillRect(bodyW * 0.2, bodyH * 0.5, bodyW * 0.25, bodyH * 0.3);

  // 鞋子
  ctx.fillStyle = '#343A40';
  ctx.beginPath();
  ctx.roundRect(-bodyW * 0.15 - 2, bodyH * 0.78, bodyW * 0.28, 7, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(bodyW * 0.2 - 2, bodyH * 0.78, bodyW * 0.28, 7, 4);
  ctx.fill();

  // --- 身体 ---
  const bodyGrad = ctx.createLinearGradient(0, 0, 0, bodyH);
  bodyGrad.addColorStop(0, COLORS.playerShirt);
  bodyGrad.addColorStop(1, '#5AA8E0');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-bodyW / 2, bodyH * 0.05, bodyW, bodyH * 0.55, 8);
  ctx.fill();

  // 领口
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.2, bodyH * 0.05);
  ctx.lineTo(0, bodyH * 0.2);
  ctx.lineTo(bodyW * 0.2, bodyH * 0.05);
  ctx.closePath();
  ctx.fill();

  // --- 手臂 ---
  // 左手（拿手机）
  ctx.fillStyle = COLORS.playerSkin;
  ctx.save();
  ctx.translate(-bodyW * 0.45, bodyH * 0.2);
  ctx.rotate(-0.25);
  ctx.beginPath();
  ctx.roundRect(-6, -4, 12, bodyH * 0.35, 6);
  ctx.fill();
  // 手
  ctx.beginPath();
  ctx.arc(0, bodyH * 0.35, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 右手（拿手机）
  ctx.save();
  ctx.translate(bodyW * 0.15, bodyH * 0.25);
  ctx.rotate(0.3);
  ctx.beginPath();
  ctx.roundRect(-6, -4, 12, bodyH * 0.25, 6);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, bodyH * 0.25, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 手机 ---
  const phoneX = -bodyW * 0.05;
  const phoneY = bodyH * 0.22;
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.roundRect(phoneX - 14, phoneY, 28, 44, 4);
  ctx.fill();
  // 手机屏幕
  ctx.fillStyle = '#74C0FC';
  ctx.beginPath();
  ctx.roundRect(phoneX - 11, phoneY + 3, 22, 36, 2);
  ctx.fill();
  // 屏幕内容 - 朋友圈
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '6px Arial';
  ctx.fillText('📱', phoneX, phoneY + 10);

  // --- 头部 ---
  // 头部阴影
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.beginPath();
  ctx.arc(0, -headR * 0.3, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头
  ctx.fillStyle = COLORS.playerSkin;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.1, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = COLORS.playerHair;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.3, headR + 2, Math.PI, Math.PI * 2);
  ctx.fill();
  // 刘海
  ctx.beginPath();
  ctx.arc(0, -headR * 0.15, headR - 2, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();
  // 发梢
  ctx.fillRect(-headR - 2, -headR * 0.3, headR * 2 + 4, headR * 0.25);

  // 眼睛 - 看手机
  ctx.fillStyle = '#1A1A2E';
  // 半眯眼
  ctx.beginPath();
  ctx.ellipse(-headR * 0.3, -headR * 0.2, 4.5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headR * 0.3, -headR * 0.2, 4.5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // 高光
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-headR * 0.3 - 1, -headR * 0.23, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.3 - 1, -headR * 0.23, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 腮红
  ctx.fillStyle = 'rgba(255,150,150,0.3)';
  ctx.beginPath();
  ctx.ellipse(-headR * 0.5, -headR * 0.05, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headR * 0.5, -headR * 0.05, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 微笑
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.05, headR * 0.22, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

/**
 * 认真工作状态的玩家 - 盯着电脑屏幕
 */
export function drawPlayerWorking(ctx, x, y, size) {
  const headR = size * 0.28;
  const bodyH = size * 0.55;
  const bodyW = size * 0.65;

  ctx.save();
  ctx.translate(x, y);

  // --- 腿 ---
  ctx.fillStyle = COLORS.playerPants;
  ctx.fillRect(-bodyW * 0.15, bodyH * 0.5, bodyW * 0.25, bodyH * 0.3);
  ctx.fillRect(bodyW * 0.2, bodyH * 0.5, bodyW * 0.25, bodyH * 0.3);
  ctx.fillStyle = '#343A40';
  ctx.beginPath();
  ctx.roundRect(-bodyW * 0.15 - 2, bodyH * 0.78, bodyW * 0.28, 7, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(bodyW * 0.2 - 2, bodyH * 0.78, bodyW * 0.28, 7, 4);
  ctx.fill();

  // --- 身体 ---
  const bodyGrad = ctx.createLinearGradient(0, 0, 0, bodyH);
  bodyGrad.addColorStop(0, COLORS.playerShirt);
  bodyGrad.addColorStop(1, '#5AA8E0');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-bodyW / 2, bodyH * 0.05, bodyW, bodyH * 0.55, 8);
  ctx.fill();

  // 领口
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.2, bodyH * 0.05);
  ctx.lineTo(0, bodyH * 0.2);
  ctx.lineTo(bodyW * 0.2, bodyH * 0.05);
  ctx.closePath();
  ctx.fill();

  // --- 手臂（打字姿势） ---
  ctx.fillStyle = COLORS.playerSkin;
  // 左臂
  ctx.save();
  ctx.translate(-bodyW * 0.4, bodyH * 0.15);
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.roundRect(-6, -4, 12, bodyH * 0.3, 6);
  ctx.fill();
  ctx.restore();

  // 右臂
  ctx.save();
  ctx.translate(bodyW * 0.4, bodyH * 0.15);
  ctx.rotate(0.4);
  ctx.beginPath();
  ctx.roundRect(-6, -4, 12, bodyH * 0.3, 6);
  ctx.fill();
  ctx.restore();

  // 手
  ctx.fillStyle = COLORS.playerSkin;
  ctx.beginPath();
  ctx.arc(-bodyW * 0.15, bodyH * 0.35, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bodyW * 0.15, bodyH * 0.35, 7, 0, Math.PI * 2);
  ctx.fill();

  // --- 头部 ---
  ctx.fillStyle = COLORS.playerSkin;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.1, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = COLORS.playerHair;
  ctx.beginPath();
  ctx.arc(0, -headR * 0.3, headR + 2, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -headR * 0.15, headR - 2, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();
  ctx.fillRect(-headR - 2, -headR * 0.3, headR * 2 + 4, headR * 0.25);

  // 眼睛 - 瞪大看屏幕
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-headR * 0.3, -headR * 0.2, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.3, -headR * 0.2, 5.5, 0, Math.PI * 2);
  ctx.fill();
  // 瞳孔
  ctx.fillStyle = '#1A1A2E';
  ctx.beginPath();
  ctx.arc(-headR * 0.32, -headR * 0.2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.28, -headR * 0.2, 3, 0, Math.PI * 2);
  ctx.fill();
  // 高光
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-headR * 0.32 - 1, -headR * 0.23, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headR * 0.28 - 1, -headR * 0.23, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 嘴（紧抿）
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-headR * 0.2, -headR * 0.02);
  ctx.lineTo(headR * 0.2, -headR * 0.02);
  ctx.stroke();

  // 汗滴（紧张时）
  ctx.fillStyle = '#87CEEB';
  ctx.beginPath();
  ctx.moveTo(headR * 0.6, -headR * 0.45);
  ctx.quadraticCurveTo(headR * 0.65, -headR * 0.25, headR * 0.6, -headR * 0.25);
  ctx.quadraticCurveTo(headR * 0.55, -headR * 0.25, headR * 0.6, -headR * 0.45);
  ctx.fill();

  ctx.restore();
}

// ============================================================
//  老板角色
// ============================================================

/**
 * 绘制老板 - 穿西装、拿着公文包
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - 左上角x
 * @param {number} y - 左上角y
 * @param {number} width - 宽度
 * @param {string} expression - 表情 ('angry'|'surprised'|'suspicious')
 */
export function drawBoss(ctx, x, y, width, expression) {
  const cx = x + width / 2;
  const h = width * 1.3;
  const headR = width * 0.22;
  const bodyTop = y + headR * 0.4;

  ctx.save();
  ctx.translate(cx, 0);

  // --- 腿部 ---
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(-width * 0.2, bodyTop + h * 0.55, width * 0.18, h * 0.3);
  ctx.fillRect(width * 0.02, bodyTop + h * 0.55, width * 0.18, h * 0.3);

  // 皮鞋
  ctx.fillStyle = '#1A1A2E';
  ctx.beginPath();
  ctx.roundRect(-width * 0.22, bodyTop + h * 0.84, width * 0.22, 8, 4);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(width * 0.0, bodyTop + h * 0.84, width * 0.22, 8, 4);
  ctx.fill();

  // --- 身体（西装） ---
  const suitGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + h * 0.6);
  suitGrad.addColorStop(0, COLORS.bossSuit);
  suitGrad.addColorStop(1, COLORS.bossSuitDark);
  ctx.fillStyle = suitGrad;
  ctx.beginPath();
  ctx.roundRect(-width * 0.32, bodyTop, width * 0.64, h * 0.58, 6);
  ctx.fill();

  // 衬衫
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-width * 0.08, bodyTop + 2);
  ctx.lineTo(-width * 0.12, bodyTop + h * 0.3);
  ctx.lineTo(width * 0.12, bodyTop + h * 0.3);
  ctx.lineTo(width * 0.08, bodyTop + 2);
  ctx.closePath();
  ctx.fill();

  // 领带
  ctx.fillStyle = COLORS.bossTie;
  ctx.beginPath();
  ctx.moveTo(0, bodyTop + h * 0.05);
  ctx.lineTo(-width * 0.06, bodyTop + h * 0.2);
  ctx.lineTo(0, bodyTop + h * 0.32);
  ctx.lineTo(width * 0.06, bodyTop + h * 0.2);
  ctx.closePath();
  ctx.fill();

  // --- 手臂 ---
  // 左手（拿公文包）
  ctx.fillStyle = COLORS.bossSuit;
  ctx.save();
  ctx.translate(-width * 0.3, bodyTop + h * 0.08);
  ctx.rotate(-0.15);
  ctx.beginPath();
  ctx.roundRect(-7, 0, 14, h * 0.35, 7);
  ctx.fill();
  ctx.restore();

  // 右手（指指点点）
  ctx.save();
  ctx.translate(width * 0.25, bodyTop + h * 0.10);
  ctx.rotate(0.4);
  ctx.fillStyle = COLORS.bossSuit;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, h * 0.28, 6);
  ctx.fill();
  // 手
  ctx.fillStyle = COLORS.bossSkin;
  ctx.beginPath();
  ctx.arc(0, h * 0.28, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 公文包 ---
  ctx.fillStyle = '#6B4226';
  ctx.beginPath();
  ctx.roundRect(-width * 0.38, bodyTop + h * 0.35, width * 0.22, h * 0.15, 3);
  ctx.fill();
  ctx.fillStyle = '#8B5E3C';
  ctx.fillRect(-width * 0.38, bodyTop + h * 0.35, width * 0.22, 4);
  // 提手
  ctx.strokeStyle = '#6B4226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-width * 0.27, bodyTop + h * 0.35, width * 0.09, Math.PI, Math.PI * 2);
  ctx.stroke();

  // --- 头部 ---
  ctx.fillStyle = COLORS.bossSkin;
  ctx.beginPath();
  ctx.arc(0, y + headR * 0.6 - headR * 0.1, headR, 0, Math.PI * 2);
  ctx.fill();

  // 头发（大背头）
  ctx.fillStyle = COLORS.bossHair;
  ctx.beginPath();
  ctx.arc(0, y + headR * 0.35 - headR * 0.1, headR + 1, Math.PI, Math.PI * 2.1);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, y + headR * 0.5 - headR * 0.1, headR - 2, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();
  ctx.fillRect(-headR - 2, y + headR * 0.3 - headR * 0.1, headR * 2 + 4, headR * 0.3);

  // 眼睛（根据表情不同）
  const eyeY = y + headR * 0.55 - headR * 0.1;

  if (expression === 'angry') {
    // 愤怒的三角眼
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.moveTo(-headR * 0.45, eyeY);
    ctx.lineTo(-headR * 0.15, eyeY + 5);
    ctx.lineTo(-headR * 0.05, eyeY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(headR * 0.45, eyeY);
    ctx.lineTo(headR * 0.15, eyeY + 5);
    ctx.lineTo(headR * 0.05, eyeY);
    ctx.closePath();
    ctx.fill();
    // 瞳孔（小点）
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-headR * 0.25, eyeY + 1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.32, eyeY + 1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (expression === 'surprised') {
    // 惊讶的大圆眼
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-headR * 0.28, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.35, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.arc(-headR * 0.28, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.35, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 怀疑的半眯眼
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath();
    ctx.ellipse(-headR * 0.3, eyeY, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headR * 0.35, eyeY, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-headR * 0.3 - 1, eyeY - 1, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headR * 0.35 - 1, eyeY - 1, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 眉毛
  ctx.strokeStyle = '#1A1A2E';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  if (expression === 'angry') {
    // 愤怒眉毛（倒八字）
    ctx.beginPath();
    ctx.moveTo(-headR * 0.5, eyeY - 9);
    ctx.lineTo(-headR * 0.1, eyeY - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headR * 0.5, eyeY - 9);
    ctx.lineTo(headR * 0.1, eyeY - 4);
    ctx.stroke();
  } else if (expression === 'surprised') {
    // 惊讶眉毛（高挑）
    ctx.beginPath();
    ctx.moveTo(-headR * 0.4, eyeY - 10);
    ctx.lineTo(-headR * 0.15, eyeY - 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headR * 0.4, eyeY - 10);
    ctx.lineTo(headR * 0.15, eyeY - 6);
    ctx.stroke();
  } else {
    // 怀疑眉毛（一高一低）
    ctx.beginPath();
    ctx.moveTo(-headR * 0.4, eyeY - 6);
    ctx.lineTo(-headR * 0.15, eyeY - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headR * 0.45, eyeY - 8);
    ctx.lineTo(headR * 0.2, eyeY - 6);
    ctx.stroke();
  }

  // 嘴巴
  const mouthY = y + headR * 0.8 - headR * 0.1;
  ctx.strokeStyle = '#8B6340';
  ctx.lineWidth = 2;
  if (expression === 'angry') {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.2, mouthY);
    ctx.lineTo(headR * 0.2, mouthY);
    ctx.stroke();
  } else if (expression === 'surprised') {
    ctx.beginPath();
    ctx.arc(0, mouthY + 2, headR * 0.18, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.15, mouthY);
    ctx.quadraticCurveTo(0, mouthY + 5, headR * 0.15, mouthY);
    ctx.stroke();
  }

  // 皱纹（生气时额头青筋）
  if (expression === 'angry') {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    const wrinkleY = y + headR * 0.2 - headR * 0.1;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-headR * 0.25, wrinkleY + i * 5);
      ctx.quadraticCurveTo(0, wrinkleY + i * 5 + 2, headR * 0.25, wrinkleY + i * 5);
      ctx.stroke();
    }
    // 青筋符号
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.font = '10px Arial';
    ctx.fillText('💢', headR * 0.55, y + headR * 0.2 - headR * 0.1);
  }

  ctx.restore();
}

// ============================================================
//  警告进度条
// ============================================================

/**
 * 绘制屏幕边缘警告边框（老板出现时）
 */
export function drawWarningVignette(ctx, width, height, progress) {
  // 边缘红色渐变
  const alpha = Math.min(progress * 0.6, 0.35);

  // 顶部
  const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.08);
  topGrad.addColorStop(0, `rgba(231,76,60,${alpha})`);
  topGrad.addColorStop(1, 'rgba(231,76,60,0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, height * 0.08);

  // 底部
  const botGrad = ctx.createLinearGradient(0, height, 0, height * 0.92);
  botGrad.addColorStop(0, `rgba(231,76,60,${alpha})`);
  botGrad.addColorStop(1, 'rgba(231,76,60,0)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, height * 0.92, width, height * 0.08);

  // 左侧
  const leftGrad = ctx.createLinearGradient(0, 0, width * 0.04, 0);
  leftGrad.addColorStop(0, `rgba(231,76,60,${alpha})`);
  leftGrad.addColorStop(1, 'rgba(231,76,60,0)');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(0, 0, width * 0.04, height);

  // 右侧
  const rightGrad = ctx.createLinearGradient(width, 0, width * 0.96, 0);
  rightGrad.addColorStop(0, `rgba(231,76,60,${alpha})`);
  rightGrad.addColorStop(1, 'rgba(231,76,60,0)');
  ctx.fillStyle = rightGrad;
  ctx.fillRect(width * 0.96, 0, width * 0.04, height);
}

/**
 * 绘制警告倒计时条
 */
export function drawWarningBar(ctx, x, y, width, height, progress) {
  // 背景
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, height / 2);
  ctx.fill();

  // 进度条
  const barWidth = Math.max(width * progress, 0);
  if (barWidth > 0) {
    const grad = ctx.createLinearGradient(x, y, x + barWidth, y);
    if (progress < 0.5) {
      grad.addColorStop(0, '#51CF66');
      grad.addColorStop(1, '#40C057');
    } else if (progress < 0.8) {
      grad.addColorStop(0, '#FFD43B');
      grad.addColorStop(1, '#FAB005');
    } else {
      grad.addColorStop(0, '#FF6B6B');
      grad.addColorStop(1, '#E03131');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, height, height / 2);
    ctx.fill();
  }

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, height / 2);
  ctx.stroke();

  // 倒计时文字
  const remaining = Math.max((1 - progress) * 1.2, 0);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${height - 6}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 脉冲效果 (最后0.3秒)
  const pulse = progress > 0.75 ? Math.sin(Date.now() / 1000 * 10) * 0.3 + 0.7 : 1;
  ctx.globalAlpha = pulse;
  ctx.fillText(`${remaining.toFixed(1)}s`, x + width / 2, y + height / 2);
  ctx.globalAlpha = 1;
}
