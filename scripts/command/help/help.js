import { onCommand, sendMessage } from "../../grimac-api/index.js"

onCommand("help", (player, rawMessage) => {
    const args = rawMessage.split(" ")
    
    if (args.length === 1 || args[1] === "") {
        sendMessage(player, "§7[§bGrimAC§7] §b====== 帮助分类 ======")
        sendMessage(player, "§e  help tp §7- 传送相关命令")
        sendMessage(player, "§e  help pw §7- 私人传送点命令")
        sendMessage(player, "§e  help tpa §7- 玩家互传命令")
        sendMessage(player, "§e  help admin §7- 管理员命令")
        sendMessage(player, "§7[§bGrimAC§7] §b==================")
        return
    }
    
    const category = args[1].toLowerCase()
    
    if (category === "tp") {
        sendMessage(player, "§7[§bGrimAC§7] §b====== 传送命令 ======")
        sendMessage(player, "§e  spawn §7- 传送回主城")
        sendMessage(player, "§e  home §7- 传送回家")
        sendMessage(player, "§e  sethome §7- 设置家的位置")
        sendMessage(player, "§e  back §7- 返回死亡点/上次传送点")
        sendMessage(player, "§e  rtp §7- 随机传送到野外")
        sendMessage(player, "§7[§bGrimAC§7] §b==================")
    } else if (category === "pw") {
        sendMessage(player, "§7[§bGrimAC§7] §b====== 私人传送点 ======")
        sendMessage(player, "§e  pw set <名称> §7- 保存当前位置为传送点")
        sendMessage(player, "§e  pw go <名称> §7- 传送到指定传送点")
        sendMessage(player, "§e  pw list §7- 查看所有已保存的传送点")
        sendMessage(player, "§e  pw del <名称> §7- 删除指定传送点")
        sendMessage(player, "§7[§bGrimAC§7] §b==================")
    } else if (category === "tpa") {
        sendMessage(player, "§7[§bGrimAC§7] §b====== 玩家互传 ======")
        sendMessage(player, "§e  tpa <玩家名> §7- 请求传送到其他玩家")
        sendMessage(player, "§e  tpa yes §7- 接受传送请求")
        sendMessage(player, "§e  tpa no §7- 拒绝传送请求")
        sendMessage(player, "§e  tpa 拉黑 <玩家名> §7- 拉黑玩家，拒绝其请求")
        sendMessage(player, "§e  tpa 解除拉黑 <玩家名> §7- 解除拉黑")
        sendMessage(player, "§e  tpa list §7- 查看黑名单")
        sendMessage(player, "§7[§bGrimAC§7] §b==================")
    } else if (category === "admin") {
        sendMessage(player, "§7[§bGrimAC§7] §b====== 管理员命令 ======")
        sendMessage(player, "§e  setspawn §7- 设置主城位置")
        sendMessage(player, "§7[§bGrimAC§7] §b==================")
    } else {
        sendMessage(player, "§7[§bGrimAC§7] §b未知分类，输入 §ehelp §b查看可用分类")
    }
})
