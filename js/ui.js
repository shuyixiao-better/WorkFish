/**
 * ui.js - 按钮、文字、页面绘制模块
 * 绘制游戏中的所有UI元素
 */

import { formatTime, formatScore, getTitle } from './utils.js';
import { GameStatus, PlayerStatus } from './gameState.js';
import { getStatusText, getExpressionIcon } from './player.js';
import { getBossExpressionIcon, getAppearProgress } from './boss.js';

/**
 * 绘制菜单页面
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Object} button - 开始按钮区域 {x, y, width, height}
 */
export function drawMenuPage(ctx, width, height, button) {
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 装饰性办公室元素
  drawMenuDecoration(ctx, width, height);

  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('老板来了', width / 2, height * 0.25);

  // 标题阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillText('老板来了', width / 2 + 3, height * 0.25 + 3);

  // 副标题
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '24px Arial';
  ctx.fillText('上班摸鱼醒脑神器', width / 2, height * 0.35);

  // 游戏说明
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '16px Arial';
  ctx.fillText('老板会随机出现，快点击"伪装工作"按钮！', width / 2, height * 0.5);
  ctx.fillText('反应太慢就会被抓包哦~', width / 2, height * 0.55);

  // 开始按钮
  drawButton(ctx, button, '开始摸鱼', '#ff6b6b', '#ee5a24');

  // 底部提示
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '14px Arial';
  ctx.fillText('适合上班摸鱼时玩的30秒醒脑小游戏', width / 2, height * 0.85);
}

/**
 * 绘制菜单装饰
 */
function drawMenuDecoration(ctx, width, height) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

  // 电脑图标
  ctx.fillRect(width * 0.15, height * 0.7, 60, 45);
  ctx.fillRect(width * 0.15 + 20, height * 0.7 + 45, 20, 10);

  // 咖啡图标
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.75, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(width * 0.8 + 15, height * 0.73, 8, 12);

  // 文件图标
  ctx.fillRect(width * 0.75, height * 0.65, 25, 35);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(width * 0.75 + 5, height * 0.65 + 5, 15, 3);

  // 散落的emoji
  ctx.font = '30px Arial';
  ctx.fillText('💼', width * 0.2, height * 0.8);
  ctx.fillText('📱', width * 0.85, height * 0.85);
  ctx.fillText('😴', width * 0.1, height * 0.6);
}

/**
 * 绘制游戏页面UI
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Object} state - 游戏状态
 * @param {Object} button - 伪装按钮区域
 */
export function drawGameUI(ctx, width, height, state, button) {
  // 绘制顶部信息栏
  drawTopBar(ctx, width, state);

  // 绘制状态文字
  drawStatusText(ctx, width, state);

  // 绘制消息提示
  if (state.message) {
    drawMessage(ctx, width, height, state.message);
  }

  // 绘制伪装按钮
  const buttonColor = state.bossVisible ? '#ff6b6b' : '#95a5a6';
  const buttonHoverColor = state.bossVisible ? '#ee5a24' : '#7f8c8d';
  const buttonText = state.bossVisible ? '伪装工作！' : '伪装工作';
  drawButton(ctx, button, buttonText, buttonColor, buttonHoverColor);

  // 如果老板可见，绘制警告进度条
  if (state.bossVisible) {
    const barWidth = width * 0.6;
    const barHeight = 25;
    const barX = (width - barWidth) / 2;
    const barY = height * 0.88;
    const progress = Math.min(
      ((Date.now() / 1000) - state.bossAppearTime) / state.bossTimeout,
      1
    );
    drawWarningBar(ctx, barX, barY, barWidth, barHeight, progress);
  }
}

/**
 * 绘制顶部信息栏
 */
function drawTopBar(ctx, width, state) {
  // 背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, 50);

  // 倒计时
  ctx.fillStyle = state.remainingTime <= 5 ? '#ff6b6b' : '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`⏱ ${formatTime(state.remainingTime)}`, 15, 25);

  // 分数
  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'center';
  ctx.fillText(`⭐ ${formatScore(state.score)}`, width / 2, 25);

  // Combo
  if (state.combo > 1) {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${state.combo}x COMBO`, width / 2, 45);
  }

  // 状态
  ctx.fillStyle = state.playerStatus === PlayerStatus.IDLE ? '#2ecc71' : '#f39c12';
  ctx.textAlign = 'right';
  ctx.font = '16px Arial';
  ctx.fillText(getStatusText(state.playerStatus), width - 15, 25);
}

/**
 * 绘制状态文字
 */
function drawStatusText(ctx, width, state) {
  // 玩家状态表情
  const statusIcon = state.playerStatus === PlayerStatus.IDLE ? '😊' : '😰';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(statusIcon, width / 2, 80);
}

/**
 * 绘制消息提示
 */
function drawMessage(ctx, width, height, message) {
  // 消息背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  const metrics = ctx.measureText(message);
  const padding = 20;
  const msgWidth = metrics.width + padding * 2;
  const msgHeight = 50;
  const msgX = (width - msgWidth) / 2;
  const msgY = height * 0.15;

  // 圆角矩形
  ctx.beginPath();
  ctx.roundRect(msgX, msgY, msgWidth, msgHeight, 10);
  ctx.fill();

  // 消息文字
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, width / 2, msgY + msgHeight / 2);
}

/**
 * 绘制警告进度条
 */
function drawWarningBar(ctx, x, y, width, height, progress) {
  // 背景
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, height / 2);
  ctx.fill();

  // 进度条
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
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, height, height / 2);
    ctx.fill();
  }

  // 边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, height / 2);
  ctx.stroke();

  // 倒计时文字
  const remaining = Math.max((1 - progress) * 1.2, 0);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${height - 8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${remaining.toFixed(1)}s`, x + width / 2, y + height / 2);
}

