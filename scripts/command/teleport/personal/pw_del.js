import { onCommandWithArgs, getPlayerJSON, setPlayerJSON, sendMessage } from "../../../grimac-api/index.js"

onCommandWithArgs("pw del ", (player, rawMessage, args) => {
    const name = args[0]
    if (!name) {
        sendMessage(player, "§7[§bGrimAC§7] §b请输入要删除的传送点名称")
        return
    }
    
    let points = getPlayerJSON(player, "points", {})
    
    if (!points[name]) {
        sendMessage(player, `§7[§bGrimAC§7] §b传送点 §e"${name}" §b不存在`)
        return
    }
    
    delete points[name]
    setPlayerJSON(player, "points", points)
    sendMessage(player, `§7[§bGrimAC§7] §b传送点 §e"${name}" §b已删除`)
})
