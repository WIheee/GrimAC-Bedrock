import { world, system } from "@minecraft/server"
// 导入所有命令
import "./command/index.js"

// 提示
world.afterEvents.playerJoin.subscribe((event) => {
    event.player.sendMessage("§7[§bGrimAC§7] §b输入 §ehelp §b查看可用命令")
})

// 心跳包
let number = 0
system.runInterval(() => {
    world.sendMessage(`§7[§bGrimAC§7] §bGrimAC §aheartbeat packet §i(${number})`)
    number = number+1
}, 6000)