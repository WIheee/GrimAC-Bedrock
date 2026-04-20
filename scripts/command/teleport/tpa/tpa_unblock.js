import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (!message.startsWith("tpa 解除拉黑 ")) return
    event.cancel = true
    
    const targetName = rawMessage.slice(8).trim()
    
    if (!targetName) {
        system.run(() => player.sendMessage("§7[§bGrimAC§7] §b请输入要解除拉黑的玩家名"))
        return
    }
    
    system.run(() => {
        let blockList = JSON.parse(player.getDynamicProperty("tpa_blocklist") || "[]")
        
        const target = world.getAllPlayers().find(p => p.name === targetName)
        const targetId = target ? target.id : targetName
        
        const index = blockList.indexOf(targetId)
        if (index === -1) {
            player.sendMessage(`§7[§bGrimAC§7] §b玩家 §e${targetName} §b不在黑名单中`)
            return
        }
        
        blockList.splice(index, 1)
        player.setDynamicProperty("tpa_blocklist", JSON.stringify(blockList))
        
        player.sendMessage(`§7[§bGrimAC§7] §b已解除对 §e${targetName} §b的拉黑`)
    })
})
