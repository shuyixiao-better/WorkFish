/**
 * items.js - 道具系统模块
 * 
 * 三种道具：
 * - 咖啡 (Coffee)：老板出现时时间减缓 50%，持续一次老板遭遇
 * - 耳机 (Headphone)：老板出现前 1.5 秒提前预警
 * - 同事掩护 (Colleague)：自动处理下次老板出现
 * 
 * 道具在游戏中随机出现，玩家点击收集后激活。
 */

import { ItemType, showMessage, addScorePopup, triggerFlash } from './gameState.js';
import { COLORS, randomFloat, isPointInCircle, drawIcon, font, easeOutBack } from './utils.js';

/**
 * 道具定义
 */
const ITEM_DEFS = {
  [ItemType.COFFEE]: {
    name: '提神咖啡',
    iconId: 'coffee',
    color: COLORS.itemCoffee,
    glowColor: COLORS.itemCoffeeGlow,
    duration: 8,  // 持续秒数（覆盖一次老板遭遇）
    description: '老板出现时时间减缓',
  },
  [ItemType.HEADPHONE]: {
    name: '降噪耳机',
    iconId: 'headphones',
    color: COLORS.itemHeadphone,
    glowColor: COLORS.itemHeadphoneGlow,
    duration: 12,
    description: '提前预警老板出现',
  },
  [ItemType.COLLEAGUE]: {
    name: '同事掩护',
    iconId: 'handshake',
    color: COLORS.itemColleague,
    glowColor: COLORS.itemColleagueGlow,
    duration: 15,
    description: '自动处理下次老板',
  },
};

/**
 * 创建浮动道具数据
 */
export function createFloatingItem(type, x, y) {
  const def = ITEM_DEFS[type];
  return {
    type,
    x,
    y,
    baseY: y,
    radius: 24,
    timer: 0,
    lifetime: 5,      // 存活 5 秒
    alpha: 1,
    collected: false,
    collectAnim: 0,   // 收集动画进度 0~1
    def,
  };
}

/**
 * 生成随机道具（根据游戏时间选择类型）
 */
export function spawnRandomItem(canvasWidth, canvasHeight, elapsedTime) {
  const types = [ItemType.COFFEE, ItemType.HEADPHONE, ItemType.COLLEAGUE];

  // 根据时间权重选择
  let type;
  const roll = Math.random();
  if (elapsedTime < 10) {
    // 前期偏向咖啡和耳机
    type = roll < 0.4 ? ItemType.COFFEE : roll < 0.75 ? ItemType.HEADPHONE : ItemType.COLLEAGUE;
  } else if (elapsedTime < 20) {
    type = types[Math.floor(roll * 3)];
  } else {
    // 后期偏向同事掩护（保命）
    type = roll < 0.3 ? ItemType.COFFEE : roll < 0.55 ? ItemType.HEADPHONE : ItemType.COLLEAGUE;
  }

  // 随机位置（避开顶部 HUD 和底部按钮区域）
  const margin = 50;
  const x = margin + Math.random() * (canvasWidth - margin * 2);
  const yTop = canvasHeight * 0.2;
  const yBottom = canvasHeight * 0.65;
  const y = yTop + Math.random() * (yBottom - yTop);

  return createFloatingItem(type, x, y);
}

/**
 * 更新浮动道具
 */
export function updateFloatingItem(item, deltaTime) {
  if (!item) return false;

  item.timer += deltaTime;
  item.collectAnim = Math.min(1, item.collectAnim + deltaTime * 4);

  // 浮动动画
  item.y = item.baseY + Math.sin(item.timer * 2.5) * 8;

  // 生命衰减
  if (item.timer > item.lifetime - 1) {
    item.alpha = Math.max(0, item.lifetime - item.timer);
  }

  // 超时消失
  if (item.timer >= item.lifetime || item.collected) {
    return false; // 标记移除
  }
  return true; // 仍然存活
}

/**
 * 检查点击是否命中道具
 */
export function hitTestItem(touchX, touchY, item) {
  if (!item || item.collected) return false;
  return isPointInCircle(touchX, touchY, item.x, item.y, item.radius + 10);
}

/**
 * 收集道具
 */
export function collectItem(state, item) {
  item.collected = true;
  state.itemsUsed++;

  // 激活动具效果
  const def = ITEM_DEFS[item.type];
  state.activeItem = {
    type: item.type,
    remaining: def.duration,
    def,
  };

  showMessage(state, `${def.name}已激活！`, 1.5, 'success');
  addScorePopup(state, '+25', item.x, item.y - 20, def.color, 1.2);
  state.score += 25;
  triggerFlash(state, def.color, 0.15);
}

/**
 * 获取道具定义
 */
export function getItemDef(type) {
  return ITEM_DEFS[type] || null;
}

// ============================================================
//  道具绘制
// ============================================================

/**
 * 绘制浮动道具
 */
export function drawFloatingItem(ctx, item) {
  if (!item || item.alpha <= 0) return;

  const { x, y, radius, def, timer } = item;
  const appearScale = easeOutBack(Math.min(1, item.collectAnim * 2));
  const pulse = 1 + Math.sin(timer * 4) * 0.08;
  const scale = appearScale * pulse;

  ctx.save();
  ctx.globalAlpha = item.alpha;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 外圈光晕
  const glowGrad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius * 1.8);
  glowGrad.addColorStop(0, def.glowColor);
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 主体圆
  const bodyGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 0, 0, 0, radius);
  bodyGrad.addColorStop(0, '#FFFFFF');
  bodyGrad.addColorStop(0.4, def.color);
  bodyGrad.addColorStop(1, def.color);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 高光
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.arc(-radius * 0.25, -radius * 0.25, radius * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // 图标（使用矢量图标替代 emoji）
  drawIcon(ctx, def.iconId, 0, 1, radius * 0.9);

  ctx.restore();
}

/**
 * 绘制激活的道具指示器（HUD 中显示）
 */
export function drawActiveItemIndicator(ctx, x, y, activeItem) {
  if (!activeItem) return;

  const def = activeItem.def;
  const remaining = activeItem.remaining;
  const w = 42;
  const h = 42;

  ctx.save();
  ctx.translate(x, y);

  // 背景
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.arc(0, 0, h / 2 + 2, 0, Math.PI * 2);
  ctx.fill();

  // 剩余时间环
  const maxDuration = def.duration;
  const progress = remaining / maxDuration;
  ctx.strokeStyle = def.color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, h / 2 + 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();

  // 图标背景
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.arc(0, 0, h / 2, 0, Math.PI * 2);
  ctx.fill();

  // 图标（使用矢量图标替代 emoji）
  drawIcon(ctx, def.iconId, 0, 1, h * 0.55);

  ctx.restore();
}

/**
 * 检查耳机道具是否激活（提前预警）
 */
export function isHeadphoneActive(state) {
  return state.activeItem && state.activeItem.type === ItemType.HEADPHONE;
}

/**
 * 检查同事掩护是否激活
 */
export function isColleagueActive(state) {
  return state.activeItem && state.activeItem.type === ItemType.COLLEAGUE;
}

/**
 * 使用同事掩护（消耗道具）
 */
export function useColleagueCover(state) {
  if (isColleagueActive(state)) {
    state.activeItem = null;
    showMessage(state, '同事帮你掩护了！', 1.5, 'success');
    addScorePopup(state, '掩护成功!', state.width ? state.width / 2 : 180, 200, COLORS.itemColleague, 1.3);
    return true;
  }
  return false;
}
