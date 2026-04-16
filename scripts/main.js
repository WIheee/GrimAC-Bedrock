import { world, system } from "@minecraft/server"
// 导入所有命令
import "./command/command_index.js"
// 导入反作弊
import "./anticheat/anticheat_index.js"

// 心跳包
let number = 0
system.runInterval(() => {
    world.sendMessage(`§7[§bGrimAC§7] §bGrimAC §aheartbeat packet §i(${number})`)
    number = number + 1
}, 6000) 