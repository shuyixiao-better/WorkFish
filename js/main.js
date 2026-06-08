/**
 * main.js - 游戏主循环模块 v2.0
 * 
 * 整合所有子系统：
 * - 怀疑值系统
 * - 道具系统（咖啡/耳机/同事掩护）
 * - 成就系统
 * - 连击倍率
 * - 近身闪避
 * - 持久化统计
 */

import {
  GameStatus, PlayerStatus, ItemType,
  createGameState, resetGameState,
  updateGameTime, updateScore, updateMessage, updateShake,
  updateButtonPulse, updateScorePopups, updateFloatingEmojis,
  updateSuspicion, updateActiveItem, updateFlash, updateComboGlow,
  updateCloseCall, updateAchievementPopup,
  addScorePopup, getShakeOffset,
  showMessage,
} from './gameState.js';
import { createPlayer, updatePlayer, triggerDisguise, setExpression, finalizeGameStats, getAchievementById } from './player.js';
import {
  createBoss, updateBoss, shouldBossAppear, makeBossAppear,
  handleDisguise, handleColleagueCover, getAppearProgress,
  triggerHeadphoneWarning,
} from './boss.js';
import {
  spawnRandomItem, updateFloatingItem, hitTestItem,
  collectItem, isHeadphoneActive, useColleagueCover,
  drawFloatingItem,
} from './items.js';
import { drawOfficeBackground, drawPlayerIdle, drawPlayerWorking, drawBoss } from './scene.js';
import {
  drawMenuPage, drawGameUI, drawGameOverPage, drawParticles,
  drawAchievementPopup, drawFlashOverlay,
} from './ui.js';
import { isPointInRect, randomFloat, easeOutBack, COLORS } from './utils.js';

