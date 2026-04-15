import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "tpa list") return
    event.cancel = true
    
    system.run(() => {
        const blockList = JSON.parse(player.getDynamicProperty("tpa_blocklist") || "[]")
        
        if (blockList.length === 0) {
            player.sendMessage("§7[§bGrimAC§7] §b您的黑名单是空的")
            return
        }
        
        player.sendMessage(`§7[§bGrimAC§7] §b====== 您的黑名单 (${blockList.length}个) ======`)
        
        for (const id of blockList) {
            const onlinePlayer = world.getAllPlayers().find(p => p.id === id)
            const displayName = onlinePlayer ? onlinePlayer.name : id
            player.sendMessage(`§e  ${displayName}`)
        }
        
        player.sendMessage("§7使用 §etpa 解除拉黑 玩家名 §7移除")
    })
})