/**
 * ui.js - UI绘制模块
 * 绘制菜单页、游戏HUD、结算页和粒子效果
 */

import { COLORS, drawShadow, drawRoundedButton, drawHighlight, drawEmoji, formatTime, formatScore, getTitle, roundRectPath } from './utils.js';
import { GameStatus, PlayerStatus } from './gameState.js';
import { getStatusText } from './player.js';
import { drawWarningVignette, drawWarningBar } from './scene.js';

// ============================================================
//  菜单页面
// ============================================================

/**
 * 绘制菜单页面
 */
export function drawMenuPage(ctx, width, height, button, time = 0) {
  // 暖色渐变背景
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, COLORS.menuGradTop);
  bgGrad.addColorStop(0.5, '#FFB347');
  bgGrad.addColorStop(1, COLORS.menuGradBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 顶部装饰弧线
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.ellipse(width / 2, -height * 0.02, width * 0.7, height * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // 底部装饰弧线
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.ellipse(width / 2, height * 1.02, width * 0.8, height * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- 装饰图标区 ---
  // 电脑图标
  const decorY = height * 0.48;
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.roundRect(width * 0.1, decorY, 65, 48, 4);
  ctx.fill();
  ctx.fillRect(width * 0.1 + 22, decorY + 48, 20, 12);
  // 屏幕内容
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(width * 0.1 + 5, decorY + 5, 55, 35);

  // 手机图标
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.roundRect(width * 0.78, decorY + 10, 30, 48, 5);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(width * 0.78 + 3, decorY + 13, 24, 36);

  // 咖啡图标
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.arc(width * 0.18, decorY + 70, 22, 0, Math.PI * 2);
  ctx.fill();
  // 杯把
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(width * 0.18 + 22, decorY + 65, 10, 0, Math.PI * 1.2);
  ctx.stroke();

  // 时钟图标
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.arc(width * 0.85, decorY + 70, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.85, decorY + 70);
  ctx.lineTo(width * 0.85, decorY + 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width * 0.85, decorY + 70);
  ctx.lineTo(width * 0.85 + 10, decorY + 70);
  ctx.stroke();

  // 散落的emoji装饰
  const emojis = [
    { e: '☕', x: 0.15, y: 0.68, s: 22 },
    { e: '💼', x: 0.82, y: 0.72, s: 24 },
    { e: '📄', x: 0.72, y: 0.62, s: 20 },
    { e: '😴', x: 0.12, y: 0.78, s: 26 },
    { e: '🖥️', x: 0.88, y: 0.62, s: 20 },
  ];
  emojis.forEach(({ e, x, y, s }) => {
    drawEmoji(ctx, e, width * x, height * y, s);
  });

  // --- 标题 ---
  // 标题阴影
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.font = 'bold 52px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('老板来了', width / 2 + 3, height * 0.18 + 3);

  // 标题主体 - 白色带描边
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 4;
  ctx.strokeText('老板来了', width / 2, height * 0.18);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('老板来了', width / 2, height * 0.18);

  // 标题下方装饰线
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 80, height * 0.22);
  ctx.lineTo(width / 2 + 80, height * 0.22);
  ctx.stroke();
  // 装饰点
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(width / 2, height * 0.22, 5, 0, Math.PI * 2);
  ctx.fill();

  // 副标题
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '20px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('上班摸鱼醒脑神器', width / 2, height * 0.28);

  // --- 游戏说明卡片 ---
  const cardW = width * 0.7;
  const cardH = 70;
  const cardX = (width - cardW) / 2;
  const cardY = height * 0.33;

  ctx.fillStyle = COLORS.menuCard;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚠️ 老板会随机出现，快速点击伪装按钮！', width / 2, cardY + cardH * 0.37);
  ctx.fillText('⏱ 反应太慢就会被抓包哦~', width / 2, cardY + cardH * 0.7);

  // --- 开始按钮 ---
  drawRoundedButton(ctx, button, '开始摸鱼', COLORS.btnPrimary, {
    fontSize: 26,
  });

  // --- 底部文字 ---
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '13px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('适合上班摸鱼时玩的30秒醒脑小游戏', width / 2, height * 0.88);
}

// ============================================================
//  游戏页面UI
// ============================================================

/**
 * 绘制游戏页面HUD
 */
export function drawGameUI(ctx, width, height, state, button) {
  // 老板可见时绘制屏幕边缘警告和倒计时条
  if (state.bossVisible) {
    const progress = Math.min(
      (Date.now() / 1000 - state.bossAppearTime) / state.bossTimeout,
      1
    );

    // 屏幕边缘红色警告光晕
    drawWarningVignette(ctx, width, height, progress);

    // 警告进度条
    const barWidth = width * 0.65;
    const barHeight = 26;
    const barX = (width - barWidth) / 2;
    const barY = height * 0.86;
    drawWarningBar(ctx, barX, barY, barWidth, barHeight, progress);
  }

  // 顶部信息栏
  drawTopBar(ctx, width, height, state);

  // 状态提示文字
  if (state.message) {
    drawMessage(ctx, width, height, state.message);
  }

  // 伪装工作按钮
  const bossVisible = state.bossVisible;
  const pulse = state.buttonPulse || 0;

  if (bossVisible) {
    // 紧急状态 - 红色脉冲按钮
    const pulseScale = 1 + Math.sin(pulse * Math.PI * 2) * 0.1;
    const cx = button.x + button.width / 2;
    const cy = button.y + button.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulseScale, pulseScale);
    ctx.translate(-cx, -cy);

    drawRoundedButton(ctx, button, '伪装工作！', COLORS.btnDanger, {
      fontSize: 24,
      pulse: Math.abs(Math.sin(pulse * Math.PI * 2)),
    });

    ctx.restore();
  } else {
    // 正常状态 - 灰色禁用按钮
    drawRoundedButton(ctx, button, '伪装工作', COLORS.btnDisabled, {
      fontSize: 22,
    });
  }

  // 绘制浮动分数
  drawScorePopups(ctx, state.scorePopups || []);
}

