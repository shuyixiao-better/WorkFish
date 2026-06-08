/**
 * main.js - 游戏主循环模块
 * 控制游戏的初始化、更新和渲染
 */

import { GameStatus, PlayerStatus, createGameState, resetGameState, updateGameTime, updateScore, updateMessage, updateShake, getShakeOffset } from './gameState.js';
import { createPlayer, updatePlayer, triggerDisguise, setExpression, updateStats } from './player.js';
import { createBoss, updateBoss, shouldBossAppear, makeBossAppear, handleDisguise } from './boss.js';
import { drawOfficeBackground, drawPlayerIdle, drawPlayerWorking, drawBoss, drawWarningBar } from './scene.js';
import { drawMenuPage, drawGameUI, drawGameOverPage, drawParticles } from './ui.js';
import { isPointInRect, randomFloat, easeOutQuad } from './utils.js';

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

    // 更新按钮位置
    this.updateButtonPositions();
  }

  /**
   * 更新按钮位置
   */
  updateButtonPositions() {
    const buttonWidth = this.width * 0.6;
    const buttonHeight = 55;
    const buttonX = (this.width - buttonWidth) / 2;

    // 开始按钮
    this.startButton = {
      x: buttonX,
      y: this.height * 0.65,
      width: buttonWidth,
      height: buttonHeight,
    };

    // 伪装按钮
    this.disguiseButton = {
      x: buttonX,
      y: this.height * 0.78,
      width: buttonWidth,
      height: buttonHeight,
    };

    // 再来一局按钮
    this.restartButton = {
      x: buttonX,
      y: this.height * 0.78,
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

    // 设置首次老板出现时间
    const interval = randomFloat(4, 6);
    this.state.nextBossTime = interval;

    this.startGameLoop();
  }

  /**
   * 重新开始游戏
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
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 更新游戏逻辑
   */
  update(deltaTime) {
    if (this.state.status !== GameStatus.PLAYING) {
      return;
    }

    // 更新游戏时间
    updateGameTime(this.state, deltaTime);

    // 更新分数
    updateScore(this.state, deltaTime);

    // 更新消息
    updateMessage(this.state, deltaTime);

    // 更新震动效果
    updateShake(this.state, deltaTime);

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

    // 检查游戏结束
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
      p.alpha -= deltaTime * 2;
      p.size -= deltaTime * 10;

      if (p.alpha <= 0 || p.size <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 生成粒子
   */
  spawnParticles(type) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = randomFloat(100, 300);
      const color = type === 'success' ? '#2ecc71' : '#e74c3c';

      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: randomFloat(3, 8),
        alpha: 1,
        color: color,
      });
    }
  }

  /**
   * 渲染游戏
   */
  render() {
    const ctx = this.ctx;

    // 应用震动效果
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
    drawMenuPage(this.ctx, this.width, this.height, this.startButton);
  }

  /**
   * 渲染游戏页面
   */
  renderGame() {
    const ctx = this.ctx;

    // 绘制办公室背景
    drawOfficeBackground(ctx, this.width, this.height);

    // 绘制玩家
    const playerX = this.width * 0.45;
    const playerY = this.height * 0.35;
    const playerSize = 60;

    if (this.state.playerStatus === PlayerStatus.WORKING) {
      drawPlayerWorking(ctx, playerX, playerY, playerSize);
    } else {
      drawPlayerIdle(ctx, playerX, playerY, playerSize);
    }

    // 绘制老板（带出现/消失动画）
    if (this.state.bossVisible) {
      const appearProgress = getAppearProgress(this.boss);
      const scale = easeOutQuad(appearProgress);

      ctx.save();
      ctx.translate(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-this.boss.width / 2, -this.boss.height / 2);

      drawBoss(ctx, 0, 0, this.boss.width, this.boss.expression);

      ctx.restore();
    }

    // 绘制UI
    drawGameUI(ctx, this.width, this.height, this.state, this.disguiseButton);

    // 绘制粒子
    drawParticles(ctx, this.particles);
  }

  /**
   * 渲染结算页面
   */
  renderGameOver() {
    drawGameOverPage(this.ctx, this.width, this.height, this.state, this.restartButton);
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
