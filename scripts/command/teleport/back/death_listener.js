import { world } from "@minecraft/server"

// 使用 entityDie 事件，过滤出玩家
world.afterEvents.entityDie.subscribe((event) => {
    const entity = event.deadEntity
    
    // 只处理玩家
    if (entity.typeId !== "minecraft:player") return
    
    const player = entity
    const loc = player.location
    const dim = player.dimension.id
    
    player.setDynamicProperty("death_x", loc.x)
    player.setDynamicProperty("death_y", loc.y)
    player.setDynamicProperty("death_z", loc.z)
    player.setDynamicProperty("death_dimension", dim)
    
    player.sendMessage(`§7[§bGrimAC§7] §b死亡位置已记录,输入 §eback §b返回`)
})