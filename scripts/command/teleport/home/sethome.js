import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (message === "sethome" || message === "#sethome") {
        system.run(() => {
            // 获取玩家当前位置
            const loc = player.location
            
            // 保存到玩家的动态属性（永久存储）
            player.setDynamicProperty("home_x", loc.x)
            player.setDynamicProperty("home_y", loc.y)
            player.setDynamicProperty("home_z", loc.z)
            player.setDynamicProperty("home_dimension", player.dimension.id)
            
            player.sendMessage(`§7[§bGrimAC§7] §b家已设置,坐标: §e${loc.x.toFixed(1)}, ${loc.y.toFixed(1)}, ${loc.z.toFixed(1)}`)
        })
        event.cancel = true
    }
})