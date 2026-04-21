// scripts/grimac-api/commands.js
import { world, system } from "@minecraft/server"

/**
 * 注册命令（支持子命令）
 * @param {string} cmd - 命令名（如 "help"）
 * @param {Function} handler - 处理函数 (player, rawMessage) => {}
 * 
 * 匹配规则：
 * - help        ✅ 完全匹配
 * - help tp     ✅ 以 "help " 开头
 * - #help       ✅ 带 # 前缀
 * - #help tp    ✅ 带 # 前缀 + 子命令
 */
export function onCommand(cmd, handler) {
    world.beforeEvents.chatSend.subscribe((event) => {
        const player = event.sender
        const rawMessage = event.message
        const message = rawMessage.toLowerCase()
        
        // 匹配：完全相等，或者以 "cmd " 开头，或者带 # 前缀
        const exactMatch = (message === cmd)
        const prefixMatch = message.startsWith(cmd + " ")
        const hashExactMatch = (message === `#${cmd}`)
        const hashPrefixMatch = message.startsWith(`#${cmd} `)
        
        if (exactMatch || prefixMatch || hashExactMatch || hashPrefixMatch) {
            event.cancel = true
            system.run(() => handler(player, rawMessage))
        }
    })
}

/**
 * 注册带参数的命令
 * @param {string} prefix - 命令前缀（如 "tpa "）
 * @param {Function} handler - 处理函数 (player, rawMessage, args) => {}
 * 
 * 匹配规则：
 * - tpa 玩家名    ✅ 以 "tpa " 开头
 * - #tpa 玩家名   ✅ 带 # 前缀
 * 
 * 注意：子命令（如 tpa yes）会被排除，由 onCommand 处理
 */
export function onCommandWithArgs(prefix, handler) {
    world.beforeEvents.chatSend.subscribe((event) => {
        const player = event.sender
        const rawMessage = event.message
        const message = rawMessage.toLowerCase()
        
        // 匹配：以 prefix 开头，或者以 #prefix 开头
        const normalMatch = message.startsWith(prefix)
        const hashMatch = message.startsWith(`#${prefix}`)
        
        if (normalMatch || hashMatch) {
            event.cancel = true
            
            // 提取参数（去掉前缀和可能的 # 号）
            let argsString = ""
            if (normalMatch) {
                argsString = rawMessage.slice(prefix.length)
            } else {
                argsString = rawMessage.slice(`#${prefix}`.length)
            }
            
            const args = argsString.trim().split(" ")
            system.run(() => handler(player, rawMessage, args))
        }
    })
}

/**
 * 注册管理命令（仅 OP 可用）
 * @param {string} cmd - 命令名
 * @param {Function} handler - 处理函数 (player, rawMessage) => {}
 */
export function onAdminCommand(cmd, handler) {
    world.beforeEvents.chatSend.subscribe((event) => {
        const player = event.sender
        const rawMessage = event.message
        const message = rawMessage.toLowerCase()
        
        const exactMatch = (message === cmd)
        const prefixMatch = message.startsWith(cmd + " ")
        const hashExactMatch = (message === `#${cmd}`)
        const hashPrefixMatch = message.startsWith(`#${cmd} `)
        
        if (exactMatch || prefixMatch || hashExactMatch || hashPrefixMatch) {
            event.cancel = true
            
            // 检查 OP 权限
            if (!player.isOp()) {
                player.sendMessage("§7[§bGrimAC§7] §b此命令仅管理员可用")
                return
            }
            
            system.run(() => handler(player, rawMessage))
        }
    })
}