/**
 * scene.js - 场景绘制模块
 * 绘制办公室场景和背景
 */

/**
 * 绘制办公室背景
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 */
export function drawOfficeBackground(ctx, width, height) {
  // 绘制墙壁
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  // 绘制墙纸纹理
  ctx.fillStyle = '#e8e8e8';
  for (let y = 0; y < height; y += 40) {
    for (let x = 0; x < width; x += 40) {
      if ((x + y) % 80 === 0) {
        ctx.fillRect(x, y, 20, 20);
      }
    }
  }

  // 绘制地板
  const floorY = height * 0.7;
  const gradient = ctx.createLinearGradient(0, floorY, 0, height);
  gradient.addColorStop(0, '#8B7355');
  gradient.addColorStop(1, '#6B5B45');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, floorY, width, height - floorY);

  // 绘制地板纹理
  ctx.strokeStyle = '#5B4B35';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, floorY);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 绘制窗户
  drawWindow(ctx, width * 0.15, height * 0.1, 120, 150);

  // 绘制时钟
  drawClock(ctx, width * 0.75, height * 0.12, 40);

  // 绘制办公桌
  drawDesk(ctx, width * 0.2, height * 0.45, width * 0.6, 120);

  // 绘制电脑
  drawComputer(ctx, width * 0.35, height * 0.3, 150, 100);

  // 绘制椅子
  drawChair(ctx, width * 0.4, height * 0.55, 80, 60);

  // 绘制植物
  drawPlant(ctx, width * 0.85, height * 0.4, 50, 80);
}

/**
 * 绘制窗户
 */
function drawWindow(ctx, x, y, w, h) {
  // 窗框
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(x - 5, y - 5, w + 10, h + 10);

  // 窗户玻璃
  const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.5, '#B0E0E6');
  gradient.addColorStop(1, '#87CEEB');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);

  // 窗户分隔线
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

  // 窗户高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(x + 10, y + 10, w / 3, h / 3);
}

/**
 * 绘制时钟
 */
function drawClock(ctx, x, y, radius) {
  // 钟表背景
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 钟表刻度
  ctx.fillStyle = '#333';
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    const innerRadius = radius * 0.8;
    const outerRadius = radius * 0.9;
    ctx.beginPath();
    ctx.moveTo(
      x + Math.cos(angle) * innerRadius,
      y + Math.sin(angle) * innerRadius
    );
    ctx.lineTo(
      x + Math.cos(angle) * outerRadius,
      y + Math.sin(angle) * outerRadius
    );
    ctx.stroke();
  }

  // 钟表指针（固定时间：9:05，表示上班时间）
  // 时针
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const hourAngle = (9 * Math.PI) / 6 + (5 * Math.PI) / 360 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + Math.cos(hourAngle) * radius * 0.5,
    y + Math.sin(hourAngle) * radius * 0.5
  );
  ctx.stroke();

  // 分针
  ctx.lineWidth = 2;
  const minuteAngle = (5 * Math.PI) / 30 - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + Math.cos(minuteAngle) * radius * 0.7,
    y + Math.sin(minuteAngle) * radius * 0.7
  );
  ctx.stroke();

  // 中心点
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 绘制办公桌
 */
function drawDesk(ctx, x, y, w, h) {
  // 桌面
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(x, y, w, h * 0.2);

  // 桌腿
  ctx.fillStyle = '#6B5B45';
  ctx.fillRect(x + 20, y + h * 0.2, 15, h * 0.8);
  ctx.fillRect(x + w - 35, y + h * 0.2, 15, h * 0.8);

  // 桌面高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(x + 5, y + 2, w - 10, h * 0.1);
}

/**
 * 绘制电脑
 */
function drawComputer(ctx, x, y, w, h) {
  // 显示器
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, w, h);

  // 屏幕
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);

  // 屏幕内容（模拟代码）
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  const lines = [
    'function work() {',
    '  // TODO: 假装在写代码',
    '  return "摸鱼";',
    '}',
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, x + 15, y + 25 + i * 15);
  });

  // 显示器支架
  ctx.fillStyle = '#333';
  ctx.fillRect(x + w / 2 - 15, y + h, 30, 20);
  ctx.fillRect(x + w / 2 - 30, y + h + 20, 60, 5);

  // 屏幕高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(x + 15, y + 15, w / 3, h / 3);
}

/**
 * 绘制椅子
 */
