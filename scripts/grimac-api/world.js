// scripts/grimac-api/world.js
import { world } from "@minecraft/server"

/**
 * 获取默认出生点
 */
export function getDefaultSpawn() {
    return world.getDefaultSpawnLocation()
}

/**
 * 获取维度
 */
export function getDimension(id) {
    return world.getDimension(id)
}

/**
 * 获取当前时间
 */
export function getTime() {
    return world.getAbsoluteTime()
}

/**
 * 维度名称转换
 */
export function getDimensionName(dimensionId) {
    if (dimensionId === "minecraft:overworld") return "主世界"
    if (dimensionId === "minecraft:nether") return "下界"
    if (dimensionId === "minecraft:the_end") return "末地"
    return dimensionId
}