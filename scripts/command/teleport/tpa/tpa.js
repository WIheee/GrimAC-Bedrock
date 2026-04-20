import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (!message.startsWith("tpa ")) return
    event.cancel = true
    
    const args = rawMessage.slice(4).trim().split(" ")
    if (args[0].toLowerCase() === "yes" || args[0].toLowerCase() === "no") return
    
    const targetName = args[0]
    
    system.run(() => {
        const target = world.getAllPlayers().find(p => p.name === targetName)
        
        if (!target) {
            player.sendMessage(`§7[§bGrimAC§7] §b玩家 §e${targetName} §b不在线或不存在`)
            return
        }
        
        if (target.id === player.id) {
            player.sendMessage("§7[§bGrimAC§7] §b你不能向自己发送传送请求")
            return
        }
        
        let blockList = JSON.parse(target.getDynamicProperty("tpa_blocklist") || "[]")
        if (blockList.includes(player.id)) {
            player.sendMessage(`§7[§bGrimAC§7] §b您被 §e${targetName} §b拉黑了，无法发送申请`)
            return
        }
        
        const pendingTarget = target.getDynamicProperty("tpa_pending_from")
        if (pendingTarget) {
            player.sendMessage(`§7[§bGrimAC§7] §b玩家 §e${targetName} §b正忙，请稍后再试`)
            return
        }
        
        target.setDynamicProperty("tpa_pending_from", player.id)
        target.setDynamicProperty("tpa_pending_name", player.name)
        
        player.sendMessage(`§7[§bGrimAC§7] §b传送请求已发送给 §e${targetName}§b，等待对方回应`)
        target.sendMessage(`§7[§bGrimAC§7] §e${player.name} §b申请传送到您身边`)
        target.sendMessage(`§7[§bGrimAC§7] §b输入 §etpa yes §b接受，§etpa no §b拒绝`)
    })
})
