import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (message !== "help" && message !== "#help" && 
        !message.startsWith("help ") && !message.startsWith("#help ")) return
    event.cancel = true
    
    system.run(() => {
        const args = message.split(" ")
        
        // 主帮助页面
        if (args.length === 1) {
            player.sendMessage("§7[§bGrimAC§7] §b====== 帮助分类 ======")
            player.sendMessage("§e  help tp §7- 传送相关命令")
            player.sendMessage("§e  help pw §7- 私人传送点命令")
            player.sendMessage("§e  help tpa §7- 玩家互传命令")
            player.sendMessage("§e  help admin §7- 管理员命令")
            player.sendMessage("§7[§bGrimAC§7] §b==================")
            return
        }
        
        const category = args[1]
        
        // 传送分类
        if (category === "tp") {
            player.sendMessage("§7[§bGrimAC§7] §b====== 传送命令 ======")
            player.sendMessage("§e  spawn §7- 传送回主城")
            player.sendMessage("§e  home §7- 传送回家")
            player.sendMessage("§e  sethome §7- 设置家的位置")
            player.sendMessage("§e  back §7- 返回死亡点/上次传送点")
            player.sendMessage("§e  rtp §7- 随机传送到野外")
            player.sendMessage("§7[§bGrimAC§7] §b==================")
        }
        
        // 私人传送点分类
        else if (category === "pw") {
            player.sendMessage("§7[§bGrimAC§7] §b====== 私人传送点 ======")
            player.sendMessage("§e  pw set <名称> §7- 保存当前位置为传送点")
            player.sendMessage("§e  pw go <名称> §7- 传送到指定传送点")
            player.sendMessage("§e  pw list §7- 查看所有已保存的传送点")
            player.sendMessage("§e  pw del <名称> §7- 删除指定传送点")
            player.sendMessage("§7[§bGrimAC§7] §b==================")
        }
        
        // 玩家互传分类
        else if (category === "tpa") {
            player.sendMessage("§7[§bGrimAC§7] §b====== 玩家互传 ======")
            player.sendMessage("§e  tpa <玩家名> §7- 请求传送到其他玩家")
            player.sendMessage("§e  tpa yes §7- 接受传送请求")
            player.sendMessage("§e  tpa no §7- 拒绝传送请求")
            player.sendMessage("§e  tpa 拉黑 <玩家名> §7- 拉黑玩家，拒绝其请求")
            player.sendMessage("§e  tpa 解除拉黑 <玩家名> §7- 解除拉黑")
            player.sendMessage("§e  tpa list §7- 查看黑名单")
            player.sendMessage("§7[§bGrimAC§7] §b==================")
        }
        
        // 管理员分类
        else if (category === "admin") {
            player.sendMessage("§7[§bGrimAC§7] §b====== 管理员命令 ======")
            player.sendMessage("§e  setspawn §7- 设置主城位置")
            player.sendMessage("§7[§bGrimAC§7] §b==================")
        }
        
        // 未知分类
        else {
            player.sendMessage("§7[§bGrimAC§7] §b未知分类，输入 §ehelp §b查看可用分类")
        }
    })
})