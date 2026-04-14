import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (message === "home" || message === "#home") {
        system.run(() => {
            // 读取保存的家的坐标
            const x = player.getDynamicProperty("home_x")
            const y = player.getDynamicProperty("home_y")
            const z = player.getDynamicProperty("home_z")
            const dimension = player.getDynamicProperty("home_dimension")
            
            // 检查是否设置过家
            if (x === undefined) {
                player.sendMessage("§7[§bGrimAC§7] §b你还没有设置家,输入 §esethome §b设置")
                return
            }
            
            // 检查是否在同一维度
            if (dimension !== player.dimension.id) {
                player.sendMessage(`§7[§bGrimAC§7] §b你的家在 §e${dimension} §b维度,请先切换到对应维度`)
                return
            }
            
            // 传送玩家
            player.teleport({ x, y, z })
            player.sendMessage(`§7[§bGrimAC§7] §b欢迎回家`)
        })
        event.cancel = true
    }
})