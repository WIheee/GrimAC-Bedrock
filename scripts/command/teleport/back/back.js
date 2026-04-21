import { onCommand, getPlayerData, teleportPlayer, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

onCommand("back", (player) => {
    const x = getPlayerData(player, "death_x")
    const y = getPlayerData(player, "death_y")
    const z = getPlayerData(player, "death_z")
    const dim = getPlayerData(player, "death_dimension")
    
    if (x === undefined) {
        sendMessage(player, "§7[§bGrimAC§7] §b没有死亡记录")
        return
    }
    
    if (dim !== getPlayerDimension(player)) {
        const dimName = dim === "minecraft:overworld" ? "主世界" : 
                       dim === "minecraft:nether" ? "下界" : "末地"
        sendMessage(player, `§7[§bGrimAC§7] §b死亡点在 §e${dimName} §b，请先切换维度`)
        return
    }
    
    teleportPlayer(player, x, y, z)
    sendMessage(player, `§7[§bGrimAC§7] §b已传送回死亡点 §7(${x.toFixed(0)}, ${y.toFixed(0)}, ${z.toFixed(0)})`)
})
