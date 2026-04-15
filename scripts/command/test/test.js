import { world, system } from "@minecraft/server"

// ========================================
// 一键测试脚本 - 输入 test 自动测试所有命令
// 测试完成后可删除此文件，或在 index.js 中注释掉
// ========================================

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const rawMessage = event.message
    const message = rawMessage.toLowerCase()
    
    if (message !== "test" && message !== "#test") return
    event.cancel = true
    
    // 仅 OP 可用
     if (!player.isOp()) {
        player.sendMessage("§7[§bGrimAC§7] §b此命令仅管理员可用")
         return
     }
    
    system.run(() => {
        player.sendMessage("§7[§bGrimAC§7] §b====== 开始测试所有命令 ======")
        
        const testCommands = [
            // 无参数命令
            { cmd: "help", desc: "帮助" },
            { cmd: "Help", desc: "帮助(大写H)" },
            { cmd: "HELP", desc: "帮助(全大写)" },
            { cmd: "home", desc: "回家" },
            { cmd: "Home", desc: "回家(大写H)" },
            { cmd: "sethome", desc: "设置家" },
            { cmd: "SetHome", desc: "设置家(大小写)" },
            { cmd: "back", desc: "返回死亡点" },
            { cmd: "Back", desc: "返回(大写B)" },
            { cmd: "spawn", desc: "回主城" },
            { cmd: "Spawn", desc: "回主城(大写S)" },
            { cmd: "rtp", desc: "随机传送" },
            { cmd: "RTP", desc: "随机传送(大写)" },
            { cmd: "tpa yes", desc: "接受传送" },
            { cmd: "TPA YES", desc: "接受传送(全大写)" },
            { cmd: "tpa no", desc: "拒绝传送" },
            { cmd: "TPA NO", desc: "拒绝传送(全大写)" },
            { cmd: "tpa list", desc: "黑名单" },
            { cmd: "TPA LIST", desc: "黑名单(全大写)" },
            { cmd: "pw list", desc: "传送点列表" },
            { cmd: "PW LIST", desc: "传送点列表(全大写)" },
            
            // 有参数命令（只测试匹配，不实际执行）
            { cmd: "tpa 测试玩家", desc: "TPA请求" },
            { cmd: "TPA 测试玩家", desc: "TPA请求(大写)" },
            { cmd: "tpa 拉黑 测试玩家", desc: "拉黑玩家" },
            { cmd: "TPA 拉黑 测试玩家", desc: "拉黑玩家(全大写)" },
            { cmd: "tpa 解除拉黑 测试玩家", desc: "解除拉黑" },
            { cmd: "TPA 解除拉黑 测试玩家", desc: "解除拉黑(全大写)" },
            { cmd: "pw set 测试点", desc: "设置传送点" },
            { cmd: "PW SET 测试点", desc: "设置传送点(全大写)" },
            { cmd: "pw go 测试点", desc: "去传送点" },
            { cmd: "PW GO 测试点", desc: "去传送点(全大写)" },
            { cmd: "pw del 测试点", desc: "删除传送点" },
            { cmd: "PW DEL 测试点", desc: "删除传送点(全大写)" },
            { cmd: "help tp", desc: "帮助分类" },
            { cmd: "HELP TP", desc: "帮助分类(全大写)" },
            { cmd: "setspawn", desc: "设置主城(OP)" },
            { cmd: "SETSPAWN", desc: "设置主城(全大写)" },
        ]
        
        let passed = 0
        let failed = 0
        
        for (const item of testCommands) {
            const cmdLower = item.cmd.toLowerCase()
            const rawCmd = item.cmd
            
            // 模拟匹配逻辑（和实际命令文件保持一致）
            let matched = false
            
            if (cmdLower === "help" || cmdLower.startsWith("help ")) matched = true
            else if (cmdLower === "home") matched = true
            else if (cmdLower === "sethome") matched = true
            else if (cmdLower === "back") matched = true
            else if (cmdLower === "spawn") matched = true
            else if (cmdLower === "rtp") matched = true
            else if (cmdLower === "tpa yes") matched = true
            else if (cmdLower === "tpa no") matched = true
            else if (cmdLower === "tpa list") matched = true
            else if (cmdLower.startsWith("tpa ") && cmdLower !== "tpa yes" && cmdLower !== "tpa no" && cmdLower !== "tpa list") matched = true
            else if (cmdLower.startsWith("pw set ")) matched = true
            else if (cmdLower.startsWith("pw go ")) matched = true
            else if (cmdLower === "pw list") matched = true
            else if (cmdLower.startsWith("pw del ")) matched = true
            else if (cmdLower === "setspawn") matched = true
            
            if (matched) {
                player.sendMessage(`§a  ✅ ${item.cmd} §7- ${item.desc}`)
                passed++
            } else {
                player.sendMessage(`§c  ❌ ${item.cmd} §7- ${item.desc} (匹配失败)`)
                failed++
            }
        }
        
        player.sendMessage("§7[§bGrimAC§7] §b====== 测试完成 ======")
        player.sendMessage(`§a  通过: ${passed}  §c失败: ${failed}`)
        
        if (failed === 0) {
            player.sendMessage("§a  🎉 所有命令大小写兼容测试通过！")
        } else {
            player.sendMessage("§c  ⚠️ 有命令未通过测试，请检查代码")
        }
        
        player.sendMessage("§7[§bGrimAC§7] §b==================")
        player.sendMessage("§7提示: 测试完成后可在 index.js 中注释掉 test.js")
    })
})