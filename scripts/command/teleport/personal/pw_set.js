import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (!message.startsWith("pw set ")) return
    event.cancel = true
    const name = message.slice(7).trim()
    
    if (name.length === 0) {
        system.run(() => player.sendMessage("§7[§bGrimAC§7] §b请输入传送点名称，例如: §epw set 矿洞"))
        return
    }
    
    system.run(() => {
        const loc = player.location
        const dim = player.dimension.id
        
        let points = JSON.parse(player.getDynamicProperty("points") || "{}")
        
        points[name] = {
            x: loc.x,
            y: loc.y,
            z: loc.z,
            dimension: dim
        }
        
        player.setDynamicProperty("points", JSON.stringify(points))
        player.sendMessage(`§7[§bGrimAC§7] §b传送点 §e"${name}" §b已保存！ §7(${loc.x.toFixed(0)}, ${loc.y.toFixed(0)}, ${loc.z.toFixed(0)})`)
    })
})