/**
 * utils.js - 工具函数模块
 * 提供随机数、时间格式化等通用工具函数
 */

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机浮点数
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 格式化时间为秒显示
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(seconds) {
  return `${Math.ceil(seconds)}s`;
}

/**
 * 格式化分数显示
 * @param {number} score - 分数
 * @returns {string} 格式化后的分数字符串
 */
export function formatScore(score) {
  return Math.floor(score).toString();
}

/**
 * 获取称号
 * @param {number} score - 分数
 * @returns {string} 称号
 */
export function getTitle(score) {
  if (score < 200) {
    return '实习摸鱼员';
  } else if (score < 500) {
    return '职场老油条';
  } else if (score < 800) {
    return '办公室影帝';
  } else {
    return '摸鱼宗师';
  }
}

/**
 * 根据游戏时间获取老板出现间隔
 * @param {number} elapsedTime - 已过时间（秒）
 * @returns {Array} [最小间隔, 最大间隔]（秒）
 */
export function getBossInterval(elapsedTime) {
  if (elapsedTime < 10) {
    return [4, 6]; // 前10秒：4-6秒
  } else if (elapsedTime < 20) {
    return [3, 4]; // 中间10秒：3-4秒
  } else {
    return [2, 3]; // 最后10秒：2-3秒
  }
}

/**
 * 限制值在指定范围内
 * @param {number} value - 值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 检查点是否在矩形区域内
 * @param {number} x - 点的x坐标
 * @param {number} y - 点的y坐标
 * @param {Object} rect - 矩形区域 {x, y, width, height}
 * @returns {boolean} 是否在区域内
 */
export function isPointInRect(x, y, rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

/**
 * 线性插值
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 插值参数 (0-1)
 * @returns {number} 插值结果
 */
export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * 缓动函数 - easeOutQuad
 * @param {number} t - 时间参数 (0-1)
 * @returns {number} 缓动结果
 */
export function easeOutQuad(t) {
  return t * (2 - t);
}

/**
 * 缓动函数 - easeInQuad
 * @param {number} t - 时间参数 (0-1)
 * @returns {number} 缓动结果
 */
export function easeInQuad(t) {
  return t * t;
}
