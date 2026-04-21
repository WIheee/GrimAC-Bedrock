// scripts/grimac-api/teleport.js

/**
 * 传送玩家
 */
export function teleportPlayer(player, x, y, z) {
    player.teleport({ x, y, z })
}

/**
 * 传送玩家到指定位置（对象形式）
 */
export function teleportTo(player, location) {
    player.teleport(location)
}

/**
 * 获取玩家位置
 */
export function getPlayerLocation(player) {
    return player.location
}

/**
 * 获取玩家维度
 */
export function getPlayerDimension(player) {
    return player.dimension.id
}

/**
 * 检查是否同维度
 */
export function isSameDimension(player, dimensionId) {
    return player.dimension.id === dimensionId
}