import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "pw list") return
    event.cancel = true
    
    system.run(() => {
        const points = JSON.parse(player.getDynamicProperty("points") || "{}")
        const names = Object.keys(points)
        
        if (names.length === 0) {
            player.sendMessage("§7[§bGrimAC§7] §b你还没有保存任何传送点，输入 §epw set 名称 §b来创建")
            return
        }
        
        player.sendMessage(`§7[§bGrimAC§7] §b====== 你的传送点 (${names.length}个) ======`)
        
        for (const name of names) {
            const p = points[name]
            const dimName = p.dimension === "minecraft:overworld" ? "主世界" : 
                           p.dimension === "minecraft:nether" ? "下界" : "末地"
            player.sendMessage(`§e  ${name} §7- ${dimName} (${p.x.toFixed(0)}, ${p.y.toFixed(0)}, ${p.z.toFixed(0)})`)
        }
        
        player.sendMessage("§7使用 §epw go 名称 §7传送，§epw del 名称 §7删除")
    })
})