function drawChair(ctx, x, y, w, h) {
  // 椅子座位
  ctx.fillStyle = '#555';
  ctx.fillRect(x, y, w, h * 0.4);

  // 椅子靠背
  ctx.fillStyle = '#444';
  ctx.fillRect(x + 10, y - h * 0.5, w - 20, h * 0.5);

  // 椅子腿
  ctx.fillStyle = '#333';
  ctx.fillRect(x + 10, y + h * 0.4, 8, h * 0.6);
  ctx.fillRect(x + w - 18, y + h * 0.4, 8, h * 0.6);

  // 椅子轮子
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(x + 14, y + h, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w - 14, y + h, 5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 绘制植物
 */
function drawPlant(ctx, x, y, w, h) {
  // 花盆
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.6);
  ctx.lineTo(x + w, y + h * 0.6);
  ctx.lineTo(x + w * 0.8, y + h);
  ctx.lineTo(x + w * 0.2, y + h);
  ctx.closePath();
  ctx.fill();

  // 植物叶子
  ctx.fillStyle = '#228B22';
  const leafPositions = [
    { x: x + w * 0.5, y: y + h * 0.3 },
    { x: x + w * 0.3, y: y + h * 0.4 },
    { x: x + w * 0.7, y: y + h * 0.4 },
    { x: x + w * 0.2, y: y + h * 0.5 },
    { x: x + w * 0.8, y: y + h * 0.5 },
  ];

  leafPositions.forEach(pos => {
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, 15, 25, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  });

  // 叶子高光
  ctx.fillStyle = 'rgba(100, 200, 100, 0.5)';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.5, y + h * 0.25, 10, 18, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 绘制摸鱼状态的玩家
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 玩家x坐标
 * @param {number} y - 玩家y坐标
 * @param {number} size - 玩家大小
 */
export function drawPlayerIdle(ctx, x, y, size) {
  // 身体
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x - size / 2, y, size, size * 1.2);

  // 头部
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.4, Math.PI, Math.PI * 2);
  ctx.fill();

  // 眼睛（摸鱼时在玩手机）
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x - size * 0.12, y - size * 0.3, 3, 0, Math.PI * 2);
  ctx.arc(x + size * 0.12, y - size * 0.3, 3, 0, Math.PI * 2);
  ctx.fill();

  // 微笑
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y - size * 0.2, size * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // 手机
  ctx.fillStyle = '#333';
  ctx.fillRect(x - size * 0.5, y + size * 0.2, size * 0.3, size * 0.5);
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x - size * 0.48, y + size * 0.22, size * 0.26, size * 0.46);
}

/**
 * 绘制工作状态的玩家
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 玩家x坐标
 * @param {number} y - 玩家y坐标
 * @param {number} size - 玩家大小
 */
export function drawPlayerWorking(ctx, x, y, size) {
  // 身体
  ctx.fillStyle = '#4a9eff';
  ctx.fillRect(x - size / 2, y, size, size * 1.2);

  // 头部
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // 头发
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.4, Math.PI, Math.PI * 2);
  ctx.fill();

  // 眼睛（假装认真看电脑）
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x - size * 0.12, y - size * 0.3, 4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.12, y - size * 0.3, 4, 0, Math.PI * 2);
  ctx.fill();

  // 紧张的表情
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size * 0.15, y - size * 0.15);
  ctx.lineTo(x + size * 0.15, y - size * 0.15);
  ctx.stroke();

  // 汗滴
  ctx.fillStyle = '#87CEEB';
  ctx.beginPath();
  ctx.ellipse(x + size * 0.35, y - size * 0.1, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 打字的手
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.ellipse(x - size * 0.3, y + size * 0.4, 8, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + size * 0.3, y + size * 0.4, 8, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 绘制老板
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - 老板x坐标
 * @param {number} y - 老板y坐标
 * @param {number} size - 老板大小
 * @param {string} expression - 表情
 */
export function drawBoss(ctx, x, y, size, expression) {
  // 身体（西装）
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(x - size / 2, y, size, size * 1.3);

  // 领带
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.1);
  ctx.lineTo(x - size * 0.08, y + size * 0.5);
  ctx.lineTo(x, y + size * 0.6);
  ctx.lineTo(x + size * 0.08, y + size * 0.5);
  ctx.closePath();
  ctx.fill();

  // 头部
  ctx.fillStyle = '#ffd4a0';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.3, size * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // 头发（向后梳）
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.45, Math.PI * 0.8, Math.PI * 2.2);
  ctx.fill();

  // 眼睛（根据表情）
  ctx.fillStyle = '#333';
  if (expression === 'angry') {
    // 生气的眼睛
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();

    // 皱眉
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
    // 惊讶的眼睛
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.3, 6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.3, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 怀疑的眼睛
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.3, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 嘴巴
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  if (expression === 'angry') {
    // 生气的嘴巴
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, y - size * 0.1);
    ctx.lineTo(x + size * 0.2, y - size * 0.1);
    ctx.stroke();
  } else if (expression === 'surprised') {
    // 惊讶的嘴巴
    ctx.beginPath();
    ctx.arc(x, y - size * 0.08, size * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // 怀疑的嘴巴
    ctx.beginPath();
    ctx.arc(x, y - size * 0.1, size * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  }

  // 公文包
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + size * 0.3, y + size * 0.2, size * 0.3, size * 0.4);
  ctx.fillStyle = '#654321';
  ctx.fillRect(x + size * 0.3, y + size * 0.2, size * 0.3, size * 0.05);
}

/**
 * 绘制警告进度条
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - x坐标
 * @param {number} y - y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} progress - 进度 (0-1)
 */
export function drawWarningBar(ctx, x, y, width, height, progress) {
  // 背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(x, y, width, height);

  // 进度条
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, '#2ecc71');
  gradient.addColorStop(0.5, '#f1c40f');
  gradient.addColorStop(1, '#e74c3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width * progress, height);

  // 边框
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // 倒计时文字
  const remaining = (1 - progress) * 1.2;
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${height - 4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${remaining.toFixed(1)}s`, x + width / 2, y + height / 2);
}
