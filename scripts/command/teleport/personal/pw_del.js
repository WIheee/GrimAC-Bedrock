import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (!message.startsWith("pw del ")) return
    event.cancel = true
    
    const name = rawMessage.slice(7).trim()
    
    if (name.length === 0) {
        system.run(() => player.sendMessage("§7[§bGrimAC§7] §b请输入要删除的传送点名称"))
        return
    }
    
    system.run(() => {
        let points = JSON.parse(player.getDynamicProperty("points") || "{}")
        
        if (!points[name]) {
            player.sendMessage(`§7[§bGrimAC§7] §b传送点 §e"${name}" §b不存在`)
            return
        }
        
        delete points[name]
        player.setDynamicProperty("points", JSON.stringify(points))
        player.sendMessage(`§7[§bGrimAC§7] §b传送点 §e"${name}" §b已删除`)
    })
})
