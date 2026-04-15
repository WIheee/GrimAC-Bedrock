import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "sethome" && message !== "#sethome") return
    event.cancel = true
    
    system.run(() => {
        const loc = player.location
        
        player.setDynamicProperty("home_x", loc.x)
        player.setDynamicProperty("home_y", loc.y)
        player.setDynamicProperty("home_z", loc.z)
        player.setDynamicProperty("home_dimension", player.dimension.id)
        
        player.sendMessage(`§7[§bGrimAC§7] §b家已设置,坐标: §e${loc.x.toFixed(1)}, ${loc.y.toFixed(1)}, ${loc.z.toFixed(1)}`)
    })
})