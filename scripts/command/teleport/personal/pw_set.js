import { onCommandWithArgs, getPlayerJSON, setPlayerJSON, getPlayerLocation, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

onCommandWithArgs("pw set ", (player, rawMessage, args) => {
    const name = args[0]
    if (!name) {
        sendMessage(player, "§7[§bGrimAC§7] §b请输入传送点名称，例如: §epw set 矿洞")
        return
    }
    
    const loc = getPlayerLocation(player)
    const dim = getPlayerDimension(player)
    
    let points = getPlayerJSON(player, "points", {})
    points[name] = { x: loc.x, y: loc.y, z: loc.z, dimension: dim }
    setPlayerJSON(player, "points", points)
    
    sendMessage(player, `§7[§bGrimAC§7] §b传送点 §e"${name}" §b已保存！ §7(${loc.x.toFixed(0)}, ${loc.y.toFixed(0)}, ${loc.z.toFixed(0)})`)
})
