// scripts/grimac-api/utils.js
import { world, system } from "@minecraft/server"

/**
 * 获取所有在线玩家
 * @returns {Player[]}
 */
export function getAllPlayers() {
    return world.getAllPlayers()
}

/**
 * 根据名字查找玩家
 * @param {string} name
 * @returns {Player | undefined}
 */
export function getPlayerByName(name) {
    return world.getAllPlayers().find(p => p.name === name)
}

/**
 * 定时循环
 * @param {number} ticks - tick 数（20 tick = 1秒）
 * @param {Function} handler
 * @returns {number} 定时器 ID
 */
export function runInterval(ticks, handler) {
    return system.runInterval(handler, ticks)
}

/**
 * 延迟执行
 * @param {number} ticks - tick 数
 * @param {Function} handler
 * @returns {number} 定时器 ID
 */
export function runTimeout(ticks, handler) {
    return system.runTimeout(handler, ticks)
}

/**
 * 异步执行（下一 tick）
 * @param {Function} handler
 */
export function runAsync(handler) {
    system.run(handler)
}

/**
 * 清除定时器
 * @param {number} id - 定时器 ID
 */
export function clearRun(id) {
    system.clearRun(id)
}

/**
 * 获取玩家速度
 * @param {Player} player
 * @returns {Vector3}
 */
export function getPlayerVelocity(player) {
    return player.getVelocity()
}

/**
 * 检查玩家是否是管理员
 * @param {Player} player
 * @returns {boolean}
 */
export function isOp(player) {
    // 方法1：playerPermissionLevel >= 2 (Operator)
    if (player.playerPermissionLevel !== undefined) {
        return player.playerPermissionLevel >= 2
    }
    
    // 方法2：commandPermissionLevel >= 2
    if (player.commandPermissionLevel !== undefined) {
        return player.commandPermissionLevel >= 2
    }
    
    // 方法3：标签系统（兜底）
    if (player.hasTag?.("op")) {
        return true
    }
    
    return false
}

/**
 * 检查玩家是否是最高权限（Custom）
 * @param {Player} player
 * @returns {boolean}
 */
export function isAdmin(player) {
    if (player.playerPermissionLevel !== undefined) {
        return player.playerPermissionLevel >= 3
    }
    if (player.commandPermissionLevel !== undefined) {
        return player.commandPermissionLevel >= 3
    }
    return player.hasTag?.("admin") || player.hasTag?.("op")
}

/**
 * 获取玩家权限等级
 * @param {Player} player
 * @returns {number} 0=Visitor, 1=Member, 2=Operator, 3=Custom
 */
export function getPermissionLevel(player) {
    return player.playerPermissionLevel ?? player.commandPermissionLevel ?? 1
}

/**
 * 获取权限等级名称
 * @param {Player} player
 * @returns {string}
 */
export function getPermissionLevelName(player) {
    const level = getPermissionLevel(player)
    const names = ["访客", "成员", "管理员", "自定义"]
    return names[level] ?? "未知"
}

/**
 * 发送消息给玩家
 * @param {Player} player
 * @param {string} message
 */
export function sendMessage(player, message) {
    player.sendMessage(message)
}

/**
 * 广播消息给所有玩家
 * @param {string} message
 */
export function broadcastMessage(message) {
    world.sendMessage(message)
}

/**
 * 广播消息给所有管理员
 * @param {string} message
 */
export function broadcastToOps(message) {
    for (const player of world.getAllPlayers()) {
        if (isOp(player)) {
            player.sendMessage(message)
        }
    }
}

/**
 * 获取当前时间戳（毫秒）
 * @returns {number}
 */
export function now() {
    return Date.now()
}

/**
 * 格式化坐标
 * @param {Vector3} loc
 * @returns {string}
 */
export function formatLocation(loc) {
    return `${loc.x.toFixed(0)}, ${loc.y.toFixed(0)}, ${loc.z.toFixed(0)}`
}

/**
 * 计算两点之间的距离
 * @param {Vector3} a
 * @param {Vector3} b
 * @returns {number}
 */
export function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

/**
 * 检查玩家是否在指定范围内
 * @param {Player} player
 * @param {Vector3} center
 * @param {number} radius
 * @returns {boolean}
 */
export function inRange(player, center, radius) {
    return distance(player.location, center) <= radius
}

/**
 * 休眠（异步）
 * @param {number} ms - 毫秒
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => system.runTimeout(resolve, Math.ceil(ms / 50)))
}

/**
 * 重试执行（带超时）
 * @param {Function} fn - 要执行的函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delayTicks - 重试间隔（tick）
 * @returns {Promise<any>}
 */
export async function retry(fn, maxRetries = 3, delayTicks = 10) {
    let lastError
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn()
        } catch (e) {
            lastError = e
            if (i < maxRetries - 1) {
                await new Promise(resolve => system.runTimeout(resolve, delayTicks))
            }
        }
    }
    throw lastError
}

console.warn("[GrimAC-API] utils 模块已加载")