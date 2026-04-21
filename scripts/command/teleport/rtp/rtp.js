import { onCommand, getPlayerData, setPlayerData, teleportPlayer, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"
import { addEffect } from "../../../grimac-api/player.js"

const COOLDOWN = 10000
const RANGE = 10000
const TELEPORT_Y = 100
const SLOW_FALLING_SECONDS = 10

onCommand("rtp", (player) => {
    if (getPlayerDimension(player) !== "minecraft:overworld") {
        sendMessage(player, "§7[§bGrimAC§7] §bRTP 只能在主世界使用")
        return
    }
    
    const lastRtp = getPlayerData(player, "last_rtp_time") || 0
    const now = Date.now()
    if (now - lastRtp < COOLDOWN) {
        const remaining = Math.ceil((COOLDOWN - (now - lastRtp)) / 1000)
        sendMessage(player, `§7[§bGrimAC§7] §b冷却中，请 §e${remaining} §b秒后再试`)
        return
    }
    
    const startX = player.location.x
    const startZ = player.location.z
    
    const x = startX + (Math.random() * RANGE * 2 - RANGE)
    const z = startZ + (Math.random() * RANGE * 2 - RANGE)
    
    teleportPlayer(player, x, TELEPORT_Y, z)
    addEffect(player, "slow_falling", SLOW_FALLING_SECONDS * 20, 0)
    setPlayerData(player, "last_rtp_time", now)
    
    sendMessage(player, `§7[§bGrimAC§7] §b已随机传送至 §e${Math.floor(x)}, ${TELEPORT_Y}, ${Math.floor(z)} §7(缓降 ${SLOW_FALLING_SECONDS}秒)`)
})
