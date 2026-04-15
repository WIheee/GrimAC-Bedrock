import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender  // ← 必须补上
    const rawMessage = event.message   
    const message = rawMessage.toLowerCase()
    
    if (message !== "tpa yes") return
    event.cancel = true
    
    system.run(() => {
        const fromId = player.getDynamicProperty("tpa_pending_from")
        const fromName = player.getDynamicProperty("tpa_pending_name")
        
        if (!fromId) {
            player.sendMessage("§7[§bGrimAC§7] §b您没有待处理的传送请求")
            return
        }
        
        const requester = world.getAllPlayers().find(p => p.id === fromId)
        
        player.setDynamicProperty("tpa_pending_from", undefined)
        player.setDynamicProperty("tpa_pending_name", undefined)
        
        if (!requester) {
            player.sendMessage(`§7[§bGrimAC§7] §b玩家 §e${fromName} §b已离线`)
            return
        }
        
        if (requester.dimension.id !== player.dimension.id) {
            const dimName = player.dimension.id === "minecraft:overworld" ? "主世界" : 
                           player.dimension.id === "minecraft:nether" ? "下界" : "末地"
            requester.sendMessage(`§7[§bGrimAC§7] §b目标在 §e${dimName} §b维度，请先切换维度`)
            player.sendMessage(`§7[§bGrimAC§7] §b请求者在其他维度，传送取消`)
            return
        }
        
        const targetLoc = player.location
        requester.teleport({ x: targetLoc.x, y: targetLoc.y, z: targetLoc.z })
        
        requester.sendMessage(`§7[§bGrimAC§7] §b对方同意了您的传送申请，您已被传送`)
        player.sendMessage(`§7[§bGrimAC§7] §e${requester.name} §b已传送到您身边`)
    })
})