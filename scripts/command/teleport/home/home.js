import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "home" && message !== "#home") return
    event.cancel = true
    
    system.run(() => {
        const x = player.getDynamicProperty("home_x")
        const y = player.getDynamicProperty("home_y")
        const z = player.getDynamicProperty("home_z")
        const dimension = player.getDynamicProperty("home_dimension")
        
        if (x === undefined) {
            player.sendMessage("§7[§bGrimAC§7] §b你还没有设置家,输入 §esethome §b设置")
            return
        }
        
        if (dimension !== player.dimension.id) {
            const dimName = dimension === "minecraft:overworld" ? "主世界" : 
                           dimension === "minecraft:nether" ? "下界" : "末地"
            player.sendMessage(`§7[§bGrimAC§7] §b你的家在 §e${dimName} §b,请先切换到对应维度`)
            return
        }
        
        player.teleport({ x, y, z })
        player.sendMessage(`§7[§bGrimAC§7] §b欢迎回家`)
    })
})
