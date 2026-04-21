import { onCommand, getPlayerData, setPlayerData, getAllPlayers, teleportPlayer, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

onCommand("tpa yes", (player) => {
    const fromId = getPlayerData(player, "tpa_pending_from")
    const fromName = getPlayerData(player, "tpa_pending_name")
    
    if (!fromId) {
        sendMessage(player, "§7[§bGrimAC§7] §b您没有待处理的传送请求")
        return
    }
    
    const requester = getAllPlayers().find(p => p.id === fromId)
    
    setPlayerData(player, "tpa_pending_from", undefined)
    setPlayerData(player, "tpa_pending_name", undefined)
    
    if (!requester) {
        sendMessage(player, `§7[§bGrimAC§7] §b玩家 §e${fromName} §b已离线`)
        return
    }
    
    if (getPlayerDimension(requester) !== getPlayerDimension(player)) {
        const dimName = getPlayerDimension(player) === "minecraft:overworld" ? "主世界" : 
                       getPlayerDimension(player) === "minecraft:nether" ? "下界" : "末地"
        sendMessage(requester, `§7[§bGrimAC§7] §b目标在 §e${dimName} §b维度，请先切换维度`)
        sendMessage(player, `§7[§bGrimAC§7] §b请求者在其他维度，传送取消`)
        return
    }
    
    const targetLoc = player.location
    teleportPlayer(requester, targetLoc.x, targetLoc.y, targetLoc.z)
    
    sendMessage(requester, `§7[§bGrimAC§7] §b对方同意了您的传送申请，您已被传送`)
    sendMessage(player, `§7[§bGrimAC§7] §e${requester.name} §b已传送到您身边`)
})
