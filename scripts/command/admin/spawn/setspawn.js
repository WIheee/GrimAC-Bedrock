import { onCommand, setWorldData, getPlayerLocation, getPlayerDimension, isOp, sendMessage } from "../../../grimac-api/index.js"

onCommand("setspawn", (player) => {
    if (!isOp(player)) {
        sendMessage(player, "§7[§bGrimAC§7] §b此命令仅管理员可用")
        return
    }
    
    const loc = getPlayerLocation(player)
    const dim = getPlayerDimension(player)
    
    setWorldData("spawn_x", loc.x)
    setWorldData("spawn_y", loc.y)
    setWorldData("spawn_z", loc.z)
    setWorldData("spawn_dimension", dim)
    
    sendMessage(player, `§7[§bGrimAC§7] §b主城已设置！ §7(${loc.x.toFixed(0)}, ${loc.y.toFixed(0)}, ${loc.z.toFixed(0)})`)
})
