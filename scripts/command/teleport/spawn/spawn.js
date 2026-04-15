import { world, system } from "@minecraft/server"

// 冷却时间（毫秒）
const COOLDOWN = 5000 // 5秒，防止战斗时逃跑

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "spawn" && message !== "#spawn") return
    event.cancel = true
    
    system.run(() => {
        // 读取主城坐标
        const x = world.getDynamicProperty("spawn_x")
        const y = world.getDynamicProperty("spawn_y")
        const z = world.getDynamicProperty("spawn_z")
        const dim = world.getDynamicProperty("spawn_dimension")
        
        if (x === undefined) {
            player.sendMessage("§7[§bGrimAC§7] §b主城尚未设置,请联系管理员")
            return
        }
        
        // 检查冷却
        const lastSpawn = player.getDynamicProperty("last_spawn_time") || 0
        const now = Date.now()
        if (now - lastSpawn < COOLDOWN) {
            const remaining = Math.ceil((COOLDOWN - (now - lastSpawn)) / 1000)
            player.sendMessage(`§7[§bGrimAC§7] §b传送冷却中，请 §e${remaining} §b秒后再试`)
            return
        }
        
        // 检查维度
        if (dim !== player.dimension.id) {
            const dimName = dim === "minecraft:overworld" ? "主世界" : 
                           dim === "minecraft:nether" ? "下界" : "末地"
            player.sendMessage(`§7[§bGrimAC§7] §b主城在 §e${dimName} §b，请先切换维度`)
            return
        }
        
        // 保存传送前位置（用于 back）
        const oldLoc = player.location
        player.setDynamicProperty("back_x", oldLoc.x)
        player.setDynamicProperty("back_y", oldLoc.y)
        player.setDynamicProperty("back_z", oldLoc.z)
        player.setDynamicProperty("back_dimension", player.dimension.id)
        
        // 传送
        player.teleport({ x, y, z })
        player.setDynamicProperty("last_spawn_time", now)
        player.sendMessage("§7[§bGrimAC§7] §b已传送回主城")
    })
})