import { onCommandWithArgs, getAllPlayers, getPlayerJSON, setPlayerJSON, setPlayerData, sendMessage } from "../../../grimac-api/index.js"

onCommandWithArgs("tpa 拉黑 ", (player, rawMessage, args) => {
    const targetName = args[0]
    if (!targetName) {
        sendMessage(player, "§7[§bGrimAC§7] §b请输入要拉黑的玩家名")
        return
    }
    
    const target = getAllPlayers().find(p => p.name === targetName)
    const targetId = target ? target.id : targetName
    
    let blockList = getPlayerJSON(player, "tpa_blocklist", [])
    
    if (blockList.includes(targetId)) {
        sendMessage(player, `§7[§bGrimAC§7] §b玩家 §e${targetName} §b已在黑名单中`)
        return
    }
    
    blockList.push(targetId)
    setPlayerJSON(player, "tpa_blocklist", blockList)
    
    sendMessage(player, `§7[§bGrimAC§7] §b玩家 §e${targetName} §b已被拉黑`)
    
    const pendingId = player.getDynamicProperty("tpa_pending_from")
    if (pendingId === targetId) {
        setPlayerData(player, "tpa_pending_from", undefined)
        setPlayerData(player, "tpa_pending_name", undefined)
    }
})
