// scripts/grimac-api/storage.js
import { world } from "@minecraft/server"

/**
 * 设置玩家数据
 */
export function setPlayerData(player, key, value) {
    player.setDynamicProperty(key, value)
}

/**
 * 获取玩家数据
 */
export function getPlayerData(player, key, defaultValue = undefined) {
    const value = player.getDynamicProperty(key)
    return value !== undefined ? value : defaultValue
}

/**
 * 设置世界数据
 */
export function setWorldData(key, value) {
    world.setDynamicProperty(key, value)
}

/**
 * 获取世界数据
 */
export function getWorldData(key, defaultValue = undefined) {
    const value = world.getDynamicProperty(key)
    return value !== undefined ? value : defaultValue
}

/**
 * 保存 JSON 数据
 */
export function setPlayerJSON(player, key, obj) {
    player.setDynamicProperty(key, JSON.stringify(obj))
}

/**
 * 读取 JSON 数据
 */
export function getPlayerJSON(player, key, defaultValue = {}) {
    const data = player.getDynamicProperty(key)
    return data ? JSON.parse(data) : defaultValue
}