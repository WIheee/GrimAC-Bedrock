// anticheat/survival_anticheat/movement/speed.js
import { world, system } from "@minecraft/server"

// ========================================
// 基础物理常量
// ========================================
const BASE_WALK_SPEED = 0.3        // 步行
const BASE_SPRINT_SPEED = 0.66     // 疾跑
const BASE_SNEAK_SPEED = 0.075     // 潜行
const BASE_SWIM_SPEED = 0.5        // 游泳
const BASE_SOUL_SPEED_BONUS = 0.04 // 灵魂疾行每级加成
const TOLERANCE = 0.06             // 容差（网络波动）

// ========================================
// 存储数据
// ========================================
const playerData = new Map()
const violations = new Map()

// ========================================
// 动态阈值计算
// ========================================
function getPlayerMaxLegalSpeed(player) {
    let maxSpeed = BASE_WALK_SPEED

    // 疾跑
    if (player.isSprinting) {
        maxSpeed = BASE_SPRINT_SPEED
    }
    
    // 潜行（优先级最高）
    if (player.isSneaking) {
        maxSpeed = BASE_SNEAK_SPEED
    }

    // 游泳
    if (player.isInWater) {
        maxSpeed = BASE_SWIM_SPEED
    }

    // ===== 药水效果 =====
    const speedEffect = player.getEffect("speed")
    if (speedEffect) {
        const amplifier = speedEffect.amplifier + 1
        maxSpeed *= (1 + (0.30 * amplifier))
    }
    
    const slownessEffect = player.getEffect("slowness")
    if (slownessEffect) {
        const amplifier = slownessEffect.amplifier + 1
        maxSpeed *= Math.max(0.1, (1 - (0.15 * amplifier)))
    }

    // ===== 附魔加成 =====
    try {
        const equipment = player.getComponent("equippable")
        if (equipment) {
            const boots = equipment.getEquipment("Feet")
            if (boots) {
                const enchantments = boots.getComponent("enchantments")
                if (enchantments) {
                    // 灵魂疾行
                    const soulSpeed = enchantments.getEnchantment("soul_speed")
                    if (soulSpeed) {
                        maxSpeed += (BASE_SOUL_SPEED_BONUS * soulSpeed.level)
                    }
                    
                    // 深海探索者
                    const depthStrider = enchantments.getEnchantment("depth_strider")
                    if (depthStrider && player.isInWater) {
                        maxSpeed += (0.05 * depthStrider.level)
                    }
                }
            }
        }
    } catch (e) {
        // 附魔检测失败，忽略
    }

    // ===== 碰撞/垂直移动豁免 =====
    const vel = player.getVelocity()
    if (Math.abs(vel.y) > 0.5) {
        return 999  // 被炸飞、坠落等，直接豁免
    }

    // ===== 滑翔/骑乘豁免 =====
    if (player.isGliding || player.hasComponent("riding")) {
        return 999
    }

    return maxSpeed
}

// ========================================
// 主检测循环
// ========================================
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        // OP 豁免
        if (player.isOp()) continue

        const maxLegalSpeed = getPlayerMaxLegalSpeed(player)
        
        // 强制豁免
        if (maxLegalSpeed > 1) {
            playerData.delete(player.id)
            continue
        }

        const currentPos = player.location
        const currentVel = player.getVelocity()
        const data = playerData.get(player.id)
        
        if (!data) {
            playerData.set(player.id, { 
                lastValidPos: currentPos, 
                lastVel: currentVel 
            })
            continue
        }

        const hSpeed = Math.sqrt(currentVel.x**2 + currentVel.z**2)
        
        if (hSpeed > maxLegalSpeed + TOLERANCE) {
            // 静默拉回
            player.teleport(data.lastValidPos)
            
            // 记录 VL
            const key = `${player.id}_speed`
            const vl = (violations.get(key) || 0) + 1
            violations.set(key, vl)
            
            // 通知 OP
            for (const op of world.getAllPlayers()) {
                if (op.isOp()) {
                    op.sendMessage(`§7[§bGrimAC§7] §7${player.name} §ffailed §bSpeed §7${hSpeed.toFixed(3)}/${maxLegalSpeed.toFixed(3)} §7[vl:${vl}]`)
                }
            }
            
            // 调试日志
            console.warn(`[Speed] ${player.name} 水平速度=${hSpeed.toFixed(3)} 阈值=${maxLegalSpeed.toFixed(3)} vl:${vl}`)
        } else {
            // 正常移动，更新合法位置
            playerData.set(player.id, { 
                lastValidPos: currentPos, 
                lastVel: currentVel 
            })
        }
    }
}, 2)  // 每 2 tick 检测一次

// ========================================
// 每分钟清一次 VL
// ========================================
system.runInterval(() => {
    if (violations.size > 0) {
        console.warn(`[Speed] VL 已重置，清除了 ${violations.size} 条记录`)
        violations.clear()
    }
}, 1200)  // 1200 tick = 60 秒

console.warn("[Speed] 加速检测已加载，包含药水/附魔/姿态豁免，VL 每分钟重置")