import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "tpa no") return
    event.cancel = true
    
    system.run(() => {
        const fromId = player.getDynamicProperty("tpa_pending_from")
        const fromName = player.getDynamicProperty("tpa_pending_name")
        
        if (!fromId) {
            player.sendMessage("§7[§bGrimAC§7] §b您没有待处理的传送请求")
            return
        }
        
        player.setDynamicProperty("tpa_pending_from", undefined)
        player.setDynamicProperty("tpa_pending_name", undefined)
        
        const requester = world.getAllPlayers().find(p => p.id === fromId)
        if (requester) {
            requester.sendMessage(`§7[§bGrimAC§7] §b对方拒绝了您的传送申请`)
        }
        
        player.sendMessage(`§7[§bGrimAC§7] §b您已拒绝 §e${fromName} §b的传送申请`)
    })
})