import { onCommand, getPlayerData, setPlayerData, getAllPlayers, sendMessage } from "../../../grimac-api/index.js"

onCommand("tpa no", (player) => {
    const fromId = getPlayerData(player, "tpa_pending_from")
    const fromName = getPlayerData(player, "tpa_pending_name")
    
    if (!fromId) {
        sendMessage(player, "§7[§bGrimAC§7] §b您没有待处理的传送请求")
        return
    }
    
    setPlayerData(player, "tpa_pending_from", undefined)
    setPlayerData(player, "tpa_pending_name", undefined)
    
    const requester = getAllPlayers().find(p => p.id === fromId)
    if (requester) {
        sendMessage(requester, `§7[§bGrimAC§7] §b对方拒绝了您的传送申请`)
    }
    
    sendMessage(player, `§7[§bGrimAC§7] §b您已拒绝 §e${fromName} §b的传送申请`)
})
