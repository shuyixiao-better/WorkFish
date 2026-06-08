/**
 * ui.js - UI绘制模块 v2.0
 * 
 * 全面升级的 UI 系统：
 * - 菜单页：更精致的渐变、装饰和信息层次
 * - 游戏HUD：怀疑值仪表、道具指示器、连击光效
 * - 结算页：丰富的统计数据、成就展示、称号系统
 * - 成就通知弹窗
 */

import {
  COLORS, drawEmoji, drawStrokedText,
  drawRoundedButton, formatTime, formatScore,
  getTitle, roundRectPath, fillRoundRect,
  ACHIEVEMENTS,
} from './utils.js';
import { GameStatus, PlayerStatus } from './gameState.js';
import { getStatusText, getAchievementById, getPlayerLevel } from './player.js';
import { drawWarningVignette, drawWarningBar } from './scene.js';
import { drawActiveItemIndicator } from './items.js';

// ============================================================
//  菜单页面
// ============================================================

export function drawMenuPage(ctx, width, height, button, time, playerStats) {
  // 背景渐变
  const bgGrad = ctx.createLinearGradient(0, 0, width * 0.3, height);
  bgGrad.addColorStop(0, COLORS.menuGradTop);
  bgGrad.addColorStop(0.45, COLORS.menuGradMid);
  bgGrad.addColorStop(1, COLORS.menuGradBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 装饰大圆
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.12, width * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.1, height * 0.85, width * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // 浮动装饰
  const decorItems = [
    { icon: '💻', x: 0.12, y: 0.42, s: 28, phase: 0 },
    { icon: '📱', x: 0.85, y: 0.45, s: 26, phase: 1.2 },
    { icon: '☕', x: 0.18, y: 0.72, s: 24, phase: 2.1 },
    { icon: '💼', x: 0.82, y: 0.68, s: 26, phase: 0.8 },
    { icon: '🕐', x: 0.88, y: 0.55, s: 22, phase: 1.6 },
    { icon: '📄', x: 0.10, y: 0.58, s: 20, phase: 2.8 },
  ];
  decorItems.forEach(({ icon, x, y, s, phase }) => {
    const floatY = Math.sin(time * 1.2 + phase) * 6;
    ctx.save();
    ctx.globalAlpha = 0.3;
    drawEmoji(ctx, icon, width * x, height * y + floatY, s);
    ctx.restore();
  });

  // ---- 标题区 ----
  const titleY = height * 0.16;

  // 标题阴影
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.font = 'bold 48px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('老板来了', width / 2 + 2, titleY + 2);

  // 标题主体
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('老板来了', width / 2, titleY);

  // 标题装饰线
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 70, titleY + 28);
  ctx.lineTo(width / 2 + 70, titleY + 28);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.arc(width / 2, titleY + 28, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 副标题
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '18px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('上班摸鱼醒脑神器', width / 2, height * 0.25);

  // ---- 游戏说明卡片 ----
  const cardW = width * 0.72;
  const cardH = 72;
  const cardX = (width - cardW) / 2;
  const cardY = height * 0.31;

  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.font = '13px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('老板会随机出现，在 1.2 秒内点击伪装按钮！', width / 2, cardY + 26);
  ctx.fillText('反应太慢就会被抓包，收集道具可以获得加成~', width / 2, cardY + 50);

  // ---- 历史记录（如果有） ----
  if (playerStats && playerStats.totalGames > 0) {
    const histY = height * 0.46;
    const histH = 48;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    roundRectPath(ctx, cardX, histY, cardW, histH, 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`最高分: ${playerStats.bestScore}`, cardX + 16, histY + 20);
    ctx.textAlign = 'right';
    ctx.fillText(`${playerStats.totalGames} 局`, cardX + cardW - 16, histY + 20);

    // 等级
    const level = getPlayerLevel(playerStats);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = 'bold 12px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(`Lv.${level.level} ${level.title}`, width / 2, histY + 38);
  }

  // ---- 开始按钮 ----
  drawRoundedButton(ctx, button, '开始摸鱼', COLORS.btnPrimary, {
    fontSize: 24,
  });

  // ---- 底部 ----
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('30 秒醒脑反应小游戏', width / 2, height * 0.90);
}

// ============================================================
//  游戏页面 HUD
// ============================================================

export function drawGameUI(ctx, width, height, state, button) {
  // 老板可见时的警告效果
  if (state.bossVisible) {
    const progress = Math.min(
      (Date.now() / 1000 - state.bossAppearTime) / state.bossTimeout,
      1
    );
    drawWarningVignette(ctx, width, height, progress);

    const barW = width * 0.6;
    const barH = 24;
    const barX = (width - barW) / 2;
    const barY = height * 0.86;
    drawWarningBar(ctx, barX, barY, barW, barH, progress);
  }

  // 顶部信息栏
  drawTopBar(ctx, width, height, state);

  // 怀疑值仪表（顶部栏下方）
  drawSuspicionMeter(ctx, width, state.suspicion);

  // 状态消息
  if (state.message) {
    drawMessage(ctx, width, height, state.message, state.messageType);
  }

  // 近身闪避特效
  if (state.closeCallTimer > 0) {
    drawCloseCallEffect(ctx, width, height, state.closeCallTimer);
  }

  // 伪装按钮
  drawDisguiseButton(ctx, button, state);

  // 浮动分数
  drawScorePopups(ctx, state.scorePopups || []);

  // 道具指示器
  if (state.activeItem) {
    drawActiveItemIndicator(ctx, width - 34, 74, state.activeItem);
  }

  // 耳机预警效果
  if (state.bossVisible === false && state.nextBossTime > 0) {
    const timeUntilBoss = state.nextBossTime - state.elapsedTime;
    if (state.activeItem && state.activeItem.type === 'headphone' && timeUntilBoss < 1.5 && timeUntilBoss > 0) {
      drawHeadphoneWarning(ctx, width, height, timeUntilBoss);
    }
  }

  // 连击光效
  if (state.comboGlow > 0.1) {
    drawComboGlowEffect(ctx, width, height, state.combo, state.comboGlow);
  }
}

/**
 * 顶部信息栏 - 毛玻璃效果
 */
function drawTopBar(ctx, width, height, state) {
  const barH = 52;

  // 毛玻璃背景
  ctx.fillStyle = COLORS.glass;
  ctx.fillRect(0, 0, width, barH);

  // 底部边线
  ctx.strokeStyle = COLORS.glassBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, barH);
  ctx.lineTo(width, barH);
  ctx.stroke();

  // 顶部高光
  ctx.fillStyle = COLORS.glassHighlight;
  ctx.fillRect(0, 0, width, barH * 0.4);

  const textY = barH / 2;

  // 倒计时
  const timeLeft = state.remainingTime;
  const urgent = timeLeft <= 5;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  if (urgent) {
    const pulse = Math.sin(Date.now() / 1000 * 6) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255,123,115,${pulse})`;
  } else {
    ctx.fillStyle = COLORS.textOnDark;
  }
  ctx.font = 'bold 18px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(`⏱ ${formatTime(timeLeft)}`, 14, textY);

  // 分数
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.scoreGold;
  ctx.font = 'bold 20px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.shadowColor = COLORS.scoreGoldGlow;
  ctx.shadowBlur = 6;
  ctx.fillText(`${formatScore(state.score)}`, width / 2, textY - 2);
  ctx.shadowBlur = 0;

  // 连击
  if (state.combo > 1) {
    ctx.fillStyle = COLORS.particleCombo;
    ctx.font = 'bold 11px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(`${state.combo}x COMBO`, width / 2, barH - 6);
  }

  // 状态标签
  ctx.textAlign = 'right';
  const isIdle = state.playerStatus === PlayerStatus.IDLE;

  // 状态点
  const dotX = width - 82;
  ctx.fillStyle = isIdle ? COLORS.success : COLORS.warning;
  ctx.beginPath();
  ctx.arc(dotX, textY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isIdle ? COLORS.successGlow : COLORS.warningGlow;
  ctx.beginPath();
  ctx.arc(dotX, textY, 7, 0, Math.PI * 2);
  ctx.fill();

  // 状态文字
  ctx.fillStyle = COLORS.textOnDark;
  ctx.font = '13px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(getStatusText(state.playerStatus), width - 12, textY);
}

/**
 * 怀疑值仪表
 */
function drawSuspicionMeter(ctx, width, suspicion) {
  if (suspicion <= 0) return;

  const barW = width * 0.5;
  const barH = 4;
  const barX = (width - barW) / 2;
  const barY = 56;

  // 背景
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  roundRectPath(ctx, barX, barY, barW, barH, barH / 2);
  ctx.closePath();
  ctx.fill();

  // 进度
  const fillW = barW * (suspicion / 100);
  if (fillW > 0) {
    let color;
    if (suspicion < 40) color = COLORS.suspicionLow;
    else if (suspicion < 70) color = COLORS.suspicionMid;
    else color = COLORS.suspicionHigh;

    const grad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    roundRectPath(ctx, barX, barY, fillW, barH, barH / 2);
    ctx.closePath();
    ctx.fill();

    // 高怀疑时发光
    if (suspicion > 60) {
      ctx.fillStyle = `rgba(232,69,60,${(suspicion - 60) / 200})`;
      ctx.beginPath();
      roundRectPath(ctx, barX - 2, barY - 2, fillW + 4, barH + 4, barH);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 标签
  if (suspicion > 25) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('怀疑值', width / 2, barY + barH + 2);
  }
}

/**
 * 消息提示
 */
function drawMessage(ctx, width, height, message, type) {
  const padX = 24;
  ctx.font = 'bold 18px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  const metrics = ctx.measureText(message);
  const msgW = metrics.width + padX * 2;
  const msgH = 42;
  const msgX = (width - msgW) / 2;
  const msgY = height * 0.13;

  // 背景
  let bgColor;
  switch (type) {
    case 'warning': bgColor = 'rgba(255,182,39,0.9)'; break;
    case 'success': bgColor = 'rgba(48,214,132,0.9)'; break;
    case 'danger': bgColor = 'rgba(232,69,60,0.9)'; break;
    default: bgColor = 'rgba(44,48,64,0.88)';
  }

  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  roundRectPath(ctx, msgX + 1, msgY + 2, msgW, msgH, msgH / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  roundRectPath(ctx, msgX, msgY, msgW, msgH, msgH / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = type === 'warning' ? COLORS.textPrimary : COLORS.textOnDark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, width / 2, msgY + msgH / 2);
}

/**
 * 近身闪避特效
 */
function drawCloseCallEffect(ctx, width, height, timer) {
  const alpha = Math.min(timer / 1.5, 1) * 0.6;
  ctx.save();
  ctx.globalAlpha = alpha;

  // 金色边框闪烁
  ctx.strokeStyle = COLORS.scoreGold;
  ctx.lineWidth = 4;
  ctx.beginPath();
  roundRectPath(ctx, 8, 8, width - 16, height - 16, 12);
  ctx.closePath();
  ctx.stroke();

  // 文字
  ctx.fillStyle = COLORS.scoreGold;
  ctx.font = 'bold 28px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(255,215,0,0.5)';
  ctx.shadowBlur = 12;
  ctx.fillText('极限闪避!', width / 2, height * 0.22);
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * 伪装按钮
 */
function drawDisguiseButton(ctx, button, state) {
  const bossVisible = state.bossVisible;
  const pulse = state.buttonPulse || 0;

  if (bossVisible) {
    const pulseScale = 1 + Math.sin(pulse * Math.PI * 2) * 0.08;
    const cx = button.x + button.width / 2;
    const cy = button.y + button.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulseScale, pulseScale);
    ctx.translate(-cx, -cy);

    drawRoundedButton(ctx, button, '伪装工作！', COLORS.btnDanger, {
      fontSize: 22,
      pulse: Math.abs(Math.sin(pulse * Math.PI * 2)),
    });

    ctx.restore();
  } else {
    drawRoundedButton(ctx, button, '伪装工作', COLORS.btnDisabled, {
      fontSize: 20,
    });
  }
}

/**
 * 耳机预警效果
 */
function drawHeadphoneWarning(ctx, width, height, timeUntil) {
  const urgency = 1 - timeUntil / 1.5;
  const alpha = 0.3 + urgency * 0.4;
  const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;

  ctx.save();
  ctx.globalAlpha = alpha * pulse;

  // 顶部蓝色警告条
  ctx.fillStyle = COLORS.itemHeadphone;
  ctx.fillRect(0, 0, width, 4);

  // 预警文字
  ctx.fillStyle = COLORS.itemHeadphone;
  ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎧 老板正在靠近...', width / 2, 68);

  ctx.restore();
}

/**
 * 连击光效
 */
function drawComboGlowEffect(ctx, width, height, combo, glowAlpha) {
  if (combo < 3) return;

  ctx.save();
  ctx.globalAlpha = glowAlpha * 0.15;

  // 底部金色光晕
  const grad = ctx.createRadialGradient(width / 2, height, 0, width / 2, height, height * 0.4);
  grad.addColorStop(0, COLORS.scoreGold);
  grad.addColorStop(1, 'rgba(255,215,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  ctx.restore();
}

// ============================================================
//  结算页面
// ============================================================

export function drawGameOverPage(ctx, width, height, state, button, player, displayScore) {
  const score = displayScore !== null ? displayScore : Math.floor(state.score);

  // 背景渐变
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, COLORS.overGradTop);
  bgGrad.addColorStop(0.5, COLORS.overGradMid);
  bgGrad.addColorStop(1, COLORS.overGradBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 装饰
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.18, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.12, height * 0.82, 100, 0, Math.PI * 2);
  ctx.fill();

  // ---- 标题 ----
  ctx.fillStyle = COLORS.textOnDark;
  ctx.font = 'bold 26px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('游戏结束', width / 2, height * 0.06);

  // ---- 称号 ----
  const title = getTitle(score);
  const titleY = height * 0.13;

  ctx.fillStyle = 'rgba(255,215,0,0.1)';
  ctx.beginPath();
  ctx.arc(width / 2, titleY - 6, 40, 0, Math.PI * 2);
  ctx.fill();

  drawEmoji(ctx, '🏆', width / 2, titleY - 8, 30);

  ctx.fillStyle = COLORS.scoreGold;
  ctx.font = 'bold 22px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(title, width / 2, titleY + 18);

  // ---- 分数 ----
  const scoreY = height * 0.22;
  ctx.fillStyle = COLORS.textOnDarkMuted;
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('最终得分', width / 2, scoreY);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.shadowColor = 'rgba(255,255,255,0.15)';
  ctx.shadowBlur = 10;
  ctx.fillText(formatScore(score), width / 2, scoreY + 36);
  ctx.shadowBlur = 0;

  // 最高分标记
  if (player && player.stats && score >= player.stats.bestScore && score > 0) {
    ctx.fillStyle = COLORS.scoreGold;
    ctx.font = 'bold 12px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText('新纪录!', width / 2, scoreY + 58);
  }

  // ---- 统计卡片 ----
  const cardX = width * 0.08;
  const cardW = width * 0.84;
  const cardY = height * 0.38;
  const cardH = height * 0.22;

  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.closePath();
  ctx.stroke();

  // 卡片标题
  ctx.fillStyle = COLORS.textOnDarkMuted;
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText('本局数据', width / 2, cardY + 18);

  // 分割线
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.moveTo(cardX + 24, cardY + 32);
  ctx.lineTo(cardX + cardW - 24, cardY + 32);
  ctx.stroke();

  // 统计行
  const stats = [
    { label: '坚持时长', value: `${Math.floor(state.elapsedTime)}秒`, icon: '⏱' },
    { label: '躲避次数', value: `${state.dodgeCount}次`, icon: '🛡️' },
    { label: '最高连击', value: `${state.maxCombo}x`, icon: '🔥' },
    { label: '使用道具', value: `${state.itemsUsed}个`, icon: '🎒' },
  ];

  stats.forEach((stat, i) => {
    const sy = cardY + 48 + i * 32;
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.textOnDarkMuted;
    ctx.font = '13px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(`${stat.icon}  ${stat.label}`, cardX + 24, sy);
    ctx.textAlign = 'right';
    ctx.fillStyle = COLORS.textOnDark;
    ctx.font = 'bold 16px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
    ctx.fillText(stat.value, cardX + cardW - 24, sy);
  });

  // ---- 评语 ----
  const commentY = height * 0.64;
  ctx.fillStyle = COLORS.textOnDarkMuted;
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(getComment(score), width / 2, commentY);

  // ---- 成就展示 ----
  if (player && player.stats && player.stats.achievements.length > 0) {
    const achY = height * 0.69;
    const recentAchs = player.stats.achievements.slice(-4);
    const achW = 36;
    const totalW = recentAchs.length * (achW + 6);
    const startX = (width - totalW) / 2;

    recentAchs.forEach((achId, i) => {
      const ach = getAchievementById(achId);
      if (ach) {
        const ax = startX + i * (achW + 6) + achW / 2;
        drawEmoji(ctx, ach.icon, ax, achY, 22);
      }
    });
  }

  // ---- 再来一局按钮 ----
  drawRoundedButton(ctx, button, '再来一局', COLORS.btnSuccess, {
    fontSize: 22,
  });

  // 分享提示
  ctx.fillStyle = COLORS.textOnDarkMuted;
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('分享给同事，看看谁更能摸鱼！', width / 2, height * 0.90);
}

/**
 * 获取评价文字
 */
function getComment(score) {
  if (score < 100) return '加油！下次争取多摸一会儿~';
  if (score < 300) return '不错！已经有点摸鱼的感觉了！';
  if (score < 500) return '厉害！你是摸鱼界的新星！';
  if (score < 800) return '太强了！老板都拿你没办法！';
  if (score < 1200) return '绝世高手！摸鱼界的传说！';
  return '无人能敌！你是真正的摸鱼之王！';
}

// ============================================================
//  成就通知弹窗
// ============================================================

export function drawAchievementPopup(ctx, width, achievement, timer) {
  if (!achievement || timer <= 0) return;

  const maxDuration = 3;
  const progress = timer / maxDuration;
  const slideIn = Math.min(1, (maxDuration - timer) / 0.3);
  const slideOut = Math.min(1, timer / 0.3);
  const alpha = Math.min(slideIn, slideOut);

  const popupW = width * 0.7;
  const popupH = 56;
  const popupX = (width - popupW) / 2;
  const popupY = -10 + (1 - easeOutBack(slideIn)) * -60;

  ctx.save();
  ctx.globalAlpha = alpha;

  // 背景
  ctx.fillStyle = 'rgba(44,48,64,0.95)';
  ctx.beginPath();
  roundRectPath(ctx, popupX, popupY, popupW, popupH, 14);
  ctx.closePath();
  ctx.fill();

  // 金色边框
  ctx.strokeStyle = COLORS.scoreGold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRectPath(ctx, popupX, popupY, popupW, popupH, 14);
  ctx.closePath();
  ctx.stroke();

  // 图标
  drawEmoji(ctx, achievement.icon, popupX + 28, popupY + popupH / 2, 24);

  // 文字
  ctx.fillStyle = COLORS.scoreGold;
  ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`成就解锁: ${achievement.name}`, popupX + 50, popupY + popupH / 2 - 8);

  ctx.fillStyle = COLORS.textOnDarkMuted;
  ctx.font = '11px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
  ctx.fillText(achievement.desc, popupX + 50, popupY + popupH / 2 + 10);

  ctx.restore();
}

// ============================================================
//  粒子效果
// ============================================================

export function drawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.type === 'star') {
      drawStar(ctx, p.x, p.y, p.size, p.color);
    } else if (p.type === 'confetti') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation || 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    } else if (p.type === 'emoji') {
      drawEmoji(ctx, p.emoji || '✨', p.x, p.y, p.size);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      // 光晕
      ctx.globalAlpha = p.alpha * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

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

/**
 * 全屏闪白效果
 */
export function drawFlashOverlay(ctx, width, height, color, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// ---- 辅助 ----
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
