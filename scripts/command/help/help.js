import { world, system } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender
    const message = event.message
    
    if (message !== "help" && message !== "#help") return
    event.cancel = true
    
    system.run(() => {
        player.sendMessage("§7[§bGrimAC§7] §b====== 可用命令 ======")
        player.sendMessage("§e  home §7- 传送回家")
        player.sendMessage("§e  sethome §7- 设置家的位置")
        player.sendMessage("§e  pw set <名称> §7- 保存私人传送点")
        player.sendMessage("§e  pw go <名称> §7- 传送到私人传送点")
        player.sendMessage("§e  pw list §7- 查看私人传送点列表")
        player.sendMessage("§e  pw del <名称> §7- 删除私人传送点")
        player.sendMessage("§e  back §7- 返回死亡点")
        player.sendMessage("§e  tpa <玩家名> §7- 请求传送到其他玩家")
        player.sendMessage("§e  tpa yes §7- 接受传送请求")
        player.sendMessage("§e  tpa no §7- 拒绝传送请求")
        player.sendMessage("§e  tpa 拉黑 <玩家名> §7- 拉黑玩家")
        player.sendMessage("§e  tpa 解除拉黑 <玩家名> §7- 解除拉黑玩家")
        player.sendMessage("§e  tpa list §7- 查看黑名单")
        player.sendMessage("§e  rtp §7- 随机传送到野外")
        player.sendMessage("§e  help §7- 显示此帮助")
        player.sendMessage("§7[§bGrimAC§7] §b==================")
    })
})