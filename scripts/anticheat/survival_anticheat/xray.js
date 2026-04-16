// scripts/anticheat/survival_anticheat/xray.js
import { world, system } from "@minecraft/server"

// ========================================
// 配置（腐竹可按需调整）
// ========================================
const WINDOW_SECONDS = 60 // 时间窗口（秒）

// 阶梯阈值配置：达到对应数量触发报警
const THRESHOLDS = {
    // 钻石：稀有 (你的原数据，很合理)
    diamond: [8, 12, 16, 24],
    
    // 远古残骸：稀有 (你的原数据)
    ancient_debris: [4, 6, 8, 12],
    
    // 绿宝石：稀有 (你的原数据)
    emerald: [4, 6, 8, 12],
    
    // 金矿：普通 (稍微拉开了阶梯差距)
    gold: [14, 20, 32, 48],
    
    // 铁矿：常见 (稍微拉开了阶梯差距)
    iron: [14, 32, 64, 96],
    
    // 煤矿：烂大街 (你的原数据，很合理)
    coal: [18, 64, 96, 128],
    
    // 铜矿：常见 (你的原数据)
    copper: [32, 48, 64, 96],
    
    // 红石：常见 (稍微拉开了阶梯差距)
    redstone: [18, 32, 64, 96],
    
    // 青金石：常见 (稍微拉开了阶梯差距)
    lapis: [18, 32, 64, 96],
    
    // 下界石英：常见 (稍微拉开了阶梯差距)
    quartz: [18, 32, 64, 96],
    
    // 下界金矿：遍地都是 (你的原数据)
    nether_gold: [18, 48, 64, 96]
}

// 矿物映射（事件 ID → 统计类型）
const ORE_MAPPING = {
    // 钻石
    "minecraft:diamond_ore": "diamond",
    "minecraft:deepslate_diamond_ore": "diamond",
    // 远古残骸
    "minecraft:ancient_debris": "ancient_debris",
    // 绿宝石
    "minecraft:emerald_ore": "emerald",
    "minecraft:deepslate_emerald_ore": "emerald",
    // 金矿
    "minecraft:gold_ore": "gold",
    "minecraft:deepslate_gold_ore": "gold",
    // 铁矿
    "minecraft:iron_ore": "iron",
    "minecraft:deepslate_iron_ore": "iron",
    // 煤矿
    "minecraft:coal_ore": "coal",
    "minecraft:deepslate_coal_ore": "coal",
    // 铜矿
    "minecraft:copper_ore": "copper",
    "minecraft:deepslate_copper_ore": "copper",
    // 红石
    "minecraft:redstone_ore": "redstone",
    "minecraft:deepslate_redstone_ore": "redstone",
    // 青金石
    "minecraft:lapis_ore": "lapis",
    "minecraft:deepslate_lapis_ore": "lapis",
    // 下界石英
    "minecraft:quartz_ore": "quartz",
    // 下界金矿
    "minecraft:nether_gold_ore": "nether_gold"
}

// 矿物显示名称
const ORE_NAMES = {
    diamond: "钻石",
    ancient_debris: "远古残骸",
    emerald: "绿宝石",
    gold: "金矿",
    iron: "铁矿",
    coal: "煤矿",
    copper: "铜矿",
    redstone: "红石",
    lapis: "青金石",
    quartz: "下界石英",
    nether_gold: "下界金矿"
}

// ========================================
// 存储玩家数据
// ========================================
const miningData = new Map()
const violations = new Map()

console.warn("[Xray] 全矿物检测已加载")

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const player = event.player
    if (!player) return
    
    const block = event.brokenBlockPermutation.type.id
    const oreType = ORE_MAPPING[block]
    
    if (!oreType) return
    
    const playerId = player.id
    const now = Date.now()
    
    let data = miningData.get(playerId)
    
    // 如果没有数据，或者窗口已过期，创建新窗口
    if (!data || (now - data.startTime) / 1000 >= WINDOW_SECONDS) {
        data = {
            startTime: now,
            ores: {},
            alertLevels: {}
        }
        console.warn(`[Xray] ${player.name} 开始新的 60 秒窗口`)
    }
    
    // 记录矿物
    data.ores[oreType] = (data.ores[oreType] || 0) + 1
    miningData.set(playerId, data)
    
    const count = data.ores[oreType]
    const thresholds = THRESHOLDS[oreType]
    
    if (!thresholds) return
    
    // 检查阶梯阈值
    const currentLevel = data.alertLevels[oreType] || 0
    
    for (let i = currentLevel; i < thresholds.length; i++) {
        if (count >= thresholds[i]) {
            data.alertLevels[oreType] = i + 1
            const vl = addViolation(playerId, oreType)
            sendAlert(player.name, "Xray", `${ORE_NAMES[oreType]} x${count}`, vl)
            console.warn(`[Xray] ${player.name} 触发 ${ORE_NAMES[oreType]} 警报! 数量=${count} vl:${vl}`)
        } else {
            break
        }
    }
})

// 定期清理过期数据
system.runInterval(() => {
    const now = Date.now()
    
    for (const [playerId, data] of miningData) {
        if ((now - data.startTime) / 1000 >= WINDOW_SECONDS) {
            const player = world.getAllPlayers().find(p => p.id === playerId)
            console.warn(`[Xray] ${player?.name || "离线玩家"} 的 60 秒窗口已过期，数据重置`)
            miningData.delete(playerId)
        }
    }
}, 100)

function addViolation(playerId, type) {
    const key = `${playerId}_${type}`
    const current = violations.get(key) || 0
    const newVl = current + 1
    violations.set(key, newVl)
    return newVl
}

function sendAlert(playerName, cheatType, detail, vl) {
    // ✅ 只发送给 OP 玩家
    const ops = world.getAllPlayers().filter(p => p.isOp())
    
    for (const op of ops) {
        op.sendMessage(`§7[§bGrimAC§7] §7${playerName} §ffailed §b${cheatType} §7${detail} §7[vl:${vl}]`)
    }
    
    // ✅ 如果没有 OP 在线，输出到日志（不广播给普通玩家）
    if (ops.length === 0) {
        console.warn(`[Xray] 警报: ${playerName} ${cheatType} ${detail} [vl:${vl}] (无OP在线)`)
    }
}