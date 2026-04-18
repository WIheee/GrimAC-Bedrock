// anticheat/survival_anticheat/movement/fly.js
import { world, system } from "@minecraft/server"

// ========================================
// 基础物理常量
// ========================================
const GRAVITY = 0.08               // 重力加速度
const TOLERANCE = 0.06             // 容差

// ========================================
// 存储数据
// ========================================
const playerData = new Map()
const violations = new Map()

// ========================================
// 检查脚下第 4 格是否有方块
// ========================================
function hasBlockAtDepth(player, depth) {
    const dimension = player.dimension
    const pos = player.location
    
    try {
        const block = dimension.getBlock({ 
            x: Math.floor(pos.x), 
            y: Math.floor(pos.y - depth), 
            z: Math.floor(pos.z) 
        })
        return block && block.typeId !== "minecraft:air"
    } catch (e) {
        return false
    }
}

// ========================================
// 查找最近的地面
// ========================================
function findGround(player) {
    const dimension = player.dimension
    const startX = player.location.x
    const startZ = player.location.z
    
    // 从玩家当前位置向下找，直到找到固体方块
    for (let y = Math.floor(player.location.y); y > -64; y--) {
        try {
            const block = dimension.getBlock({ x: Math.floor(startX), y: y, z: Math.floor(startZ) })
            if (block && block.typeId !== "minecraft:air") {
                // 确保上面两格是空气（玩家有站立空间）
                const above1 = dimension.getBlock({ x: Math.floor(startX), y: y + 1, z: Math.floor(startZ) })
                const above2 = dimension.getBlock({ x: Math.floor(startX), y: y + 2, z: Math.floor(startZ) })
                if (above1?.typeId === "minecraft:air" && above2?.typeId === "minecraft:air") {
                    return y + 1  // 返回地面上一格的位置
                }
            }
        } catch (e) {
            // 方块获取失败，继续
        }
    }
    
    // 找不到地面，返回 null
    return null
}

// ========================================
// 主检测循环
// ========================================
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        // ===== 豁免列表 =====
        
        // 1. OP 豁免（测试时可注释掉）
        if (player.isOp()) continue
        
        // 2. 滑翔豁免
        if (player.isGliding) continue
        
        // 3. 骑乘豁免
        if (player.hasComponent("riding")) continue
        
        // 4. 水中豁免
        if (player.isInWater) continue
        
        // 5. 在地面豁免（不检测）
        if (player.isOnGround) {
            playerData.delete(player.id)
            continue
        }
        
        // 6. 缓降药水豁免
        if (player.getEffect("slow_falling")) continue
        
        // 7. 漂浮效果豁免
        if (player.getEffect("levitation")) continue
        
        // 8. 碰撞/爆炸豁免（Y 轴速度突变）
        const currentVel = player.getVelocity()
        if (Math.abs(currentVel.y) > 1.0) {
            playerData.delete(player.id)
            continue
        }
        
        // ===== 新增：脚下第 4 格有方块就跳过检测 =====
        if (hasBlockAtDepth(player, 4)) {
            playerData.delete(player.id)
            continue
        }

        const currentPos = player.location
        const data = playerData.get(player.id)
        
        if (!data) {
            playerData.set(player.id, { 
                lastVel: currentVel 
            })
            continue
        }

        // 预测 Y 轴速度（重力影响）
        const predictedY = data.lastVel.y - GRAVITY
        const actualY = currentVel.y
        
        // 如果实际速度比预测速度快很多，说明有额外向上的力（飞行）
        if (actualY - predictedY > TOLERANCE) {
            // ===== 拉到地面 =====
            const groundY = findGround(player)
            
            if (groundY !== null) {
                player.teleport({ 
                    x: currentPos.x, 
                    y: groundY, 
                    z: currentPos.z 
                })
                console.warn(`[Fly] ${player.name} 已拉到地面 Y=${groundY}`)
            } else {
                // 找不到地面，送回主城
                const spawnX = world.getDynamicProperty("spawn_x")
                const spawnY = world.getDynamicProperty("spawn_y")
                const spawnZ = world.getDynamicProperty("spawn_z")
                if (spawnX !== undefined) {
                    player.teleport({ x: spawnX, y: spawnY, z: spawnZ })
                    console.warn(`[Fly] ${player.name} 找不到地面，送回主城`)
                }
            }
            
            // 清除数据，重新开始
            playerData.delete(player.id)
            
            // 记录 VL
            const key = `${player.id}_fly`
            const vl = (violations.get(key) || 0) + 1
            violations.set(key, vl)
            
            // 通知 OP
            for (const op of world.getAllPlayers()) {
                if (op.isOp()) {
                    op.sendMessage(`§7[§bGrimAC§7] §7${player.name} §ffailed §bFly §7预测=${predictedY.toFixed(3)} 实际=${actualY.toFixed(3)} §7[vl:${vl}]`)
                }
            }
        } else {
            // 正常移动，更新速度
            playerData.set(player.id, { 
                lastVel: currentVel 
            })
        }
    }
}, 2)

// ========================================
// 每分钟清一次 VL
// ========================================
system.runInterval(() => {
    if (violations.size > 0) {
        console.warn(`[Fly] VL 已重置，清除了 ${violations.size} 条记录`)
        violations.clear()
    }
}, 1200)

console.warn("[Fly] 飞行检测已加载，拉回地面模式（脚下4格有方块豁免）")