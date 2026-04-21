import { onCommand, getPlayerJSON, sendMessage } from "../../../grimac-api/index.js"

onCommand("pw list", (player) => {
    const points = getPlayerJSON(player, "points", {})
    const names = Object.keys(points)
    
    if (names.length === 0) {
        sendMessage(player, "§7[§bGrimAC§7] §b你还没有保存任何传送点，输入 §epw set 名称 §b来创建")
        return
    }
    
    sendMessage(player, `§7[§bGrimAC§7] §b====== 你的传送点 (${names.length}个) ======`)
    
    for (const name of names) {
        const p = points[name]
        const dimName = p.dimension === "minecraft:overworld" ? "主世界" : 
                       p.dimension === "minecraft:nether" ? "下界" : "末地"
        sendMessage(player, `§e  ${name} §7- ${dimName} (${p.x.toFixed(0)}, ${p.y.toFixed(0)}, ${p.z.toFixed(0)})`)
    }
    
    sendMessage(player, "§7使用 §epw go 名称 §7传送，§epw del 名称 §7删除")
})
