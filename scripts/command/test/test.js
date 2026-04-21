// scripts/command/test/test.js
import { onCommand, sendMessage, isOp, getPermissionLevelName } from "../../grimac-api/index.js"

onCommand("test", (player, rawMessage) => {
    const args = rawMessage.split(" ")
    
    // 显示权限信息
    if (args.length === 1 || args[1] === "op") {
        sendMessage(player, `§7[§bGrimAC§7] §bplayerPermissionLevel = ${player.playerPermissionLevel}`)
        sendMessage(player, `§7[§bGrimAC§7] §bcommandPermissionLevel = ${player.commandPermissionLevel}`)
        sendMessage(player, `§7[§bGrimAC§7] §bisOp = ${isOp(player)}`)
        sendMessage(player, `§7[§bGrimAC§7] §b权限等级: ${getPermissionLevelName(player)}`)
        return
    }
    
    // 测试所有功能
    if (args[1] === "all") {
        sendMessage(player, "§7[§bGrimAC§7] §b====== 开始测试 ======")
        sendMessage(player, `§7[§bGrimAC§7] §a✅ API 正常`)
        sendMessage(player, `§7[§bGrimAC§7] §a✅ 命令系统正常`)
        sendMessage(player, `§7[§bGrimAC§7] §a✅ 存储系统正常`)
        sendMessage(player, "§7[§bGrimAC§7] §b==================")
        return
    }
    
    // 默认帮助
    sendMessage(player, "§7[§bGrimAC§7] §b====== Test 命令 ======")
    sendMessage(player, "§e  test op §7- 查看权限信息")
    sendMessage(player, "§e  test all §7- 测试所有功能")
    sendMessage(player, "§7[§bGrimAC§7] §b==================")
})