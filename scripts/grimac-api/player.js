// scripts/grimac-api/player.js

/**
 * 给玩家添加效果
 */
export function addEffect(player, effect, duration, amplifier = 0) {
    player.addEffect(effect, duration, { amplifier, showParticles: false })
}

/**
 * 检查玩家是否在地面
 */
export function isOnGround(player) {
    return player.isOnGround
}

/**
 * 检查玩家是否在滑翔
 */
export function isGliding(player) {
    return player.isGliding
}

/**
 * 检查玩家是否在水中
 */
export function isInWater(player) {
    return player.isInWater
}

/**
 * 检查玩家是否在骑乘
 */
export function isRiding(player) {
    return player.hasComponent("riding")
}

/**
 * 获取玩家效果等级
 */
export function getEffectLevel(player, effect) {
    const effectObj = player.getEffect(effect)
    return effectObj ? effectObj.amplifier + 1 : 0
}