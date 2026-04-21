import { onCommand, getPlayerData, teleportPlayer, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

onCommand("home", (player) => {
    const x = getPlayerData(player, "home_x")
    const y = getPlayerData(player, "home_y")
    const z = getPlayerData(player, "home_z")
    const dimension = getPlayerData(player, "home_dimension")
    
    if (x === undefined) {
        sendMessage(player, "§7[§bGrimAC§7] §b你还没有设置家,输入 §esethome §b设置")
        return
    }
    
    if (dimension !== getPlayerDimension(player)) {
        const dimName = dimension === "minecraft:overworld" ? "主世界" : 
                       dimension === "minecraft:nether" ? "下界" : "末地"
        sendMessage(player, `§7[§bGrimAC§7] §b你的家在 §e${dimName} §b,请先切换到对应维度`)
        return
    }
    
    teleportPlayer(player, x, y, z)
    sendMessage(player, "§7[§bGrimAC§7] §b欢迎回家")
})
