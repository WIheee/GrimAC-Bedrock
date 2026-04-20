import { world, system } from "@minecraft/server"

const COOLDOWN = 10000
const RANGE = 10000
const TELEPORT_Y = 100
const SLOW_FALLING_SECONDS = 10

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "rtp" && message !== "#rtp") return
    event.cancel = true
    
    system.run(() => {
        if (player.dimension.id !== "minecraft:overworld") {
            player.sendMessage("§7[§bGrimAC§7] §bRTP 只能在主世界使用")
            return
        }
        
        const lastRtp = player.getDynamicProperty("last_rtp_time") || 0
        const now = Date.now()
        if (now - lastRtp < COOLDOWN) {
            const remaining = Math.ceil((COOLDOWN - (now - lastRtp)) / 1000)
            player.sendMessage(`§7[§bGrimAC§7] §b冷却中，请 §e${remaining} §b秒后再试`)
            return
        }
        
        const startX = player.location.x
        const startZ = player.location.z
        
        const x = startX + (Math.random() * RANGE * 2 - RANGE)
        const z = startZ + (Math.random() * RANGE * 2 - RANGE)
        
        player.teleport({ x, y: TELEPORT_Y, z })
        player.addEffect("slow_falling", SLOW_FALLING_SECONDS * 20, { amplifier: 0, showParticles: false })
        player.setDynamicProperty("last_rtp_time", now)
        
        player.sendMessage(`§7[§bGrimAC§7] §b已随机传送至 §e${Math.floor(x)}, ${TELEPORT_Y}, ${Math.floor(z)} §7(缓降 ${SLOW_FALLING_SECONDS}秒)`)
    })
})
