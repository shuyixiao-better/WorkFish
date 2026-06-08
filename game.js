/**
 * game.js - 微信小游戏入口文件
 * 老板来了 v2.0 - 上班摸鱼醒脑神器
 * 
 * 新增特性：
 * - 怀疑值系统：老板出现时紧张感持续累积
 * - 道具系统：咖啡/耳机/同事掩护
 * - 连击倍率：连续闪避获得更高分数
 * - 近身闪避：最后一刻躲避获得额外奖励
 * - 成就系统：解锁各种成就
 * - 持久化统计：最高分、总局数等本地保存
 */

import { initPolyfills } from './js/polyfill.js';
import { Game } from './js/main.js';

// 初始化兼容性补丁
initPolyfills();

/**
 * 获取画布并初始化游戏
 */
function initGame() {
  const canvas = wx.createCanvas();
  const game = new Game(canvas);

  // 监听窗口尺寸变化
  wx.onWindowResize(() => {
    game.resize();
  });

  // 开始游戏循环
  game.startGameLoop();

  return game;
}

// 启动
const game = initGame();
