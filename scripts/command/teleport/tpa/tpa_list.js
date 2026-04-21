import { onCommand, getPlayerJSON, getAllPlayers, sendMessage } from "../../../grimac-api/index.js"

onCommand("tpa list", (player) => {
    const blockList = getPlayerJSON(player, "tpa_blocklist", [])
    
    if (blockList.length === 0) {
        sendMessage(player, "§7[§bGrimAC§7] §b您的黑名单是空的")
        return
    }
    
    sendMessage(player, `§7[§bGrimAC§7] §b====== 您的黑名单 (${blockList.length}个) ======`)
    
    for (const id of blockList) {
        const onlinePlayer = getAllPlayers().find(p => p.id === id)
        const displayName = onlinePlayer ? onlinePlayer.name : id
        sendMessage(player, `§e  ${displayName}`)
    }
    
    sendMessage(player, "§7使用 §etpa 解除拉黑 玩家名 §7移除")
})
