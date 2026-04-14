import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (!message.startsWith("go ")) return
    
    const name = message.slice(3).trim()
    
    event.cancel = true
    
    if (name.length === 0) {
        system.run(() => player.sendMessage("§7[§bGrimAC§7] §b请输入传送点名称,例如: §ego 矿洞"))
        return
    }
    
    system.run(() => {
        const points = JSON.parse(player.getDynamicProperty("points") || "{}")
        const target = points[name]
        
        if (!target) {
            player.sendMessage(`§7[§bGrimAC§7] §b传送点 §e"${name}" §b不存在,输入 §elist §b查看已保存的传送点`)
            return
        }
        
        // 检查维度
        if (target.dimension !== player.dimension.id) {
            const dimName = target.dimension === "minecraft:overworld" ? "主世界" : 
                           target.dimension === "minecraft:nether" ? "下界" : "末地"
            player.sendMessage(`§7[§bGrimAC§7] §b目标在 §e${dimName} §b维度,请先切换维度`)
            return
        }
        
        player.teleport({ x: target.x, y: target.y, z: target.z })
        player.sendMessage(`§7[§bGrimAC§7] §b已传送到 §e"${name}"`)
    })
})