/**
 * 绘制顶部信息栏 - 玻璃态效果
 */
function drawTopBar(ctx, width, height, state) {
  const barH = 56;

  // 玻璃态背景
  ctx.fillStyle = COLORS.uiGlass;
  ctx.fillRect(0, 0, width, barH);

  // 底部边框
  ctx.strokeStyle = COLORS.uiGlassBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, barH);
  ctx.lineTo(width, barH);
  ctx.stroke();

  // 顶部高光
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, 0, width, barH / 2);

  const textY = barH / 2;

  // 倒计时
  const timeLeft = state.remainingTime;
  const timeUrgent = timeLeft <= 5;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  if (timeUrgent) {
    // 紧急时红色脉冲
    const pulse = Math.sin(Date.now() / 1000 * 6) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255,107,107,${pulse})`;
  } else {
    ctx.fillStyle = '#FFFFFF';
  }
  ctx.font = 'bold 20px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(`⏱ ${formatTime(timeLeft)}`, 16, textY);

  // 分数 - 金色
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.scoreGold;
  ctx.font = 'bold 22px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';

  // 分数发光效果
  ctx.shadowColor = COLORS.scoreGoldGlow;
  ctx.shadowBlur = 8;
  ctx.fillText(`⭐ ${formatScore(state.score)}`, width / 2, textY);
  ctx.shadowBlur = 0;

  // Combo显示
  if (state.combo > 1) {
    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(`${state.combo}x COMBO!`, width / 2, barH - 8);
  }

  // 状态标签
  ctx.textAlign = 'right';
  const isIdle = state.playerStatus === PlayerStatus.IDLE;
  ctx.fillStyle = isIdle ? '#51CF66' : '#FFD43B';

  // 状态指示点
  const dotX = width - 90;
  ctx.beginPath();
  ctx.arc(dotX, textY, 5, 0, Math.PI * 2);
  ctx.fill();
  // 点光晕
  ctx.fillStyle = isIdle ? 'rgba(81,207,102,0.3)' : 'rgba(255,212,59,0.3)';
  ctx.beginPath();
  ctx.arc(dotX, textY, 9, 0, Math.PI * 2);
  ctx.fill();

  // 状态文字
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '15px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(getStatusText(state.playerStatus), width - 14, textY);
}

/**
 * 绘制浮动分数弹出
 */
function drawScorePopups(ctx, popups) {
  popups.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `bold ${18 * p.scale}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  });
}

/**
 * 绘制消息提示
 */
function drawMessage(ctx, width, height, message) {
  const paddingX = 28;
  const paddingY = 14;
  ctx.font = 'bold 20px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  const metrics = ctx.measureText(message);
  const msgW = metrics.width + paddingX * 2;
  const msgH = 46;
  const msgX = (width - msgW) / 2;
  const msgY = height * 0.14;

  // 消息背景（带阴影）
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.roundRect(msgX + 2, msgY + 3, msgW, msgH, msgH / 2);
  ctx.fill();

  // 主体
  const msgGrad = ctx.createLinearGradient(msgX, msgY, msgX, msgY + msgH);
  msgGrad.addColorStop(0, 'rgba(52,58,64,0.92)');
  msgGrad.addColorStop(1, 'rgba(33,37,41,0.92)');
  ctx.fillStyle = msgGrad;
  ctx.beginPath();
  ctx.roundRect(msgX, msgY, msgW, msgH, msgH / 2);
  ctx.fill();

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(msgX, msgY, msgW, msgH, msgH / 2);
  ctx.stroke();

  // 文字
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, width / 2, msgY + msgH / 2);
}

