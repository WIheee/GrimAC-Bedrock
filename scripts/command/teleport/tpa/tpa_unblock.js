import { onCommandWithArgs, getAllPlayers, getPlayerJSON, setPlayerJSON, sendMessage } from "../../../grimac-api/index.js"

onCommandWithArgs("tpa 解除拉黑 ", (player, rawMessage, args) => {
    const targetName = args[0]
    if (!targetName) {
        sendMessage(player, "§7[§bGrimAC§7] §b请输入要解除拉黑的玩家名")
        return
    }
    
    let blockList = getPlayerJSON(player, "tpa_blocklist", [])
    const target = getAllPlayers().find(p => p.name === targetName)
    const targetId = target ? target.id : targetName
    
    const index = blockList.indexOf(targetId)
    if (index === -1) {
        sendMessage(player, `§7[§bGrimAC§7] §b玩家 §e${targetName} §b不在黑名单中`)
        return
    }
    
    blockList.splice(index, 1)
    setPlayerJSON(player, "tpa_blocklist", blockList)
    
    sendMessage(player, `§7[§bGrimAC§7] §b已解除对 §e${targetName} §b的拉黑`)
})
