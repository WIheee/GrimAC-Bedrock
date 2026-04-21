import { onCommandWithArgs, getPlayerJSON, teleportPlayer, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

onCommandWithArgs("pw go ", (player, rawMessage, args) => {
    const name = args[0]
    if (!name) {
        sendMessage(player, "§7[§bGrimAC§7] §b请输入传送点名称，例如: §epw go 矿洞")
        return
    }
    
    const points = getPlayerJSON(player, "points", {})
    const target = points[name]
    
    if (!target) {
        sendMessage(player, `§7[§bGrimAC§7] §b传送点 §e"${name}" §b不存在，输入 §epw list §b查看已保存的传送点`)
        return
    }
    
    if (target.dimension !== getPlayerDimension(player)) {
        const dimName = target.dimension === "minecraft:overworld" ? "主世界" : 
                       target.dimension === "minecraft:nether" ? "下界" : "末地"
        sendMessage(player, `§7[§bGrimAC§7] §b目标在 §e${dimName} §b维度，请先切换维度`)
        return
    }
    
    teleportPlayer(player, target.x, target.y, target.z)
    sendMessage(player, `§7[§bGrimAC§7] §b已传送到 §e"${name}"`)
})
