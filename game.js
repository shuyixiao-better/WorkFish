/**
 * game.js - 微信小游戏入口文件
 * 老板来了 - 上班摸鱼醒脑神器
 */

import { initPolyfills } from './js/polyfill.js';
import { Game } from './js/main.js';

// 初始化兼容性补丁
initPolyfills();

/**
 * 获取画布并初始化游戏
 */
function initGame() {
  // 获取画布
  const canvas = wx.createCanvas();

  // 创建游戏实例
  const game = new Game(canvas);

  // 监听窗口尺寸变化
  wx.onWindowResize(() => {
    game.resize();
  });

  // 开始游戏循环
  game.startGameLoop();

  return game;
}

// 初始化游戏
const game = initGame();
