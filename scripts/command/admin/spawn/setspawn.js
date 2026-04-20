import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "setspawn" && message !== "#setspawn") return
    event.cancel = true
    
    system.run(() => {
        if (!player.isOp()) {
            player.sendMessage("§7[§bGrimAC§7] §b此命令仅管理员可用")
            return
        }
        
        const loc = player.location
        const dim = player.dimension.id
        
        world.setDynamicProperty("spawn_x", loc.x)
        world.setDynamicProperty("spawn_y", loc.y)
        world.setDynamicProperty("spawn_z", loc.z)
        world.setDynamicProperty("spawn_dimension", dim)
        
        player.sendMessage(`§7[§bGrimAC§7] §b主城已设置！ §7(${loc.x.toFixed(0)}, ${loc.y.toFixed(0)}, ${loc.z.toFixed(0)})`)
    })
})
