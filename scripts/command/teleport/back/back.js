import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "back" && message !== "#back") return
    event.cancel = true
    
    system.run(() => {
        const x = player.getDynamicProperty("death_x")
        const y = player.getDynamicProperty("death_y")
        const z = player.getDynamicProperty("death_z")
        const dim = player.getDynamicProperty("death_dimension")
        
        if (x === undefined) {
            player.sendMessage("§7[§bGrimAC§7] §b没有死亡记录")
            return
        }
        
        if (dim !== player.dimension.id) {
            const dimName = dim === "minecraft:overworld" ? "主世界" : 
                           dim === "minecraft:nether" ? "下界" : "末地"
            player.sendMessage(`§7[§bGrimAC§7] §b死亡点在 §e${dimName} §b，请先切换维度`)
            return
        }
        
        player.teleport({ x, y, z })
        player.sendMessage(`§7[§bGrimAC§7] §b已传送回死亡点 §7(${x.toFixed(0)}, ${y.toFixed(0)}, ${z.toFixed(0)})`)
    })
})