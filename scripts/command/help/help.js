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
        player.sendMessage("§e  set <名称> §7- 保存传送点")
        player.sendMessage("§e  go <名称> §7- 传送到传送点")
        player.sendMessage("§e  list §7- 查看传送点列表")
        player.sendMessage("§e  del <名称> §7- 删除传送点")
        player.sendMessage("§e  back §7- 返回死亡点")
        player.sendMessage("§e  help §7- 显示此帮助")
        player.sendMessage("§7[§bGrimAC§7] §b==================")
    })
})