// ============================================================
//  结算页面
// ============================================================

/**
 * 绘制结算页面
 */
export function drawGameOverPage(ctx, width, height, state, button, displayScore = null) {
  const score = displayScore !== null ? displayScore : state.score;

  // 深色渐变背景
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, COLORS.gameOverGradTop);
  bgGrad.addColorStop(1, COLORS.gameOverGradBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 装饰圆
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.8, 120, 0, Math.PI * 2);
  ctx.fill();

  // --- 顶部标题区 ---
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('游戏结束', width / 2, height * 0.08);

  // --- 称号区 ---
  const title = getTitle(state.score);
  const titleY = height * 0.15;

  // 称号光晕
  ctx.fillStyle = 'rgba(255,215,0,0.15)';
  ctx.beginPath();
  ctx.arc(width / 2, titleY, 50, 0, Math.PI * 2);
  ctx.fill();

  drawEmoji(ctx, '🏆', width / 2, titleY - 8, 36);
  ctx.fillStyle = COLORS.scoreGold;
  ctx.font = 'bold 26px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(title, width / 2, titleY + 22);

  // --- 分数区 ---
  const scoreY = height * 0.24;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '16px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('最终得分', width / 2, scoreY);

  // 大分数
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 64px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(formatScore(score), width / 2, scoreY + 42);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '18px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('分', width / 2 + 50, scoreY + 42);

  // --- 统计卡片 ---
  const cardX = width * 0.1;
  const cardW = width * 0.8;
  const cardY = height * 0.40;
  const cardH = height * 0.25;

  // 卡片背景
  ctx.fillStyle = COLORS.resultCard;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.fill();

  ctx.strokeStyle = COLORS.resultCardBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.stroke();

  // 卡片标题
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📊 本局数据', width / 2, cardY + 24);

  // 分割线
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 30, cardY + 42);
  ctx.lineTo(cardX + cardW - 30, cardY + 42);
  ctx.stroke();

  // 统计行
  const stats = [
    { label: '坚持时长', value: `${state.totalTime}秒`, icon: '⏱' },
    { label: '躲避次数', value: `${state.dodgeCount}次`, icon: '🛡️' },
    { label: '最高连击', value: `${Math.max(state.combo, state.dodgeCount)}x`, icon: '🔥' },
  ];

  stats.forEach((stat, i) => {
    const sy = cardY + 60 + i * 44;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '16px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(`${stat.icon}  ${stat.label}`, cardX + 30, sy);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(stat.value, cardX + cardW - 30, sy);
  });

  // --- 评语 ---
  const commentY = height * 0.68;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '15px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  const comment = getComment(state.score);
  ctx.fillText(comment, width / 2, commentY);

  // --- 再来一局按钮 ---
  drawRoundedButton(ctx, button, '再来一局', COLORS.btnSuccess, {
    fontSize: 24,
  });

  // 分享提示
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '13px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('分享给同事，看看谁更能摸鱼！', width / 2, height * 0.90);
}

/**
 * 获取评价文字
 */
function getComment(score) {
  if (score < 100) return '💪 加油！下次争取多摸一会儿~';
  if (score < 300) return '😎 不错！已经有点摸鱼的感觉了！';
  if (score < 500) return '🌟 厉害！你是摸鱼界的新星！';
  if (score < 800) return '🔥 太强了！老板都拿你没办法！';
  return '👑 绝世高手！你是摸鱼界的传说！';
}

// ============================================================
//  粒子效果
// ============================================================

/**
 * 绘制粒子效果
 */
export function drawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'star') {
      // 星形
      drawStar(ctx, p.x, p.y, p.size, p.color);
    } else if (p.type === 'confetti') {
      // 彩色纸屑
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 4, p.size, p.size / 2);
    } else if (p.type === 'emoji') {
      // emoji粒子
      drawEmoji(ctx, p.emoji || '✨', p.x, p.y, p.size);
    } else {
      // 默认圆形
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // 光晕
      ctx.fillStyle = p.color.replace(')', ',0.3)').replace('rgb', 'rgba');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

/**
 * 绘制星形
 */
function drawStar(ctx, x, y, size, color) {
  const spikes = 5;
  const outerR = size;
  const innerR = size * 0.4;

  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const sx = x + Math.cos(angle) * r;
    const sy = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();
}

// ============================================================
//  按钮绘制（兼容旧接口）
// ============================================================

/**
 * 绘制按钮 - 兼容旧接口，内部使用新的drawRoundedButton
 */
export function drawButton(ctx, rect, text, color, hoverColor) {
  drawRoundedButton(ctx, rect, text, [color, hoverColor]);
}

/**
 * 绘制倒计时数字（带特效）
 */
export function drawCountdownNumber(ctx, x, y, text, scale = 1, color = '#fff') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 3, 3);

  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);

  ctx.restore();
}
