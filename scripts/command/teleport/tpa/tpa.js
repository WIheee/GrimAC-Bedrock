import { onCommandWithArgs, getAllPlayers, getPlayerJSON, setPlayerData, sendMessage } from "../../../grimac-api/index.js"

onCommandWithArgs("tpa ", (player, rawMessage, args) => {
    const targetName = args[0]
    if (!targetName) return
    
    if (targetName.toLowerCase() === "yes" || targetName.toLowerCase() === "no") return
    
    const target = getAllPlayers().find(p => p.name === targetName)
    
    if (!target) {
        sendMessage(player, `§7[§bGrimAC§7] §b玩家 §e${targetName} §b不在线或不存在`)
        return
    }
    
    if (target.id === player.id) {
        sendMessage(player, "§7[§bGrimAC§7] §b你不能向自己发送传送请求")
        return
    }
    
    let blockList = getPlayerJSON(target, "tpa_blocklist", [])
    if (blockList.includes(player.id)) {
        sendMessage(player, `§7[§bGrimAC§7] §b您被 §e${targetName} §b拉黑了，无法发送申请`)
        return
    }
    
    if (target.getDynamicProperty("tpa_pending_from")) {
        sendMessage(player, `§7[§bGrimAC§7] §b玩家 §e${targetName} §b正忙，请稍后再试`)
        return
    }
    
    setPlayerData(target, "tpa_pending_from", player.id)
    setPlayerData(target, "tpa_pending_name", player.name)
    
    sendMessage(player, `§7[§bGrimAC§7] §b传送请求已发送给 §e${targetName}§b，等待对方回应`)
    sendMessage(target, `§7[§bGrimAC§7] §e${player.name} §b申请传送到您身边`)
    sendMessage(target, `§7[§bGrimAC§7] §b输入 §etpa yes §b接受，§etpa no §b拒绝`)
})
