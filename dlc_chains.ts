import { GameEvent } from './types';

export const NEW_CHAIN_EVENTS: GameEvent[] = [
    // ==========================================
    // CHAIN 1: The Rival (宿命死对头)
    // ==========================================
    {
        id: 'ce_rival_1',
        title: '宿命的相遇',
        description: '入职培训上，一位海归博士“贾教授”公开质疑你的研究方向是“夕阳产业”，并扬言要比你先拿到杰青。',
        category: 'career',
        // 早期触发 (2-8年)
        condition: (s, t, c, f, y) => y >= 2 && y <= 8 && !f['rival_met'],
        choices: [
            { text: '当众回怼，立下战书', description: '梁子结下了！你们开始了长达几十年的明争暗斗。', effect: () => ({ academic: 1 }), setFlag: 'rival_met' }, // Simplified: generic met flag
            { text: '无视他，专注自己', description: '他觉得被轻视了，反而更加针对你。', effect: () => ({ reputation: 1 }), setFlag: 'rival_met' },
            { text: '主动示好，寻求合作', description: '对方愣住了，虽然没接受，但敌意减少了。', effect: () => ({ resources: 1 }), setFlag: 'rival_peace' }
        ]
    },
    {
        id: 'ce_rival_2',
        title: '冤家路窄',
        description: '年度重点项目答辩现场，你发现主审评委竟然是“贾教授”（或者是他的恩师）。',
        category: 'career',
        // 中期触发 (10-20年)
        condition: (s, t, c, f, y) => y >= 10 && y <= 20 && (!!f['rival_met'] || !!f['rival_peace']) && !f['rival_stage2'],
        choices: [
            { text: '硬着头皮讲，靠实力说话', description: '虽然他提问刁钻，但你的完美表现征服了其他评委。', effect: () => ({ academic: 2, resources: 2 }), setFlag: 'rival_stage2' },
            { text: '暗示之前的恩怨，卖惨', description: '场面极度尴尬，项目黄了，但他在圈内落了个“气量小”的名声。', effect: () => ({ reputation: -1, resources: -2 }), setFlag: 'rival_stage2' },
            { text: '私下请吃饭疏通', description: '他在酒桌上暗示：只要你让出第一作者，项目就给你过。', effect: () => ({ resources: 4, reputation: -2, academic: -2 }), setFlag: 'rival_stage2' }
        ]
    },
    {
        id: 'ce_rival_3',
        title: '巅峰对决',
        description: '你是下一任院长的热门人选，而唯一的竞争对手正是“贾教授”。此时有人匿名寄来了他的学术造假黑料。',
        category: 'career',
        // 晚期触发 (22+年)
        condition: (s, t, c, f, y) => y >= 22 && !!f['rival_stage2'] && !f['rival_end'],
        choices: [
            { text: '匿名举报，彻底击溃他', description: '他身败名裂，你当上了院长。但深夜里你感到一丝寒意，从此没人敢与你交心。', effect: () => ({ resources: 5, reputation: -3 }), setFlag: 'rival_end' },
            { text: '销毁黑料，公平竞争', description: '你输了竞选，但他得知真相后，在退休宴上当众向你敬了一杯酒。', effect: () => ({ reputation: 5, satisfaction: 2 }), setFlag: 'rival_end' },
            { text: '找他对质，逼他退出', description: '他选择了退休，但你也背上了“逼宫”的骂名。', effect: () => ({ resources: 3, reputation: -2 }), setFlag: 'rival_end' }
        ]
    },

    // ==========================================
    // CHAIN 2: Start-up Temptation (科研变现)
    // ==========================================
    {
        id: 'ce_biz_1',
        title: '资本的敲门砖',
        description: '一位自称风投合伙人的人找上门，说你的这项技术估值一个亿，怂恿你成立公司。',
        category: 'network',
        condition: (s, t, c, f, y) => s.academic >= 12 && s.resources >= 8 && !f['biz_started'],
        choices: [
            { text: '接受投资，成立公司', description: '你成为了董事长，但也踏入了未知的商海。', effect: () => ({ resources: 5, academic: -2 }), setFlag: 'biz_started' },
            { text: '拒绝，专注学术', description: '投资人骂你死脑筋，但学校表扬了你的纯粹。', effect: () => ({ reputation: 2, academic: 1 }) },
            { text: '通过学校技术转移中心转化', description: '流程繁琐，收益少，但胜在安全合规。', effect: () => ({ resources: 2, reputation: 1 }) }
        ]
    },
    {
        id: 'ce_biz_2',
        title: '利益冲突',
        description: '你的公司业务蒸蒸日上，但有人举报你利用实验室的学生和设备为私人公司干活。',
        category: 'risk',
        condition: (s, t, c, f, y) => !!f['biz_started'] && !f['biz_crisis'],
        choices: [
            { text: '辞去教职，全职创业', description: '你离开了学校。虽然不再是教授，但你成为了亿万富翁。', effect: () => ({ resources: 10, academic: -5, reputation: -2 }), setFlag: 'biz_crisis' },
            { text: '上交股份，息事宁人', description: '白忙活一场，不仅没赚到钱，还惹了一身骚。', effect: () => ({ resources: -5, reputation: -1 }), setFlag: 'biz_crisis' },
            { text: '试图掩盖（高风险）', description: '审计部门介入了...如果不幸被查实，后果不堪设想。', effect: () => ({ resources: 2 }), setFlag: 'biz_risk_high' } // Leads to ce_biz_3
        ]
    },
    {
        id: 'ce_biz_3',
        title: '【高危】国有资产流失',
        description: '审计结果出来了，认定你私自将学校的职务发明转入个人公司，涉嫌侵吞国有资产。',
        category: 'risk',
        condition: (s, t, c, f, y) => !!f['biz_risk_high'],
        choices: [
            { text: '变卖房产，退赔全部所得', description: '倾家荡产，保住了人身自由，但被学校解聘。', effect: () => ({ resources: -20, reputation: -10 }), setFlag: 'biz_failed' }, // Likely Game Over due to stats
            { text: '找法务团队死磕', description: '经过漫长的诉讼，你赢了，但学术声誉彻底毁了。', effect: () => ({ reputation: -10, resources: -5 }), setFlag: 'biz_failed' }
        ]
    },

    // ==========================================
    // CHAIN 3: Lab Safety Red Lines (安全红线)
    // ==========================================
    {
        id: 'ce_safe_1',
        title: '消失的剧毒品',
        description: '实验室盘点时，发现少了一克剧毒化学品（氰化物）。学生们都说没拿，记录本上也查不到。',
        category: 'risk',
        condition: (s, t, c, f, y) => !f['safe_incident'] && y > 3,
        choices: [
            { text: '立即上报保卫处和公安', description: '虽然挨了处分，实验室被封停整顿，但没有酿成大祸。', effect: () => ({ reputation: -2, academic: -2 }), setFlag: 'safe_reported' },
            { text: '全组封闭寻找，严禁声张', description: '最后在废液桶边找到了，虚惊一场，但埋下了隐患。', effect: () => ({ satisfaction: -2 }), setFlag: 'safe_hidden' },
            { text: '怀疑某个学生，严厉审讯', description: '学生心理崩溃，虽然找回了药品，但师生关系破裂。', effect: () => ({ satisfaction: -5 }), setFlag: 'safe_hidden' }
        ]
    },
    {
        id: 'ce_safe_2',
        title: '【高危】环保局突击检查',
        description: '有人举报你们实验室长期向下水道倾倒重金属废液。环保局带着检测设备来了。',
        category: 'risk',
        condition: (s, t, c, f, y) => !!f['safe_hidden'], // Hidden risks come back to bite
        choices: [
            { text: '阻挠执法，销毁证据', description: '罪加一等！你因妨碍公务被拘留，直接 Game Over。', effect: () => ({ reputation: -20, academic: -20, satisfaction: -20 }) },
            { text: '坦白从宽，认罚', description: '巨额罚款，全校通报。你的实验室资格被暂停一年。', effect: () => ({ resources: -5, reputation: -5, academic: -3 }), removeFlag: 'safe_hidden' }
        ]
    },

    // ==========================================
    // CHAIN 4: Romance (爱情线)
    // ==========================================
    {
        id: 'ce_love_1',
        title: '图书馆的邂逅',
        description: '在借阅绝版文献时，你和一位温文尔雅的异性同时伸手拿向了同一本书。',
        category: 'student', // Using student category for "personal life" flavor
        condition: (s, t, c, f, y) => y >= 3 && y <= 10 && !f['partner_met'],
        choices: [
            { text: '借机搭讪，请喝咖啡', description: '你们相谈甚欢，灵魂契合。', effect: () => ({ satisfaction: 2 }), setFlag: 'partner_met' },
            { text: '礼貌让书，转身离开', description: '科研人不需要爱情。', effect: () => ({ academic: 1 }) },
            { text: '跟对方讨论书中的错误', description: '对方觉得你是个怪人，但也留下了深刻印象。', effect: () => ({ reputation: 1 }), setFlag: 'partner_met' }
        ]
    },
    {
        id: 'ce_love_2',
        title: '最后的通牒',
        description: '你的伴侣（或暧昧对象）受够了你没日没夜的加班。“这个周末如果你再去实验室，我们就结束吧。”',
        category: 'risk', // Personal risk
        condition: (s, t, c, f, y) => !!f['partner_met'] && !f['partner_married'] && !f['partner_breakup'],
        choices: [
            { text: '放下工作，陪 Ta 去旅行', description: '你们的感情升温，步入了婚姻殿堂。', effect: () => ({ satisfaction: 5, resources: -2, academic: -1 }), setFlag: 'partner_married' },
            { text: '“实验正处在关键期...”', description: 'Ta 失望地离开了。你重回单身，唯有论文作伴。', effect: () => ({ academic: 2, satisfaction: -3 }), setFlag: 'partner_breakup' },
            { text: '带 Ta 一起去实验室', description: '“帮我记录一下数据。” Ta 居然觉得还挺有意思？（极低概率）', effect: () => ({ academic: 1, satisfaction: 1 }), setFlag: 'partner_married' } // Simplify logic
        ]
    },
    {
        id: 'ce_love_3',
        title: '结婚纪念日',
        description: '今天是你们结婚十周年纪念日，但你完全忘记了，还在改学生的论文。',
        category: 'student',
        condition: (s, t, c, f, y) => !!f['partner_married'] && y >= 15,
        choices: [
            { text: '紧急买花，跪搓衣板道歉', description: '虽然被骂了一顿，但家还是温馨的港湾。', effect: () => ({ resources: -1, satisfaction: 1 }) },
            { text: '关机装死', description: '你回家发现门锁换了。这可能是冷战的开始。', effect: () => ({ satisfaction: -3, academic: 1 }) },
            { text: '把论文作为礼物献给 Ta', description: '致谢里写了 Ta 的名字。Ta 既生气又感动。', effect: () => ({ reputation: 1, satisfaction: 1 }) }
        ]
    }
];