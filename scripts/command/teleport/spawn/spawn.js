import { onCommand, getWorldData, setPlayerData, getPlayerData, teleportPlayer, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

const COOLDOWN = 0

onCommand("spawn", (player) => {
    const x = getWorldData("spawn_x")
    const y = getWorldData("spawn_y")
    const z = getWorldData("spawn_z")
    const dim = getWorldData("spawn_dimension")
    
    if (x === undefined) {
        sendMessage(player, "§7[§bGrimAC§7] §b主城尚未设置,请联系管理员")
        return
    }
    
    const lastSpawn = getPlayerData(player, "last_spawn_time") || 0
    const now = Date.now()
    if (now - lastSpawn < COOLDOWN) {
        const remaining = Math.ceil((COOLDOWN - (now - lastSpawn)) / 1000)
        sendMessage(player, `§7[§bGrimAC§7] §b传送冷却中，请 §e${remaining} §b秒后再试`)
        return
    }
    
    if (dim !== getPlayerDimension(player)) {
        const dimName = dim === "minecraft:overworld" ? "主世界" : 
                       dim === "minecraft:nether" ? "下界" : "末地"
        sendMessage(player, `§7[§bGrimAC§7] §b主城在 §e${dimName} §b，请先切换维度`)
        return
    }
    
    const oldLoc = player.location
    setPlayerData(player, "back_x", oldLoc.x)
    setPlayerData(player, "back_y", oldLoc.y)
    setPlayerData(player, "back_z", oldLoc.z)
    setPlayerData(player, "back_dimension", getPlayerDimension(player))
    
    teleportPlayer(player, x, y, z)
    setPlayerData(player, "last_spawn_time", now)
    sendMessage(player, "§7[§bGrimAC§7] §b已传送回主城")
})
