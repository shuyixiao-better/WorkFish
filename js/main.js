/**
 * main.js - 游戏主循环模块
 * 控制游戏的初始化、更新和渲染
 */

import {
  GameStatus, PlayerStatus,
  createGameState, resetGameState,
  updateGameTime, updateScore, updateMessage, updateShake, updateButtonPulse,
  updateScorePopups, updateFloatingEmojis, addScorePopup, getShakeOffset
} from './gameState.js';
import { createPlayer, updatePlayer, triggerDisguise, setExpression, updateStats } from './player.js';
import { createBoss, updateBoss, shouldBossAppear, makeBossAppear, handleDisguise, getAppearProgress } from './boss.js';
import { drawOfficeBackground, drawPlayerIdle, drawPlayerWorking, drawBoss } from './scene.js';
import { drawMenuPage, drawGameUI, drawGameOverPage, drawParticles } from './ui.js';
import { isPointInRect, randomFloat, easeOutBack, COLORS } from './utils.js';

/**
 * 游戏主类
 */
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 适配屏幕尺寸
    this.resize();

    // 游戏数据
    this.state = createGameState();
    this.player = createPlayer();
    this.boss = createBoss();

    // 按钮区域
    this.startButton = { x: 0, y: 0, width: 0, height: 0 };
    this.disguiseButton = { x: 0, y: 0, width: 0, height: 0 };
    this.restartButton = { x: 0, y: 0, width: 0, height: 0 };

    // 粒子效果
    this.particles = [];

    // 动画相关
    this.lastTime = 0;
    this.animationId = null;
    this.menuTime = 0;
    this.gameOverTime = 0;
    this.idleAnimTime = 0;

    // 绑定事件
    this.bindEvents();
  }

  /**
   * 调整画布尺寸
   */
  resize() {
    const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync();

    this.canvas.width = windowWidth * pixelRatio;
    this.canvas.height = windowHeight * pixelRatio;
    this.canvas.style.width = `${windowWidth}px`;
    this.canvas.style.height = `${windowHeight}px`;

    this.ctx.scale(pixelRatio, pixelRatio);

    this.width = windowWidth;
    this.height = windowHeight;

    this.updateButtonPositions();
  }

  /**
   * 更新按钮位置
   */
  updateButtonPositions() {
    const buttonWidth = this.width * 0.64;
    const buttonHeight = 56;

    // 开始按钮（菜单页中部偏下）
    this.startButton = {
      x: (this.width - buttonWidth) / 2,
      y: this.height * 0.63,
      width: buttonWidth,
      height: buttonHeight,
    };

    // 伪装按钮（游戏页底部）
    this.disguiseButton = {
      x: (this.width - buttonWidth) / 2,
      y: this.height * 0.80,
      width: buttonWidth,
      height: buttonHeight,
    };

    // 再来一局按钮（结算页底部）
    this.restartButton = {
      x: (this.width - buttonWidth) / 2,
      y: this.height * 0.77,
      width: buttonWidth,
      height: buttonHeight,
    };
  }

  /**
   * 绑定触摸事件
   */
  bindEvents() {
    wx.onTouchStart(this.handleTouchStart.bind(this));
  }

  /**
   * 处理触摸开始
   */
  handleTouchStart(e) {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    switch (this.state.status) {
      case GameStatus.MENU:
        if (isPointInRect(x, y, this.startButton)) {
          this.startGame();
        }
        break;

      case GameStatus.PLAYING:
        if (isPointInRect(x, y, this.disguiseButton)) {
          this.handleDisguiseAction();
        }
        break;

      case GameStatus.GAME_OVER:
        if (isPointInRect(x, y, this.restartButton)) {
          this.restartGame();
        }
        break;
    }
  }

  /**
   * 开始游戏
   */
  startGame() {
    resetGameState(this.state);
    this.boss = createBoss();
    this.particles = [];
    this.idleAnimTime = 0;

    // 设置首次老板出现时间
    const interval = randomFloat(4, 6);
    this.state.nextBossTime = interval;

    this.startGameLoop();
  }

  /**
   * 重新开始
   */
  restartGame() {
    this.startGame();
  }

  /**
   * 处理伪装动作
   */
  handleDisguiseAction() {
    if (this.state.bossVisible) {
      const success = handleDisguise(this.state, this.boss);
      if (success) {
        triggerDisguise(this.player);
        setExpression(this.player, 'relieved');

        // 浮动分数弹出
        const scoreX = this.width / 2;
        const scoreY = this.height * 0.35;
        const combo = this.state.combo;
        const scoreText = combo > 1 ? `+50 x${combo}` : '+50';
        addScorePopup(this.state, scoreText, scoreX, scoreY, COLORS.scoreGold);

        // combo > 1 时额外弹出连击提示
        if (combo > 1) {
          addScorePopup(this.state, `${combo}连击!`, scoreX, scoreY - 30, '#FF6B6B');
        }

        this.spawnParticles('success');
      }
    }
  }

  /**
   * 开始游戏循环
   */
  startGameLoop() {
    this.lastTime = Date.now();
    this.gameLoop();
  }

  /**
   * 游戏主循环
   */
  gameLoop() {
    const now = Date.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1); // 防止大帧跳跃
    this.lastTime = now;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 更新游戏逻辑
   */
  update(deltaTime) {
    // 菜单页动画时间
    if (this.state.status === GameStatus.MENU) {
      this.menuTime += deltaTime;
      updateFloatingEmojis(this.state, deltaTime);
      return;
    }

    // 结算页
    if (this.state.status === GameStatus.GAME_OVER) {
      this.gameOverTime += deltaTime;
      this.updateParticles(deltaTime);
      return;
    }

    // 游戏进行中
    updateGameTime(this.state, deltaTime);
    updateScore(this.state, deltaTime);
    updateMessage(this.state, deltaTime);
    updateShake(this.state, deltaTime);
    updateButtonPulse(this.state, deltaTime);
    updateScorePopups(this.state, deltaTime);

    // 闲置动画
    this.idleAnimTime += deltaTime;

    // 更新玩家
    updatePlayer(this.player, deltaTime);

    // 更新老板
    updateBoss(this.state, this.boss, deltaTime);

    // 检查老板是否应该出现
    if (shouldBossAppear(this.state, this.boss)) {
      makeBossAppear(this.state, this.boss, this.width, this.height);
      setExpression(this.player, 'nervous');
    }

    // 更新粒子
    this.updateParticles(deltaTime);

    // 游戏结束处理
    if (this.state.status === GameStatus.GAME_OVER) {
      updateStats(this.player, this.state.score, this.state.combo);
      this.spawnParticles('gameOver');
    }
  }

  /**
   * 更新粒子
   */
  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += (p.gravity || 200) * deltaTime;
      p.alpha -= deltaTime * (p.fadeSpeed || 1.5);
      p.rotation = (p.rotation || 0) + (p.rotSpeed || 0) * deltaTime;

      if (p.alpha <= 0 || p.size <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 生成粒子
   */
  spawnParticles(type) {
    const cx = this.width / 2;
    const cy = this.height * 0.35;
    const count = type === 'success' ? 16 : 25;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + randomFloat(-0.2, 0.2);
      const speed = randomFloat(120, 320);

      if (type === 'success') {
        // 成功：星星 + 金色粒子
        const isStar = Math.random() < 0.4;
        this.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 100,
          size: randomFloat(5, 14),
          alpha: 1,
          color: Math.random() > 0.5 ? COLORS.particleGold : COLORS.particleSuccess,
          gravity: 150,
          fadeSpeed: 1.8,
          rotation: randomFloat(0, Math.PI * 2),
          rotSpeed: randomFloat(-3, 3),
          type: isStar ? 'star' : 'circle',
        });
      } else if (type === 'gameOver') {
        // 游戏结束：红色 + 深色粒子
        this.particles.push({
          x: cx + randomFloat(-80, 80),
          y: cy + randomFloat(-30, 30),
          vx: randomFloat(-60, 60),
          vy: randomFloat(-200, -50),
          size: randomFloat(4, 12),
          alpha: 1,
          color: Math.random() > 0.5 ? COLORS.particleDanger : '#495057',
          gravity: 80,
          fadeSpeed: 1.2,
          rotation: randomFloat(0, Math.PI * 2),
          rotSpeed: randomFloat(-2, 2),
          type: 'confetti',
        });
      }
    }

    // 成功后添加emoji粒子
    if (type === 'success') {
      const emojis = ['✨', '🌟', '💪', '👏'];
      for (let i = 0; i < 4; i++) {
        this.particles.push({
          x: cx + randomFloat(-30, 30),
          y: cy,
          vx: randomFloat(-80, 80),
          vy: randomFloat(-250, -150),
          size: 18 + Math.random() * 10,
          alpha: 1,
          color: COLORS.particleStar,
          gravity: 60,
          fadeSpeed: 1.0,
          rotation: 0,
          rotSpeed: 0,
          type: 'emoji',
          emoji: emojis[i],
        });
      }
    }
  }

  /**
   * 渲染游戏
   */
  render() {
    const ctx = this.ctx;

    // 应用震动偏移
    const shakeOffset = getShakeOffset(this.state);
    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);

    // 清空画布
    ctx.clearRect(-10, -10, this.width + 20, this.height + 20);

    switch (this.state.status) {
      case GameStatus.MENU:
        this.renderMenu();
        break;
      case GameStatus.PLAYING:
        this.renderGame();
        break;
      case GameStatus.GAME_OVER:
        this.renderGameOver();
        break;
    }

    ctx.restore();
  }

  /**
   * 渲染菜单页面
   */
  renderMenu() {
    drawMenuPage(this.ctx, this.width, this.height, this.startButton, this.menuTime);
  }

  /**
   * 渲染游戏页面
   */
  renderGame() {
    const ctx = this.ctx;
    const { width, height } = this;

    // 办公室背景
    drawOfficeBackground(ctx, width, height);

    // 玩家位置（坐在电脑前）
    const playerX = width * 0.42;
    const playerY = height * 0.52;
    const playerSize = 70;

    // 绘制玩家（根据状态选择不同绘制）
    if (this.state.playerStatus === PlayerStatus.WORKING) {
      drawPlayerWorking(ctx, playerX, playerY, playerSize);
    } else {
      drawPlayerIdle(ctx, playerX, playerY, playerSize, this.idleAnimTime);
    }

    // 绘制老板（带动画）
    if (this.state.bossVisible) {
      const appearProgress = getAppearProgress(this.boss);
      const scale = easeOutBack(appearProgress);

      // 根据动画类型选择不同的出现方式
      const bossW = this.boss.width;
      const bossH = this.boss.height;

      ctx.save();

      if (this.boss.appearType === 'slideRight') {
        // 从右侧滑入
        const slideX = (1 - appearProgress) * (width + bossW);
        ctx.translate(slideX, 0);
      }

      // 缩放效果
      if (this.boss.appearType === 'scale') {
        ctx.translate(this.boss.x + bossW / 2, this.boss.y + bossH / 2);
        ctx.scale(scale, scale);
        ctx.translate(-(this.boss.x + bossW / 2), -(this.boss.y + bossH / 2));
      }

      drawBoss(ctx, this.boss.x, this.boss.y, bossW, this.boss.expression);

      // "!" 感叹号（在头顶弹跳）
      if (appearProgress > 0.6) {
        const exclamationBounce = Math.sin(this.boss.exclamationTimer * 6) * 5;
        ctx.fillStyle = '#E03131';
        ctx.font = 'bold 32px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
        ctx.textAlign = 'center';
        const exX = this.boss.x + bossW / 2 + 40;
        const exY = this.boss.y - 15 + exclamationBounce;
        // 白色描边
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeText('!', exX, exY);
        ctx.fillText('!', exX, exY);
      }

      ctx.restore();
    }

    // 绘制UI（包含按钮、分数弹出等）
    drawGameUI(ctx, width, height, this.state, this.disguiseButton);

    // 绘制粒子
    drawParticles(ctx, this.particles);
  }

  /**
   * 渲染结算页面
   */
  renderGameOver() {
    drawGameOverPage(
      this.ctx, this.width, this.height,
      this.state, this.restartButton,
      Math.floor(this.state.score)
    );
    drawParticles(this.ctx, this.particles);
  }

  /**
   * 停止游戏循环
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 销毁游戏
   */
  destroy() {
    this.stop();
    wx.offTouchStart(this.handleTouchStart);
  }
}
