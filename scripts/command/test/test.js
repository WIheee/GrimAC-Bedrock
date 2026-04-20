import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "test" && message !== "#test") return
    event.cancel = true
    
    if (!player.isOp()) {
        player.sendMessage("§7[§bGrimAC§7] §b此命令仅管理员可用")
        return
    }
    
    system.run(() => {
        player.sendMessage("§7[§bGrimAC§7] §a✅ chatSend 事件正常工作！")
        player.sendMessage("§7[§bGrimAC§7] §b当前 API 版本: 3.0.0-alpha")
        player.sendMessage("§7[§bGrimAC§7] §bGrimAC 已完全适配 26.10！")
        
        console.warn("========== GrimAC Test ==========")
        console.warn("✅ chatSend 事件正常工作")
        console.warn(`玩家: ${player.name}`)
        console.warn("GrimAC 已完全适配 3.0.0-alpha")
        console.warn("================================")
    })
})