/**
 * 游戏主类
 */
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 适配屏幕
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

    // 浮动道具
    this.floatingItems = [];

    // 动画时间
    this.lastTime = 0;
    this.animationId = null;
    this.menuTime = 0;
    this.gameOverTime = 0;
    this.idleAnimTime = 0;

    // 成就通知队列
    this.achievementQueue = [];

    // 游戏结束处理标记（防止重复调用）
    this.gameOverHandled = false;

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

    // 重置变换后再缩放，防止累积
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(pixelRatio, pixelRatio);

    this.width = windowWidth;
    this.height = windowHeight;

    this.updateButtonPositions();
  }

  /**
   * 更新按钮位置
   */
  updateButtonPositions() {
    const buttonWidth = this.width * 0.62;
    const buttonHeight = 52;

    this.startButton = {
      x: (this.width - buttonWidth) / 2,
      y: this.height * 0.55,
      width: buttonWidth,
      height: buttonHeight,
    };

    this.disguiseButton = {
      x: (this.width - buttonWidth) / 2,
      y: this.height * 0.80,
      width: buttonWidth,
      height: buttonHeight,
    };

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
   * 处理触摸
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
        // 先检查是否点击了浮动道具
        for (let i = this.floatingItems.length - 1; i >= 0; i--) {
          const item = this.floatingItems[i];
          if (hitTestItem(x, y, item)) {
            collectItem(this.state, item);
            this.floatingItems.splice(i, 1);
            return;
          }
        }

        // 检查伪装按钮
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
    this.floatingItems = [];
    this.idleAnimTime = 0;
    this.achievementQueue = [];
    this.gameOverHandled = false;

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
      const result = handleDisguise(this.state, this.boss);
      if (result.success) {
        triggerDisguise(this.player);
        setExpression(this.player, 'relieved');

        // 浮动分数
        const scoreX = this.width / 2;
        const scoreY = this.height * 0.32;
        const scoreText = result.combo > 1
          ? `+${result.score} x${result.combo}`
          : `+${result.score}`;
        addScorePopup(this.state, scoreText, scoreX, scoreY, COLORS.scoreGold, 1.3);

        // 连击提示
        if (result.combo >= 3) {
          addScorePopup(this.state, `${result.combo}连击!`, scoreX, scoreY - 28, COLORS.particleCombo, 1.1);
        }

        // 近身闪避额外提示
        if (result.closeCall) {
          addScorePopup(this.state, '+100 极限!', scoreX, scoreY - 55, COLORS.scoreGold, 1.4);
        }

        this.spawnParticles('success');
      }
    }
  }

  /**
   * 开始游戏循环
   */
  startGameLoop() {
    // 先停止之前的循环，防止重复
    this.stop();
    this.lastTime = Date.now();
    this.gameLoop();
  }

  /**
   * 游戏主循环
   */
  gameLoop() {
    const now = Date.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * 更新游戏逻辑
   */
  update(deltaTime) {
    // 菜单页
    if (this.state.status === GameStatus.MENU) {
      this.menuTime += deltaTime;
      updateFloatingEmojis(this.state, deltaTime);
      return;
    }

    // 结算页
    if (this.state.status === GameStatus.GAME_OVER) {
      this.gameOverTime += deltaTime;
      this.updateParticles(deltaTime);
      updateAchievementPopup(this.state, deltaTime);
      return;
    }

    // ---- 游戏进行中 ----

    // 基础更新
    updateGameTime(this.state, deltaTime);
    updateScore(this.state, deltaTime);
    updateMessage(this.state, deltaTime);
    updateShake(this.state, deltaTime);
    updateButtonPulse(this.state, deltaTime);
    updateScorePopups(this.state, deltaTime);
    updateFlash(this.state, deltaTime);
    updateComboGlow(this.state, deltaTime);
    updateCloseCall(this.state, deltaTime);

    // 怀疑值系统
    updateSuspicion(this.state, deltaTime);

    // 道具状态
    updateActiveItem(this.state, deltaTime);

    // 闲置动画
    this.idleAnimTime += deltaTime;

    // 玩家
    updatePlayer(this.player, deltaTime);

    // 老板
    updateBoss(this.state, this.boss, deltaTime);

    // 耳机预警
    if (isHeadphoneActive(this.state) && !this.state.bossVisible) {
      const timeUntilBoss = this.state.nextBossTime - this.state.elapsedTime;
      if (timeUntilBoss > 0 && timeUntilBoss < 1.5 && !this.boss.warningActive) {
        triggerHeadphoneWarning(this.boss, timeUntilBoss);
      }
    }

    // 检查老板是否应该出现
    if (shouldBossAppear(this.state, this.boss)) {
      // 同事掩护检查
      if (this.state.activeItem && this.state.activeItem.type === ItemType.COLLEAGUE) {
        // 同事自动处理
        makeBossAppear(this.state, this.boss, this.width, this.height, false);
        useColleagueCover(this.state);
        handleColleagueCover(this.state, this.boss, this.width / 2);
        this.state.activeItem = null;
        this.spawnParticles('success');
      } else {
        makeBossAppear(this.state, this.boss, this.width, this.height, isHeadphoneActive(this.state));
        setExpression(this.player, 'nervous');
      }
    }

    // 浮动道具
    if (this.state.elapsedTime >= this.state.nextItemSpawnTime && this.floatingItems.length < 2) {
      const item = spawnRandomItem(this.width, this.height, this.state.elapsedTime);
      this.floatingItems.push(item);
      // 下次道具出现时间
      this.state.nextItemSpawnTime = this.state.elapsedTime + randomFloat(6, 10);
    }

    // 更新浮动道具
    for (let i = this.floatingItems.length - 1; i >= 0; i--) {
      if (!updateFloatingItem(this.floatingItems[i], deltaTime)) {
        this.floatingItems.splice(i, 1);
      }
    }

    // 粒子
    this.updateParticles(deltaTime);

    // 成就弹窗
    updateAchievementPopup(this.state, deltaTime);

    // 处理成就队列
    if (this.achievementQueue.length > 0 && !this.state.achievementPopup) {
      const achId = this.achievementQueue.shift();
      const ach = getAchievementById(achId);
      if (ach) {
        this.state.achievementPopup = ach;
        this.state.achievementTimer = 3;
      }
    }

    // 游戏结束处理（只触发一次）
    if (this.state.status === GameStatus.GAME_OVER && !this.gameOverHandled) {
      this.gameOverHandled = true;
      this.onGameOver();
    }
  }

  /**
   * 游戏结束处理
   */
  onGameOver() {
    const result = finalizeGameStats(this.player, this.state);

    // 将新解锁的成就加入队列
    if (result.newAchievements.length > 0) {
      this.achievementQueue.push(...result.newAchievements);
    }

    this.spawnParticles('gameOver');
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

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 生成粒子
   */
  spawnParticles(type) {
    const cx = this.width / 2;
    const cy = this.height * 0.32;
    const count = type === 'success' ? 14 : 22;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + randomFloat(-0.2, 0.2);
      const speed = randomFloat(100, 280);

      if (type === 'success') {
        const isStar = Math.random() < 0.35;
        this.particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 80,
          size: randomFloat(4, 12),
          alpha: 1,
          color: Math.random() > 0.5 ? COLORS.particleGold : COLORS.particleSuccess,
          gravity: 140,
          fadeSpeed: 1.6,
          rotation: randomFloat(0, Math.PI * 2),
          rotSpeed: randomFloat(-3, 3),
          type: isStar ? 'star' : 'circle',
        });
      } else {
        this.particles.push({
          x: cx + randomFloat(-60, 60),
          y: cy + randomFloat(-20, 20),
          vx: randomFloat(-50, 50),
          vy: randomFloat(-180, -40),
          size: randomFloat(3, 10),
          alpha: 1,
          color: Math.random() > 0.5 ? COLORS.particleDanger : '#495057',
          gravity: 70,
          fadeSpeed: 1.1,
          rotation: randomFloat(0, Math.PI * 2),
          rotSpeed: randomFloat(-2, 2),
          type: 'confetti',
        });
      }
    }

    // 成功时的 emoji 粒子
    if (type === 'success') {
      const emojis = ['✨', '🌟', '💪', '👏'];
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: cx + randomFloat(-25, 25),
          y: cy,
          vx: randomFloat(-60, 60),
          vy: randomFloat(-220, -130),
          size: 16 + Math.random() * 8,
          alpha: 1,
          color: COLORS.particleStar,
          gravity: 50,
          fadeSpeed: 0.9,
          rotation: 0,
          rotSpeed: 0,
          type: 'emoji',
          emoji: emojis[i % emojis.length],
        });
      }
    }
  }

  /**
   * 渲染
   */
  render() {
    const ctx = this.ctx;

    // 震动偏移
    const shakeOffset = getShakeOffset(this.state);
    ctx.save();
    ctx.translate(shakeOffset.x, shakeOffset.y);

    // 清屏
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
   * 渲染菜单
   */
  renderMenu() {
    drawMenuPage(
      this.ctx, this.width, this.height,
      this.startButton, this.menuTime,
      this.player.stats
    );
  }

  /**
   * 渲染游戏
   */
  renderGame() {
    const ctx = this.ctx;
    const { width, height } = this;

    // 办公室背景（传入怀疑值用于氛围效果）
    drawOfficeBackground(ctx, width, height, this.state.suspicion);

    // 玩家
    const playerX = width * 0.40;
    const playerY = height * 0.50;
    const playerSize = 68;

    if (this.state.playerStatus === PlayerStatus.WORKING) {
      drawPlayerWorking(ctx, playerX, playerY, playerSize);
    } else {
      drawPlayerIdle(ctx, playerX, playerY, playerSize, this.idleAnimTime);
    }

    // 浮动道具
    this.floatingItems.forEach(item => {
      drawFloatingItem(ctx, item);
    });

    // 老板
    if (this.state.bossVisible) {
      const appearProgress = getAppearProgress(this.boss);
      const scale = easeOutBack(appearProgress);
      const bossW = this.boss.width;
      const bossH = this.boss.height;

      ctx.save();

      // 入场动画
      if (this.boss.appearType === 'slideRight') {
        const slideX = (1 - appearProgress) * (width + bossW);
        ctx.translate(slideX, 0);
      } else if (this.boss.appearType === 'slideUp') {
        const slideY = (1 - appearProgress) * bossH;
        ctx.translate(0, slideY);
      } else if (this.boss.appearType === 'fadeZoom') {
        const fadeScale = appearProgress;
        ctx.globalAlpha = fadeScale;
        ctx.translate(this.boss.x + bossW / 2, this.boss.y + bossH / 2);
        ctx.scale(fadeScale, fadeScale);
        ctx.translate(-(this.boss.x + bossW / 2), -(this.boss.y + bossH / 2));
      }

      if (this.boss.appearType === 'scale') {
        ctx.translate(this.boss.x + bossW / 2, this.boss.y + bossH / 2);
        ctx.scale(scale, scale);
        ctx.translate(-(this.boss.x + bossW / 2), -(this.boss.y + bossH / 2));
      }

      drawBoss(ctx, this.boss.x, this.boss.y, bossW, this.boss.expression, this.boss.walkPhase);

      // 感叹号
      if (appearProgress > 0.6) {
        const bounce = Math.sin(this.boss.exclamationTimer * 6) * 4;
        ctx.fillStyle = '#E8453C';
        ctx.font = 'bold 28px "PingFang SC", "Microsoft YaHei", Arial, sans-serif';
        ctx.textAlign = 'center';
        const exX = this.boss.x + bossW / 2 + 38;
        const exY = this.boss.y - 12 + bounce;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.strokeText('!', exX, exY);
        ctx.fillText('!', exX, exY);
      }

      ctx.restore();
    }

    // 游戏 HUD
    drawGameUI(ctx, width, height, this.state, this.disguiseButton);

    // 粒子
    drawParticles(ctx, this.particles);

    // 闪屏
    drawFlashOverlay(ctx, width, height, this.state.flashColor, this.state.flashAlpha);

    // 成就弹窗
    if (this.state.achievementPopup) {
      drawAchievementPopup(ctx, width, this.state.achievementPopup, this.state.achievementTimer);
    }
  }

  /**
   * 渲染结算
   */
  renderGameOver() {
    drawGameOverPage(
      this.ctx, this.width, this.height,
      this.state, this.restartButton,
      this.player, Math.floor(this.state.score)
    );
    drawParticles(this.ctx, this.particles);

    // 成就弹窗（结算后延迟显示）
    if (this.state.achievementPopup) {
      drawAchievementPopup(this.ctx, this.width, this.state.achievementPopup, this.state.achievementTimer);
    }
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
   * 销毁
   */
  destroy() {
    this.stop();
    wx.offTouchStart(this.handleTouchStart);
  }
}
