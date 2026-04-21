// scripts/command/teleport/home/sethome.js
import { onCommand, setPlayerData, getPlayerLocation, getPlayerDimension, sendMessage } from "../../../grimac-api/index.js"

onCommand("sethome", (player) => {
    const loc = getPlayerLocation(player)
    const dim = getPlayerDimension(player)
    
    setPlayerData(player, "home_x", loc.x)
    setPlayerData(player, "home_y", loc.y)
    setPlayerData(player, "home_z", loc.z)
    setPlayerData(player, "home_dimension", dim)
    
    sendMessage(player, `§7[§bGrimAC§7] §b家已设置,坐标: §e${loc.x.toFixed(1)}, ${loc.y.toFixed(1)}, ${loc.z.toFixed(1)}`)
})