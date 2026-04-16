// scripts/command/test/test.js
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
        player.sendMessage("§7[§bGrimAC§7] §b事件排查已输出到日志，请查看内容日志 GUI")
        
        // ===== 输出到日志 =====
        console.warn("========== GrimAC 事件排查 ==========")
        
        // 排查 afterEvents
        const afterEvents = world.afterEvents
        const afterList = []
        for (const key in afterEvents) {
            afterList.push(key)
        }
        console.warn(`afterEvents (${afterList.length}个):`)
        afterList.sort().forEach(e => console.warn(`  ✅ ${e}`))
        
        // 排查 beforeEvents
        const beforeEvents = world.beforeEvents
        const beforeList = []
        for (const key in beforeEvents) {
            beforeList.push(key)
        }
        console.warn(`beforeEvents (${beforeList.length}个):`)
        beforeList.sort().forEach(e => console.warn(`  ✅ ${e}`))
        
        // 检查可能的事件名
        const possibleEvents = [
            "blockBreak", "playerBreakBlock", "blockDestroy", "blockBroken",
            "playerDestroyBlock", "playerDig", "playerMine", "playerInteractWithBlock",
            "itemUse", "itemUseOn", "playerPlaceBlock", "blockPlace"
        ]
        console.warn("尝试匹配挖矿/交互事件:")
        for (const name of possibleEvents) {
            if (world.afterEvents[name]) {
                console.warn(`  ✅ afterEvents.${name} 存在`)
            } else if (world.beforeEvents[name]) {
                console.warn(`  ✅ beforeEvents.${name} 存在`)
            } else {
                console.warn(`  ❌ ${name} 不存在`)
            }
        }
        
        console.warn("========== 排查结束 ==========")
    })
})