/**
 * 绘制结算页面
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Object} state - 游戏状态
 * @param {Object} button - 再来一局按钮区域
 */
export function drawGameOverPage(ctx, width, height, state, button) {
  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#2c3e50');
  gradient.addColorStop(1, '#3498db');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 标题
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('游戏结束', width / 2, height * 0.12);

  // 结果卡片背景
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(width * 0.1, height * 0.18, width * 0.8, height * 0.45, 15);
  ctx.fill();

  // 称号
  const title = getTitle(state.score);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(`🏆 ${title}`, width / 2, height * 0.25);

  // 最终得分
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.fillText(formatScore(state.score), width / 2, height * 0.35);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '18px Arial';
  ctx.fillText('分', width / 2 + 50, height * 0.35);

  // 分割线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height * 0.42);
  ctx.lineTo(width * 0.8, height * 0.42);
  ctx.stroke();

  // 统计信息
  const stats = [
    { label: '坚持时长', value: `${state.totalTime}秒`, icon: '⏱' },
    { label: '躲避次数', value: `${state.dodgeCount}次`, icon: '🛡' },
    { label: '最高连击', value: `${state.combo}x`, icon: '🔥' },
  ];

  stats.forEach((stat, index) => {
    const y = height * 0.48 + index * 45;

    // 图标和标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${stat.icon} ${stat.label}`, width * 0.2, y);

    // 值
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(stat.value, width * 0.8, y);
  });

  // 评价文字
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  const comment = getComment(state.score);
  ctx.fillText(comment, width / 2, height * 0.7);

  // 再来一局按钮
  drawButton(ctx, button, '再来一局', '#2ecc71', '#27ae60');

  // 分享提示
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '14px Arial';
  ctx.fillText('分享给同事，看看谁更能摸鱼！', width / 2, height * 0.88);
}

/**
 * 获取评价文字
 */
function getComment(score) {
  if (score < 100) {
    return '加油！下次争取多摸一会儿~';
  } else if (score < 300) {
    return '不错！已经有点摸鱼的感觉了！';
  } else if (score < 500) {
    return '厉害！你是摸鱼界的新星！';
  } else if (score < 800) {
    return '太强了！老板都拿你没办法！';
  } else {
    return '绝世高手！你是摸鱼界的传说！';
  }
}

/**
 * 绘制按钮
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {Object} rect - 按钮区域 {x, y, width, height}
 * @param {string} text - 按钮文字
 * @param {string} color - 按钮颜色
 * @param {string} hoverColor - 按钮悬停颜色
 */
export function drawButton(ctx, rect, text, color, hoverColor) {
  // 按钮阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.roundRect(rect.x + 3, rect.y + 3, rect.width, rect.height, rect.height / 2);
  ctx.fill();

  // 按钮背景
  const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, hoverColor);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rect.height / 2);
  ctx.fill();

  // 按钮边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rect.height / 2);
  ctx.stroke();

  // 按钮高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.roundRect(rect.x + 5, rect.y + 5, rect.width - 10, rect.height / 3, rect.height / 4);
  ctx.fill();

  // 按钮文字
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);
}

/**
 * 绘制倒计时数字（带特效）
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {number} x - x坐标
 * @param {number} y - y坐标
 * @param {string} text - 文字
 * @param {number} scale - 缩放
 * @param {string} color - 颜色
 */
export function drawCountdownNumber(ctx, x, y, text, scale = 1, color = '#fff') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 3, 3);

  // 主体
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

/**
 * 绘制粒子效果
 * @param {CanvasRenderingContext2D} ctx - Canvas上下文
 * @param {Array} particles - 粒子数组
 */
export function drawParticles(ctx, particles) {
  particles.forEach(particle => {
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}
