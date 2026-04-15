import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (!message.startsWith("tpa 拉黑 ")) return
    event.cancel = true
    
    const targetName = message.slice(6).trim()
    
    if (!targetName) {
        system.run(() => player.sendMessage("§7[§bGrimAC§7] §b请输入要拉黑的玩家名"))
        return
    }
    
    system.run(() => {
        const target = world.getAllPlayers().find(p => p.name === targetName)
        const targetId = target ? target.id : targetName
        
        let blockList = JSON.parse(player.getDynamicProperty("tpa_blocklist") || "[]")
        
        if (blockList.includes(targetId)) {
            player.sendMessage(`§7[§bGrimAC§7] §b玩家 §e${targetName} §b已在黑名单中`)
            return
        }
        
        blockList.push(targetId)
        player.setDynamicProperty("tpa_blocklist", JSON.stringify(blockList))
        
        player.sendMessage(`§7[§bGrimAC§7] §b玩家 §e${targetName} §b已被拉黑`)
        
        const pendingId = player.getDynamicProperty("tpa_pending_from")
        if (pendingId === targetId) {
            player.setDynamicProperty("tpa_pending_from", undefined)
            player.setDynamicProperty("tpa_pending_name", undefined)
        }
    })
})