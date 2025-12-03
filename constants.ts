import { GameEvent, Trait, Achievement, Upgrade, Title, Ending, KPI, ProjectDefinition, GameState, Stats } from './types';
import { DLC_EVENTS } from './dlc_events';

// --- Traits (符合 Stats 类型) ---
export const TRAITS: Trait[] = [
  // Professional
  { id: 't1', name: '学术大牛', category: 'professional', description: '发表论文如喝水，由于太专注于学术，可能忽略人际。', effect: (s) => ({ ...s, academic: s.academic + 2, reputation: s.reputation + 1, satisfaction: s.satisfaction - 1 }) },
  { id: 't2', name: '跨学科人才', category: 'professional', description: '擅长结合不同领域，容易获得意外的资源支持。', effect: (s) => ({ ...s, academic: s.academic + 1, resources: s.resources + 2 }) },
  { id: 't3', name: '实干家', category: 'professional', description: '脚踏实地，基础属性均衡。', effect: (s) => ({ ...s, academic: s.academic + 1, satisfaction: s.satisfaction + 1 }) },
  { id: 't4', name: '理论派', category: 'professional', description: '理论功底深厚，但实践资源较少。', effect: (s) => ({ ...s, academic: s.academic + 2, resources: s.resources - 1 }) },
  { id: 't5', name: '海外优青', category: 'professional', description: '海归背景，初始资源丰富，但可能水土不服。', effect: (s) => ({ ...s, academic: s.academic + 2, resources: s.resources + 2, satisfaction: s.satisfaction - 1 }) },

  // Mentorship
  { id: 't6', name: '温柔耐心', category: 'mentorship', description: '把学生当孩子看，学生满意度极高，但可能被认为太软弱。', effect: (s) => ({ ...s, satisfaction: s.satisfaction + 2, reputation: s.reputation - 1 }) },
  { id: 't7', name: '严格犀利', category: 'mentorship', description: '高压政策，出成果快，但学生怨声载道。', effect: (s) => ({ ...s, academic: s.academic + 2, satisfaction: s.satisfaction - 2 }) },
  { id: 't8', name: '放养导师', category: 'mentorship', description: '无为而治，学生全靠自觉。', effect: (s) => ({ ...s, satisfaction: s.satisfaction + 1, academic: s.academic - 1 }) },
  { id: 't9', name: 'PUA大师', category: 'mentorship', description: '擅长精神控制（不可取），短期压榨出成果，风险极大。', effect: (s) => ({ ...s, academic: s.academic + 3, satisfaction: s.satisfaction - 3 }) },
  { id: 't10', name: '就业指导师', category: 'mentorship', description: '不推学术推就业，学生毕业去向好，口碑佳。', effect: (s) => ({ ...s, reputation: s.reputation + 2, academic: s.academic - 2 }) },

  // Workplace
  { id: 't11', name: '资源人脉广', category: 'workplace', description: '上面有人，横向项目不断。', effect: (s) => ({ ...s, resources: s.resources + 2, academic: s.academic - 1 }) },
  { id: 't12', name: '佛系随缘', category: 'workplace', description: '不争不抢，心态稳，难出大成就但也难出事。', effect: (s) => ({ ...s, reputation: s.reputation + 1, resources: s.resources - 1 }) },
  { id: 't13', name: '社交达人', category: 'workplace', description: '酒桌文化精通，混迹各种圈子。', effect: (s) => ({ ...s, resources: s.resources + 2, reputation: s.reputation - 1 }) },
  { id: 't14', name: '行政骨干', category: 'workplace', description: '双肩挑，既做学术也做行政，权力大事务多。', effect: (s) => ({ ...s, resources: s.resources + 2, academic: s.academic - 1 }) },
  { id: 't15', name: '独行侠', category: 'workplace', description: '不站队，不混圈，全靠实力说话。', effect: (s) => ({ ...s, resources: s.resources - 2, academic: s.academic + 2 }) },
];

// --- Upgrades (Shop) ---
export const UPGRADES: Upgrade[] = [
    {
        id: 'u_coffee',
        name: '全自动咖啡机',
        description: '实验室的燃料。每年学生满意度 +1。',
        cost: 5,
        passive: () => ({ satisfaction: 1 })
    },
    {
        id: 'u_server',
        name: '高性能计算集群',
        description: '算力就是生产力。每年学术 +1。',
        cost: 12,
        passive: () => ({ academic: 1 })
    },
    {
        id: 'u_chair',
        name: '人体工学椅',
        description: '保护腰椎，人人有责。每年满意度 +1，声望 +1。',
        cost: 8,
        passive: () => ({ satisfaction: 1, reputation: 1 })
    },
    {
        id: 'u_admin',
        name: '行政助理',
        description: '雇人处理杂事。每年资源 +1，学术 +1。',
        cost: 15,
        passive: () => ({ resources: 1, academic: 1 })
    },
    {
        id: 'u_lounge',
        name: '休闲区 & 游戏机',
        description: '劳逸结合。每年满意度 +2。',
        cost: 10,
        passive: () => ({ satisfaction: 2 })
    },
    // [Important] Game Engine must set flag 'has_insurance' = true when this is bought
    {
        id: 'u_insurance',
        name: '高端医疗保险',
        description: '年纪大了，命最重要。防止因过劳导致的直接游戏结束。',
        cost: 20,
        passive: () => ({}) 
    }
];

// --- Titles (Promotion) ---
// Note: Title condition receives GameState, so accessing stats/achievements is safe.
export const TITLES: Title[] = [
    {
        id: 'title_lecturer',
        name: '讲师',
        level: 1,
        condition: () => true,
        passive: () => ({})
    },
    {
        id: 'title_associate',
        name: '副教授',
        level: 2,
        condition: (s) => s.stats.academic >= 12 && s.stats.reputation >= 10 && s.year >= 5,
        passive: () => ({ resources: 1 })
    },
    {
        id: 'title_professor',
        name: '教授',
        level: 3,
        condition: (s) => s.stats.academic >= 16 && s.stats.reputation >= 14 && s.year >= 10,
        passive: () => ({ resources: 1, reputation: 1 })
    },
    {
        id: 'title_distinguished',
        name: '杰出教授',
        level: 4,
        condition: (s) => s.stats.academic >= 19 && s.stats.reputation >= 18 && s.achievements.length >= 2,
        passive: () => ({ resources: 2, reputation: 1 })
    },
    {
        id: 'title_academician',
        name: '院士',
        level: 5,
        condition: (s) => s.stats.academic >= 20 && s.stats.reputation >= 20 && s.achievements.length >= 4,
        passive: () => ({ resources: 2, reputation: 2, academic: 1 })
    }
];

// --- Endings ---
// Note: Ending condition receives (stats, achievements, title, flags), so accessing these is safe.
export const ENDINGS: Ending[] = [
    // Hidden Endings
    {
        id: 'end_hidden_nobel',
        title: '【传说】诺贝尔奖得主',
        description: '来自斯德哥尔摩的电话改变了一切。你不仅代表了人类智慧的巅峰，更成为了国家的骄傲。',
        condition: (s, a, t, flags) => !!flags['nobel_winner'],
        color: 'text-amber-500',
        bgColor: 'bg-stone-900'
    },
    {
        id: 'end_hidden_minister',
        title: '【隐藏】教育部长',
        description: '你从学术界华丽转身，步入政坛，成为了教育政策的制定者。',
        condition: (s, a, t, flags) => !!flags['is_minister'],
        color: 'text-red-700',
        bgColor: 'bg-red-50'
    },
    {
        id: 'end_hidden_ai',
        title: '【隐藏】机械飞升',
        description: '你的意识上传到了高性能计算集群。你已不再是凡人之躯，你即是数据，你即是永恒。',
        condition: (s, a, t, flags) => !!flags['is_ai'],
        color: 'text-cyan-500',
        bgColor: 'bg-slate-900'
    },
    
    // Tragic/Bad Endings
    {
        id: 'end_tragic_overwork',
        title: '【悲剧】倒在黎明前',
        description: '长期的过度劳累压垮了你的身体。你的论文发表了，但你再也看不到了。',
        condition: (s, a, t, flags) => !!flags['died_of_overwork'],
        color: 'text-gray-500',
        bgColor: 'bg-black'
    },
    {
        id: 'end_tragic_scandal',
        title: '【恶名】学术败类',
        description: '你因严重的学术不端或丑闻被永久除名。你的名字成了反面教材。',
        condition: (s, a, t) => s.reputation <= 0,
        color: 'text-red-900',
        bgColor: 'bg-red-100'
    },

    // Absurd Endings
    {
        id: 'end_absurd_influencer',
        title: '【荒诞】带货大V',
        description: '虽然学术搞得一团糟，但你在抖音上吐槽科研火了。现在你卖试剂盒赚的比诺奖奖金还多。',
        condition: (s, a, t) => s.reputation >= 20 && s.academic <= 10,
        color: 'text-fuchsia-600',
        bgColor: 'bg-fuchsia-50'
    },

    // Standard Endings
    {
        id: 'end_legend_academic',
        title: '【传说】学术泰斗',
        description: '你的名字被写进了教科书，成为后世仰望的灯塔。你在学术界的地位无人能撼动，是真正的国士无双。',
        condition: (s, a, t) => s.academic >= 22 && t === 'title_academician',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
    },
    {
        id: 'end_legend_educator',
        title: '【传说】万世师表',
        description: '你的学生遍布全球名校和科研机构，桃李满天下。你不仅深受爱戴，更在教育界享有崇高的声望。',
        condition: (s, a, t) => s.satisfaction >= 20 && s.reputation >= 15 && s.academic >= 12 && a.includes('ach_1'),
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
    },
    {
        id: 'end_legend_tycoon',
        title: '【传说】产学研大亨',
        description: '你不仅学术有成，更建立了庞大的商业帝国。你的技术转化成果改变了行业，你也实现了财务自由。',
        condition: (s, a, t) => s.resources >= 22 && s.reputation >= 10,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50'
    },
    {
        id: 'end_master_school',
        title: '【卓越】名校校长',
        description: '你凭借极高的声望和行政能力，成为了这所大学的掌舵人。你的教育理念深深影响了这所百岁名校。',
        condition: (s, a, t) => s.reputation >= 18 && s.academic >= 15,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
    },
    {
        id: 'end_expert',
        title: '【优秀】知名教授',
        description: '你在领域内享有盛誉，退休生活安稳富足。同行提起你时，总会竖起大拇指。',
        condition: (s, a, t) => s.academic >= 15 || s.reputation >= 15,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
    },
    {
        id: 'end_mentor',
        title: '【优秀】良师益友',
        description: '你也许没有惊人的学术成就，但对学生无微不至的关怀改变了很多人的人生轨迹。',
        condition: (s, a, t) => s.satisfaction >= 16,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50'
    },
    {
        id: 'end_rich',
        title: '【优秀】富家翁',
        description: '虽然学术成就平平，但你凭借敏锐的商业嗅觉积累了大量财富，退休后环游世界去了。',
        condition: (s, a, t) => s.resources >= 15,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50'
    },
    {
        id: 'end_good',
        title: '【普通】光荣退休',
        description: '你勤勤恳恳工作了一辈子，虽然没有惊天动地的成就，但也问心无愧。',
        condition: () => true,
        color: 'text-stone-600',
        bgColor: 'bg-stone-50'
    }
];

// --- Achievements ---
// Note: Condition receives GameState.
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    title: '桃李芬芳',
    description: '成功培养并毕业 10 名学生。',
    condition: (state: GameState) => state.students.filter(s => s.status === 'graduated').length >= 10,
    reward: { reputation: 3 },
    unlocked: false
  },
  {
    id: 'ach_2',
    title: '学术巅峰',
    description: '学术属性达到 20 满分。',
    condition: (state: GameState) => state.stats.academic >= 20,
    reward: { resources: 2 },
    unlocked: false
  },
  {
    id: 'ach_3',
    title: '经费燃烧者',
    description: '累计遭遇 3 次经费不足或审计危机（资源 < 3）。',
    condition: (state: GameState) => state.stats.resources < 3,
    reward: { academic: 1 },
    unlocked: false
  },
  {
    id: 'ach_4',
    title: '生还者',
    description: '在被举报或重大事故后依然幸存（Reputation < 3 后恢复到 10+）。',
    condition: (state: GameState) => state.stats.reputation >= 10 && state.history.some(h => h.message.includes('声誉受损')),
    reward: { satisfaction: 2 },
    unlocked: false
  },
  {
    id: 'ach_5',
    title: '六边形战士',
    description: '所有属性均超过 15。',
    condition: (state: GameState) => state.stats.academic >= 15 && state.stats.reputation >= 15 && state.stats.resources >= 15 && state.stats.satisfaction >= 15,
    reward: { academic: 2, reputation: 2 },
    unlocked: false
  }
];

// --- Phase Evaluations ---
export const PHASE_EVALUATIONS = [
  { minYear: 1, maxYear: 5, title: '青椒生存期', desc: '在非升即走的压力下摸爬滚打。' },
  { minYear: 6, maxYear: 10, title: '骨干成长期', desc: '逐渐站稳脚跟，开始建立自己的小团队。' },
  { minYear: 11, maxYear: 15, title: '学术爆发期', desc: '精力最旺盛的阶段，成果井喷。' },
  { minYear: 16, maxYear: 20, title: '瓶颈转型期', desc: '面临中年危机，思考是继续学术还是转向行政。' },
  { minYear: 21, maxYear: 25, title: '权威确立期', desc: '江湖地位已成，但需要提防“晚节不保”。' },
  { minYear: 26, maxYear: 30, title: '退休倒计时', desc: '看淡名利，但体检报告上的红字越来越多。' }
];

// --- KPIs ---
// Note: Condition receives Stats.
export const KPIS: KPI[] = [
    {
        year: 5,
        description: '非升即走考核：学术造诣 >= 8 或 口碑声望 >= 8',
        condition: (s) => s.academic >= 8 || s.reputation >= 8,
        failMessage: '【解聘】未能通过首个聘期的考核，学校决定不再续聘。'
    },
    {
        year: 10,
        description: '中期考核：学术造诣 >= 12',
        condition: (s) => s.academic >= 12,
        failMessage: '【解聘】中期考核学术成果严重不足，惨遭淘汰。'
    },
    {
        year: 15,
        description: '正高晋升压力：口碑声望 >= 14',
        condition: (s) => s.reputation >= 14,
        failMessage: '【解聘】长期未能晋升正高，被学校边缘化并劝退。'
    },
    {
        year: 20,
        description: '【困难】学科带头人考核：学术 >= 18 且 资源 >= 12',
        condition: (s) => s.academic >= 18 && s.resources >= 12,
        failMessage: '【被免职】未能承担起学科建设重任，被剥夺实验室主导权，被迫提前退休。'
    },
    {
        year: 25,
        description: '【噩梦】终身成就考核：任意两项属性 >= 18',
        condition: (s) => {
            let count = 0;
            if (s.academic >= 18) count++;
            if (s.reputation >= 18) count++;
            if (s.satisfaction >= 18) count++;
            if (s.resources >= 18) count++;
            return count >= 2;
        },
        failMessage: '【晚节不保】临近退休未能守住晚节，被学校劝退，只有微薄的退休金。'
    },
    {
        year: 30,
        description: '最终清算：未曾触发过“重大丑闻”且声望 >= 10',
        condition: (s) => s.reputation >= 10,
        failMessage: '【凄惨离场】虽然熬到了退休，但因声名狼藉，没有学生愿意来送别。'
    }
];

// --- Projects ---
export const PROJECTS: ProjectDefinition[] = [
    {
        id: 'proj_youth',
        name: '青年科学基金',
        type: 'national',
        duration: 3,
        reqStats: { academic: 6, reputation: 4 },
        costPerYear: { academic: -1 },
        reward: { academic: 3, resources: 3, reputation: 1 },
        penalty: { reputation: -1 },
        description: '年轻人的第一桶金。需要投入精力，导致短期学术增长变慢。'
    },
    {
        id: 'proj_corp',
        name: '企业横向攻关',
        type: 'corporate',
        duration: 2,
        reqStats: { resources: 4, reputation: 6 },
        costPerYear: { satisfaction: -1 },
        reward: { resources: 5, reputation: 1 },
        penalty: { reputation: -2, resources: -2 },
        description: '企业的加急项目。能赚大钱，但学生会被当成廉价劳动力。'
    },
    {
        id: 'proj_face',
        name: '国家面上项目',
        type: 'national',
        duration: 4,
        reqStats: { academic: 12, reputation: 8 },
        costPerYear: { academic: -1, satisfaction: -1 },
        reward: { academic: 5, resources: 5, reputation: 3 },
        penalty: { reputation: -3, academic: -1 },
        description: '学术界的中流砥柱。难度适中，回报丰厚。'
    },
    {
        id: 'proj_key',
        name: '重点研发计划',
        type: 'national',
        duration: 5,
        reqStats: { academic: 16, resources: 10 },
        costPerYear: { academic: -2, resources: -1 },
        reward: { academic: 8, resources: 8, reputation: 5 },
        penalty: { reputation: -5, academic: -3, resources: -3 },
        description: '国家级大项目。极度消耗精力与资源，一旦烂尾将身败名裂。'
    },
    {
        id: 'proj_talent',
        name: '杰出人才培养',
        type: 'talent',
        duration: 3,
        reqStats: { satisfaction: 15, reputation: 10 },
        costPerYear: { resources: -2 },
        reward: { satisfaction: 5, reputation: 4, academic: 2 },
        penalty: { satisfaction: -4, reputation: -2 },
        description: '专注于培养一批高质量博士。非常烧钱，但能极大提升声望。'
    },
    {
        id: 'proj_gamble',
        name: '【赌局】颠覆性技术攻关',
        type: 'national',
        duration: 4,
        reqStats: { academic: 20, resources: 15 },
        costPerYear: { resources: -3, academic: -1 },
        reward: { academic: 10, reputation: 10, resources: 10 },
        penalty: { academic: -8, reputation: -8, resources: -8 },
        description: '要么名垂青史，要么身败名裂。只有最疯狂的科学家才敢接。'
    }
];

// --- Basic Events ---
// Note: GameEvent condition signature is (stats, traits, studentCount, flags, year)
const ACADEMIC_EVENTS: GameEvent[] = [
  {
    id: 'e_a1',
    title: '顶刊论文修回',
    description: '你和学生辛苦一年的论文收到了 Nature 子刊的修回意见（Major Revision），审稿人非常刁钻。',
    category: 'academic',
    choices: [
      { text: '亲自操刀，通宵修改', description: '论文顺利接收，但你因过度劳累晕倒在办公室。', effect: () => ({ academic: 3, satisfaction: 1 }), setFlag: 'health_strain' },
      { text: '指导学生修改，锻炼他们', description: '学生压力山大，但最终接收了。', effect: () => ({ academic: 2, satisfaction: -1 }) },
      { text: '太麻烦了，改投低一档期刊', description: '轻松接收，但影响力下降。', effect: () => ({ academic: 1, reputation: -1 }) },
    ]
  },
  {
    id: 'e_a2',
    title: '国家自然科学基金申报',
    description: '又到了写本子的时候，全院都在熬夜。',
    category: 'academic',
    choices: [
      { text: '闭关一个月打磨本子', description: '中了面上项目！', effect: () => ({ academic: 2, resources: 3 }) },
      { text: '找大佬帮忙打招呼', description: '中了，但欠了人情。', effect: () => ({ resources: 3, reputation: -1 }) },
      { text: '随便写写，随缘', description: '果然没中。', effect: () => ({ academic: -1 }) },
    ]
  },
  {
    id: 'e_a3',
    title: '学术会议邀请',
    description: '一个在风景名胜区举办的国际会议邀请你做 Keynote。',
    category: 'academic',
    choices: [
      { text: '精心准备报告，展示组内成果', description: '获得同行赞誉。', effect: () => ({ academic: 1, reputation: 2 }) },
      { text: '带学生去见世面', description: '学生玩得很开心，但经费燃烧。', effect: () => ({ satisfaction: 2, resources: -1 }) },
      { text: '借机公费旅游', description: '心情舒畅，但被同行议论。', effect: () => ({ satisfaction: 1, reputation: -1 }) },
    ]
  },
  {
    id: 'e_a4',
    title: '专利转化机会',
    description: '一家企业看中了你的一项专利技术，希望能购买。',
    category: 'academic',
    choices: [
      { text: '高价出售，补充课题组经费', description: '实验室硬件升级了！', effect: () => ({ resources: 4 }) },
      { text: '以技术入股，建立长期合作', description: '细水长流，建立了产学研基地。', effect: () => ({ academic: 1, resources: 2 }) },
      { text: '觉得企业不靠谱，拒绝', description: '保持了学术纯洁性。', effect: () => ({ reputation: 1, resources: -1 }) },
    ]
  },
  {
    id: 'e_a5',
    title: '专业软件采购',
    description: '实验室急需一套昂贵的专业模拟软件，正版授权费高达20万。',
    category: 'academic',
    choices: [
      { text: '咬牙买正版', description: '经费大出血，但用着踏实。', effect: () => ({ academic: 2, resources: -3 }) },
      { text: '让学生去找破解版', description: '省了一大笔钱，学生们很开心。', effect: () => ({ resources: 1, academic: 1 }), setFlag: 'pirated_software' },
      { text: '寻找开源替代品', description: '功能差了点，凑合用吧。', effect: () => ({ academic: 0 }) },
    ]
  },
  {
    id: 'e_a6',
    title: '跨国合作项目',
    description: '国外知名教授发来邮件求合作。',
    category: 'academic',
    choices: [
      { text: '积极响应，投入主力', description: '发表了高水平联名论文。', effect: () => ({ academic: 3, reputation: 1 }) },
      { text: '派个硕士去应付', description: '对方觉得没诚意，合作告吹。', effect: () => ({ reputation: -1 }) },
      { text: '担心数据安全，婉拒', description: '稳妥起见。', effect: () => ({ resources: -1 }) },
    ]
  },
  {
    id: 'e_a_new1',
    title: '审稿人2号的刁难',
    description: '你的论文收到了 Reviewer #2 的意见，他要求你补充 10 个无关的实验，并引用他自己的 5 篇论文。',
    category: 'academic',
    choices: [
      { text: '忍气吞声，照做', description: '论文接收了，但你觉得很恶心。', effect: () => ({ academic: 1, reputation: -1, satisfaction: -1 }) },
      { text: '写长文由礼貌回怼', description: '审稿人被你说服了，展示了学术风骨！', effect: () => ({ academic: 2, reputation: 2 }) },
      { text: '撤稿，改投他刊', description: '浪费了三个月时间。', effect: () => ({ academic: -1 }) }
    ]
  },
  {
    id: 'e_a_new2',
    title: '服务器“火”了',
    description: '因为学生在服务器上跑超大规模模型（或者挖矿？），显卡冒烟了。',
    category: 'academic',
    choices: [
      { text: '动用积蓄紧急维修', description: '心在滴血，但数据保住了。', effect: () => ({ resources: -2, academic: 0 }) },
      { text: '趁机向学院哭穷申请经费', description: '居然批下来了新的设备！', effect: () => ({ resources: 3, reputation: -1 }) },
      { text: '责骂学生，让他们手算', description: '学生在朋友圈屏蔽了你。', effect: () => ({ satisfaction: -2 }) }
    ]
  },
  {
    id: 'e_a_new3',
    title: '学术锦鲤',
    description: '最近实验总是不顺，学生建议你在办公室挂一幅“学术锦鲤”图。',
    category: 'academic',
    choices: [
      { text: '封建迷信！严厉批评', description: '实验还是不顺，大家士气低落。', effect: () => ({ satisfaction: -1 }) },
      { text: '偷偷转发朋友圈，仅自己可见', description: '心理得到了安慰，好像运气变好了？', effect: () => ({ academic: 1 }) },
      { text: '带头去寺庙祈福', description: '全组团建活动变成了烧香，大家很开心。', effect: () => ({ satisfaction: 2, reputation: -1 }) }
    ]
  },
  {
    id: 'e_a_new4',
    title: '天使审稿人',
    description: 'Reviewer #3 发回意见：Accept as is（直接接收）。你怀疑自己还在做梦。',
    category: 'academic',
    choices: [
      { text: '赶紧回复确认，免得他反悔', description: '天上掉馅饼，文章顺利发表。', effect: () => ({ academic: 2, satisfaction: 1 }) },
      { text: '觉得不真实，主动检查一遍', description: '发现了一个重大错别字，避免了尴尬。', effect: () => ({ academic: 1, reputation: 1 }) },
      { text: '截图发朋友圈炫耀', description: '收获了100个赞和同行的嫉妒。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_a_new5',
    title: '超低温冰箱故障',
    description: '凌晨两点，实验室 -80℃ 冰箱报警，里面存着十年的珍贵菌种。',
    category: 'academic',
    choices: [
      { text: '穿着睡衣狂奔回实验室抢救', description: '样品保住了，但你感冒了。', effect: () => ({ resources: -1, academic: 0 }) },
      { text: '电话摇醒住在旁边的学生', description: '学生睡眼惺忪地去了，有些怨言。', effect: () => ({ satisfaction: -2 }) },
      { text: '手机静音，听天由命', description: '样品全化了，十年的心血毁于一旦。', effect: () => ({ academic: -3 }) }
    ]
  },
  {
    id: 'e_a_new6',
    title: '论文标题的尴尬',
    description: '你的论文已经在线发表了，突然发现标题里有个单词拼错了（Public -> Pubic）。',
    category: 'academic',
    choices: [
      { text: '联系编辑发勘误（Erratum）', description: '虽然更正了，但成了永久的黑历史。', effect: () => ({ reputation: -1 }) },
      { text: '假装没看见', description: '被同行私下嘲笑。', effect: () => ({ reputation: -2 }) },
      { text: '自嘲，“这是一种行为艺术”', description: '意外地被认为很幽默。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_a_new7',
    title: '掠夺性期刊的诱惑',
    description: '某“国际期刊”发来邀请，只要交钱，3天录用，包发。',
    category: 'academic',
    choices: [
      { text: '义正言辞地拉黑', description: '维护了学术净土。', effect: () => ({ reputation: 1 }) },
      { text: '为了凑考核指标，投一篇', description: '指标完成了，但以后这成了你的污点。', effect: () => ({ academic: 1, reputation: -3 }) },
      { text: '推荐死对头去投', description: '死对头还真投了，你暗自窃喜。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_a_new8',
    title: '厕所里的灵感',
    description: '你在上厕所时突然想通了一个困扰半年的数学难题，但手边没有纸笔。',
    category: 'academic',
    choices: [
      { text: '牺牲手纸，写在上面', description: '虽然有点味道，但问题解决了！', effect: () => ({ academic: 3, satisfaction: 1 }) },
      { text: '默念一百遍冲回办公室', description: '跑到半路忘了一半。', effect: () => ({ academic: 1 }) },
      { text: '发语音给自己', description: '被隔间的人听到了，以为你疯了。', effect: () => ({ academic: 2, reputation: -1 }) }
    ]
  },
  {
    id: 'e_a_ai_1',
    title: 'AI 写作风波',
    description: '期刊编辑发来邮件，质疑你课题组最新投稿的论文是 AI 生成的，因为查重率异常低但废话连篇。',
    category: 'academic',
    choices: [
        { text: '严查学生，发现确实用了 ChatGPT', description: '撤稿并严肃批评学生，声誉受损。', effect: () => ({ reputation: -2, academic: -1 }) },
        { text: '“这就是我们人类的文笔！”', description: '硬刚编辑，结果被列入黑名单。', effect: () => ({ reputation: -3, academic: -1 }) },
        { text: '用 AI 生成一封道歉信发回去', description: '编辑居然没看出来，但这事太魔幻了。', effect: () => ({ satisfaction: 1, reputation: -1 }) }
    ]
  }
];

const STUDENT_EVENTS: GameEvent[] = [
  {
    id: 'e_s1',
    title: '学生的情感危机',
    description: '你组里的博士生大师兄失恋了，在实验室借酒消愁，严重影响进度。',
    category: 'student',
    choices: [
      { text: '请他吃饭，知心谈话', description: '他感动得痛哭流涕，发誓要发Science报答你。', effect: () => ({ satisfaction: 3, reputation: 1 }) },
      { text: '严厉批评，禁止带情绪工作', description: '他表面顺从，背地里在“导师评价网”骂你。', effect: () => ({ satisfaction: -2, academic: 1 }) },
      { text: '给他介绍个对象', description: '不仅解决了问题，还成了媒人。', effect: () => ({ satisfaction: 2, reputation: 1 }) },
    ]
  },
  {
    id: 'e_s2',
    title: '毕业论文预答辩',
    description: '一个平时摸鱼的学生，论文写得一塌糊涂。',
    category: 'student',
    choices: [
      { text: '狂喷一顿，让他延毕', description: '捍卫了学术标准，但学生恨你。', effect: () => ({ academic: 1, satisfaction: -3 }) },
      { text: '通宵帮他改论文，放他过', description: '学生顺利毕业，你累出了黑眼圈。', effect: () => ({ satisfaction: 2, academic: -1 }) },
      { text: '暗示他送礼...（危险）', description: '你收了点土特产，良心不安。', effect: () => ({ resources: 1, reputation: -2 }), setFlag: 'accepted_bribe' },
    ]
  },
  {
    id: 'e_s3',
    title: '学生想去实习',
    description: '研二学生想去互联网大厂实习三个月，但手里项目正紧。',
    category: 'student',
    choices: [
      { text: '坚决不准，科研为主', description: '项目进度保住了，学生失去了好Offer。', effect: () => ({ academic: 1, satisfaction: -2 }) },
      { text: '爽快答应，前途重要', description: '学生非常感激，回来后更卖力了。', effect: () => ({ satisfaction: 3, academic: -1 }) },
      { text: '让他远程办公，两头兼顾', description: '结果两头都没做好。', effect: () => ({ academic: -1, satisfaction: -1 }) },
    ]
  },
  {
    id: 'e_s4',
    title: '组会气氛沉闷',
    description: '最近组会大家都不说话，气氛压抑。',
    category: 'student',
    choices: [
      { text: '带大家去团建K歌', description: '气氛活跃了，大家更团结。', effect: () => ({ satisfaction: 2, resources: -1 }) },
      { text: '设立“吐槽大会”环节', description: '大家畅所欲言，解决了不少误会。', effect: () => ({ satisfaction: 2, reputation: 1 }) },
      { text: '不管，科研就是严肃的', description: '大家越来越自闭。', effect: () => ({ satisfaction: -2 }) },
    ]
  },
  {
    id: 'e_s5',
    title: '学生想转博',
    description: '一个资质平平但很努力的硕士想转你的博士。',
    category: 'student',
    choices: [
      { text: '收！态度决定一切', description: '虽然产出慢，但很踏实。', effect: () => ({ satisfaction: 2, academic: 0 }) },
      { text: '劝退，为了他好', description: '他很难过，但后来找到适合的工作感谢你。', effect: () => ({ satisfaction: 1, academic: 1 }) },
      { text: '让他先做个难题试试', description: '知难而退了。', effect: () => ({ academic: 1, satisfaction: -1 }) },
    ]
  },
  {
    id: 'e_s6',
    title: '优秀生源争夺',
    description: '推免季，有一个本科发了顶刊的天才学生。',
    category: 'student',
    choices: [
      { text: '承诺给最高补助和出国机会', description: '抢到了！未来学术新星。', effect: () => ({ academic: 3, resources: -2 }) },
      { text: '画饼，谈理想', description: '被隔壁有钱的组抢走了。', effect: () => ({ reputation: -1 }) },
      { text: '平常心，姜太公钓鱼', description: '没来，但招了个老实干活的。', effect: () => ({ academic: 1 }) },
    ]
  },
  {
    id: 'e_s_new1',
    title: '实验室的“原住民”',
    description: '你发现有个学生在实验室搭了帐篷，已经住了一周没回宿舍了。',
    category: 'student',
    choices: [
      { text: '感动，这是科研精神！', description: '全组开始内卷，大家都不敢回宿舍。', effect: () => ({ academic: 2, satisfaction: -2 }) },
      { text: '赶回去洗澡睡觉', description: '实验室空气质量终于改善了。', effect: () => ({ satisfaction: 1, academic: 0 }) },
      { text: '给他买张行军床', description: '你成了传说中的“魔鬼导师”。', effect: () => ({ reputation: -1, academic: 1 }) }
    ]
  },
  {
    id: 'e_s_new2',
    title: '电竞选手',
    description: '你推门进去，发现两名学生正在激情《英雄联盟》排位，还带着耳机大喊。',
    category: 'student',
    choices: [
      { text: '怒拔网线', description: '由于正在团战关键期，学生恨死你了。', effect: () => ({ satisfaction: -3 }) },
      { text: '站在后面默默看', description: '学生回头吓得魂飞魄散，从此不敢造次。', effect: () => ({ academic: 1, satisfaction: 0 }) },
      { text: '加入他们，“带我一个”', description: '你居然是隐藏的高手！学生对你五体投地。', effect: () => ({ satisfaction: 4, academic: -1 }) }
    ]
  },
  {
    id: 'e_s_new3',
    title: '奶茶社交',
    description: '下午三点，学生代表问你要不要一起拼单点奶茶（暗示你请客）。',
    category: 'student',
    choices: [
      { text: '全组我买单！加料！', description: '学生欢呼雀跃，工作效率短暂提升。', effect: () => ({ satisfaction: 2, resources: -1 }) },
      { text: '“奶茶不健康，喝白开水”', description: '大家默默翻白眼。', effect: () => ({ satisfaction: -1 }) },
      { text: '只给自己点一杯', description: '低情商操作，场面一度十分尴尬。', effect: () => ({ satisfaction: -2, reputation: -1 }) }
    ]
  },
  {
    id: 'e_s_new4',
    title: '带娃做实验',
    description: '你的博后因为家里没人带娃，把3岁的孩子带到了实验室。',
    category: 'student',
    choices: [
      { text: '帮着一起带娃', description: '实验室充满了欢声笑语，虽然没干活。', effect: () => ({ satisfaction: 3, academic: -1 }) },
      { text: '严肃劝离，安全第一', description: '博后请假回家了，项目延期。', effect: () => ({ academic: -1, resources: -1 }) },
      { text: '教孩子用移液枪', description: '从小培养科研苗子（误）。', effect: () => ({ reputation: 1 }) }
    ]
  },
  {
    id: 'e_s_new5',
    title: '幽灵学生',
    description: '你突然想起来，你名下好像有个学生已经半年没在实验室出现过了。',
    category: 'student',
    choices: [
      { text: '全网通缉，发邮件打电话', description: '他终于出现了，原来是去考公了。', effect: () => ({ satisfaction: -1 }) },
      { text: '直接上报学院退学处理', description: '杀鸡儆猴，其他学生瑟瑟发抖。', effect: () => ({ satisfaction: -2, reputation: 1 }) },
      { text: '忘了也好，省心', description: '直到毕业答辩前夕他才出现，搞得你措手不及。', effect: () => ({ academic: -1 }) }
    ]
  },
  {
    id: 'e_s_new6',
    title: '办公室恋情',
    description: '你发现组里的一对师兄师妹不仅在谈恋爱，还在实验室秀恩爱。',
    category: 'student',
    choices: [
      { text: '棒打鸳鸯，禁止办公室恋情', description: '两人转入地下，效率更低了。', effect: () => ({ satisfaction: -2 }) },
      { text: '只要不影响工作，睁只眼闭只眼', description: '两人分手时大闹实验室，你被迫调解。', effect: () => ({ satisfaction: -1 }) },
      { text: '只要你们这学期发文章，老师包红包', description: '两人为了红包疯狂做实验，居然真的发了。', effect: () => ({ academic: 2, resources: -1 }) }
    ]
  },
  {
    id: 'e_s_new7',
    title: '土特产的惊喜',
    description: '学生假期回来，给你带了一麻袋家里的“土特产”，打开一看是几只活鸡。',
    category: 'student',
    choices: [
      { text: '欣然收下，晚上加餐', description: '学生觉得你很亲切，但你不会杀鸡。', effect: () => ({ satisfaction: 2, reputation: -1 }) },
      { text: '这算受贿吗？坚决不要', description: '学生很失落，觉得你看不起他。', effect: () => ({ satisfaction: -1 }) },
      { text: '养在实验室当吉祥物', description: '鸡打鸣影响了隔壁课题组，被投诉。', effect: () => ({ reputation: -1, satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_s_new8',
    title: '股神学生',
    description: '你发现有个学生不看文献，天天盯着K线图，据说赚得比你工资还多。',
    category: 'student',
    choices: [
      { text: '没收手机，勒令科研', description: '学生表面答应，背地里用电脑看。', effect: () => ({ academic: 1, satisfaction: -1 }) },
      { text: '虚心请教代码', description: '你跟着买了两手，小赚一笔经费。', effect: () => ({ resources: 2, reputation: -1 }) },
      { text: '劝他把炒股算法写成论文', description: '居然发了一篇金融科技的顶刊！', effect: () => ({ academic: 3 }) }
    ]
  },
  {
    id: 'e_s_ai_cheat',
    title: 'AI 作弊风云',
    description: '你发现学生交上来的实验数据完美得离谱，像是AI生成的假数据。',
    category: 'student',
    choices: [
        { text: '相信学生，也许是天才', description: '论文发表后被撤稿，你成了笑话。', effect: () => ({ reputation: -3, academic: -2 }) },
        { text: '突击检查原始实验记录', description: '学生露馅了，你避免了一场学术灾难。', effect: () => ({ academic: 1, satisfaction: -1 }) },
        { text: '以此为例，开展学术诚信教育', description: '组内风气好转。', effect: () => ({ reputation: 1 }) }
    ]
  },
  {
    id: 'e_s_depression',
    title: '沉默的螺旋',
    description: '一名学生连续两周没在群里发言，实验进度也停滞了。他似乎陷入了严重的抑郁。',
    category: 'student',
    choices: [
        { text: '推荐心理咨询，准许放假', description: '项目延期，但救了一个人。', effect: () => ({ satisfaction: 2, academic: -1 }) },
        { text: '施压：“大家都很累，别矫情”', description: '情况恶化，家长找上门来。', effect: () => ({ reputation: -5, satisfaction: -5 }) },
        { text: '不管，让大师兄去聊', description: '大师兄也跟着抑郁了。', effect: () => ({ satisfaction: -2 }) }
    ]
  }
];

const CAREER_EVENTS: GameEvent[] = [
  {
    id: 'e_c1',
    title: '职称评审',
    description: '三年一度的职称评审开始了，竞争激烈。',
    category: 'career',
    choices: [
      { text: '凭借硬核成果正面硬刚', description: '虽然有人使绊子，但实力不允许你低调。', effect: () => ({ academic: 1, reputation: 2 }) },
      { text: '走动走动，拜访评委', description: '顺利晋升，但有些风言风语。', effect: () => ({ reputation: -1, resources: -1, academic: 0 }) },
      { text: '这次太卷，放弃下次再来', description: '心态平和，但这几年白干了。', effect: () => ({ resources: -1 }) },
    ]
  },
  {
    id: 'e_c2',
    title: '行政职务邀请',
    description: '院长想让你担任系主任，事务繁杂。',
    category: 'career',
    choices: [
      { text: '欣然接受，掌握资源', description: '经费不用愁了，但没时间看论文。', effect: () => ({ resources: 4, academic: -2 }) },
      { text: '婉拒，潜心学术', description: '清贫但自由。', effect: () => ({ academic: 2, resources: -1 }) },
      { text: '推荐死对头去', description: '这招借刀杀人很高明。', effect: () => ({ reputation: -1, resources: 1 }) },
    ]
  },
  {
    id: 'e_c3',
    title: '猎头挖角',
    description: '南方一所高校开出双倍薪水挖你。',
    category: 'career',
    choices: [
      { text: '跳槽！', description: '环境变了，资源多了，但得从头建立人脉。', effect: () => ({ resources: 3, reputation: -1 }) },
      { text: '拿Offer找院长谈条件', description: '院长给你涨了工资和场地。', effect: () => ({ resources: 2, reputation: -1 }) },
      { text: '不为所动', description: '忠诚度满分。', effect: () => ({ reputation: 2 }) },
    ]
  },
  {
    id: 'e_c4',
    title: '团队内斗',
    description: '大团队里两个小老板为了争第一作者打起来了。',
    category: 'career',
    choices: [
      { text: '居中调停，各打五十大板', description: '平息了事端，展示了领导力。', effect: () => ({ reputation: 2 }) },
      { text: '站队强者', description: '弱者出走，团队实力受损。', effect: () => ({ resources: 1, academic: -1 }) },
      { text: '明哲保身，躲得远远的', description: '火烧到了你自己身上。', effect: () => ({ resources: -2, reputation: -1 }) },
    ]
  },
  {
    id: 'e_c_new1',
    title: '拿错快递',
    description: '你在传达室随手拿了一个快递，拆开发现是院长买的假发片。',
    category: 'career',
    choices: [
      { text: '假装什么都没发生，悄悄放回', description: '你每天看到院长头顶都想笑，憋得很辛苦。', effect: () => ({ satisfaction: 1 }) },
      { text: '主动送去院长办公室致歉', description: '院长尴尬地笑了笑，你感觉以后日子不好过了。', effect: () => ({ resources: -2 }) },
      { text: '以此为把柄（作死）', description: '你被穿小鞋了。', effect: () => ({ resources: -3, reputation: -2 }) }
    ]
  },
  {
    id: 'e_c_new2',
    title: '会议室争夺战',
    description: '你预定的会议室被隔壁强势的课题组占用了。',
    category: 'career',
    choices: [
      { text: '硬刚！拿出预约记录', description: '对方灰溜溜地走了，你赢得了尊严。', effect: () => ({ reputation: 1, academic: 0 }) },
      { text: '算了，带学生去草坪开会', description: '意外地很惬意，被路人拍下称为“最美课堂”。', effect: () => ({ reputation: 2, satisfaction: 1 }) },
      { text: '在门口阴阳怪气', description: '双方大吵一架，被全院通报。', effect: () => ({ reputation: -2 }) }
    ]
  },
  {
    id: 'e_c_new3',
    title: '全校大停电',
    description: '供电局线路检修，全校停电一天，冰箱里的样品岌岌可危。',
    category: 'career',
    choices: [
      { text: '花高价买干冰救急', description: '样品保住了，钱包瘪了。', effect: () => ({ resources: -2, academic: 1 }) },
      { text: '把样品搬到隔壁医院', description: '欠了医生朋友一个人情。', effect: () => ({ reputation: 1, resources: -1 }) },
      { text: '借机给学生放假', description: '样品坏了一部分，但大家都很开心。', effect: () => ({ satisfaction: 3, academic: -2 }) }
    ]
  },
  {
    id: 'e_c_new4',
    title: '停车位之战',
    description: '学校停车位紧张，你发现一个讲师用电瓶车占了唯一的车位。',
    category: 'career',
    choices: [
      { text: '下车把电瓶车挪走', description: '你赢了车位，但车漆被划了一道。', effect: () => ({ resources: -1 }) },
      { text: '在车里等半小时', description: '错过了一个重要会议。', effect: () => ({ academic: -1 }) },
      { text: '停在校长车位上', description: '居然没事！你发现了新大陆。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_c_new5',
    title: '社死群发邮件',
    description: '你想给朋友吐槽院长，结果手滑点了“Reply All”（回复全体），全校教职工都收到了。',
    category: 'career',
    choices: [
      { text: '立刻再发一封：账号被盗！', description: '没人信，但大家心照不宣。', effect: () => ({ reputation: -2 }) },
      { text: '连夜买站票逃离这座城市', description: '开玩笑的，只能硬着头皮去上班。', effect: () => ({ reputation: -3, satisfaction: -2 }) },
      { text: '声称这是社会学实验', description: '大家觉得你是个怪人。', effect: () => ({ academic: 1, reputation: -1 }) }
    ]
  },
  {
    id: 'e_c_new6',
    title: '监考的煎熬',
    description: '被安排去监考全校通识课，两个小时不能看手机。',
    category: 'career',
    choices: [
      { text: '在考场转圈，数地板砖', description: '步数排行榜第一，但很无聊。', effect: () => ({ satisfaction: -1 }) },
      { text: '盯着一个作弊的学生看', description: '学生心理防线崩溃，主动交出小抄。', effect: () => ({ reputation: 1 }) },
      { text: '脑补下一个课题', description: '效率惊人，想出了个好点子。', effect: () => ({ academic: 1 }) }
    ]
  },
  {
    id: 'e_c_new7',
    title: '校园施工噪音',
    description: '隔壁楼开始装修，钻头声从早响到晚，震耳欲聋。',
    category: 'career',
    choices: [
      { text: '买个降噪耳机', description: '世界安静了，但钱包瘦了。', effect: () => ({ resources: -1, satisfaction: 1 }) },
      { text: '去投诉处拍桌子', description: '施工队答应中午停一小时。', effect: () => ({ reputation: 1 }) },
      { text: '搬到图书馆办公', description: '遇见了以前的学生，聊得很开心。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_c_new8',
    title: '办公室风水局',
    description: '你的行政助理说，你最近发不出文章是因为办公室鱼缸摆放位置不对。',
    category: 'career',
    choices: [
        { text: '立即重新装修', description: '大兴土木，办公室焕然一新，心情确实好了。', effect: () => ({ resources: -2, academic: 1 }) },
        { text: '“唯物主义战士不信这个”', description: '你把鱼缸扔了，结果第二天就摔了一跤。', effect: () => ({ satisfaction: -1 }) },
        { text: '在鱼缸里养条锦鲤', description: '既美观又吉利。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_c_late_health',
    title: '体检报告的红灯',
    description: '年度体检结果出来了，医生看着你的报告直摇头：高血压、颈椎病、脂肪肝...',
    category: 'career',
    condition: (s, t, c, f, year) => year >= 15,
    choices: [
        { text: '遵医嘱，减少工作量', description: '身体好转，但学术产出大幅下降。', effect: () => ({ academic: -2, satisfaction: 1 }) },
        { text: '不管它，吃药硬扛', description: '学术保持高产，但埋下了定时炸弹。', effect: () => ({ academic: 1 }), setFlag: 'health_strain' },
        { text: '办理病退', description: '提前结束学术生涯，保命要紧。', effect: () => ({ resources: -5, academic: -5 }) }
    ]
  },
  {
    id: 'e_c_rivalry',
    title: '死对头的晋升',
    description: '当年不如你的死对头，现在居然成了你的顶头上司（院长）。',
    category: 'career',
    choices: [
        { text: '忍辱负重，低头做人', description: '经费被卡，日子难过。', effect: () => ({ resources: -2, satisfaction: -1 }) },
        { text: '公开唱反调', description: '被穿小鞋，但也赢得了一部分人的支持。', effect: () => ({ resources: -3, reputation: 1 }) },
        { text: '抓他的把柄举报', description: '鱼死网破，两败俱伤。', effect: () => ({ reputation: -5 }) }
    ]
  }
];

const RESOURCE_EVENTS: GameEvent[] = [
  {
    id: 'e_n1',
    title: '企业横向项目',
    description: '一家化工厂需要改进工艺，经费50万。',
    category: 'network',
    choices: [
      { text: '接！刚好缺钱', description: '活很累，技术含量不高，但解了燃眉之急。', effect: () => ({ resources: 3, academic: -1 }) },
      { text: '看不上，推给年轻老师', description: '年轻老师很感激你。', effect: () => ({ reputation: 2 }) },
      { text: '把钱收了，让学生随便做', description: '企业很不满意，以后没合作了。', effect: () => ({ resources: 2, reputation: -3 }) },
    ]
  },
  {
    id: 'e_n2',
    title: '校友聚会',
    description: '百年校庆，很多混得好的校友回来了。',
    category: 'network',
    choices: [
      { text: '积极交换名片，拉赞助', description: '拉到了奖学金赞助。', effect: () => ({ resources: 2, satisfaction: 1 }) },
      { text: '和老同学忆往昔', description: '心情不错，加深了感情。', effect: () => ({ satisfaction: 1, reputation: 1 }) },
      { text: '躲在角落吃自助餐', description: '吃撑了。', effect: () => ({ satisfaction: 1 }) },
    ]
  },
  {
    id: 'e_n3',
    title: '媒体采访',
    description: '因为一项研究成果，电视台想采访你。',
    category: 'network',
    choices: [
      { text: '配合宣传，打造网红学者', description: '知名度暴涨，争议也随之而来。', effect: () => ({ reputation: 3, academic: -1 }), setFlag: 'media_exposure' },
      { text: '低调拒绝', description: '保持神秘感。', effect: () => ({ academic: 1 }) },
      { text: '让学生代表去', description: '学生火了。', effect: () => ({ satisfaction: 2 }) },
    ]
  },
  {
    id: 'e_n_new1',
    title: '防脱发代言',
    description: '某知名生发洗发水品牌看中你的地中海发型，想请你代言。',
    category: 'network',
    choices: [
      { text: '为了经费，接了！', description: '你成了全校笑柄，但实验室换了新电脑。', effect: () => ({ resources: 3, reputation: -3 }) },
      { text: '愤然拒绝，这是羞辱', description: '保住了文人的骨气。', effect: () => ({ reputation: 1, resources: 0 }) },
      { text: '推荐隔壁秃得更厉害的教授', description: '祸水东引，隔壁教授跟你绝交了。', effect: () => ({ reputation: -1, resources: 1 }) }
    ]
  },
  {
    id: 'e_n_new2',
    title: '食堂黑暗料理',
    description: '学校食堂推出了“辣椒炒月饼”，邀请教师代表试吃。',
    category: 'network',
    choices: [
      { text: '硬着头皮夸好吃', description: '后勤集团很满意，以后报修优先处理。', effect: () => ({ resources: 1, satisfaction: -1 }) },
      { text: '实话实说：难吃', description: '得罪了食堂大妈，以后打饭手抖得厉害。', effect: () => ({ satisfaction: 1, resources: -1 }) },
      { text: '带回实验室给学生吃', description: '学生以为是惩罚，瑟瑟发抖。', effect: () => ({ satisfaction: -2 }) }
    ]
  },
  {
    id: 'e_n_new3',
    title: '神秘的流浪猫',
    description: '一只橘猫闯入实验室，怎么赶都不走。',
    category: 'network',
    choices: [
      { text: '收编为“实验室神兽”', description: '虽然要花钱买猫粮，但大家都爱撸猫减压。', effect: () => ({ satisfaction: 3, resources: -1 }) },
      { text: '送去流浪动物救助站', description: '理性的选择，无功无过。', effect: () => ({ academic: 0 }) },
      { text: '正好缺实验动物...（误）', description: '学生拼死护猫，差点造反。', effect: () => ({ satisfaction: -5, reputation: -2 }) }
    ]
  },
  {
    id: 'e_n_new4',
    title: '报账地狱',
    description: '财务处退回了你的报销单：发票贴得不平，且缺一张打车票。',
    category: 'network',
    choices: [
      { text: '卑微地重新贴，跑三趟', description: '腿跑断了，钱终于下来了。', effect: () => ({ resources: 1, satisfaction: -2 }) },
      { text: '派学生去跑腿', description: '学生领教了社会的险恶，表示想退学。', effect: () => ({ satisfaction: -3, resources: 1 }) },
      { text: '这钱我不要了！', description: '豪横！但心在滴血。', effect: () => ({ resources: -2 }) }
    ]
  },
  {
    id: 'e_n_new5',
    title: '校园大鹅',
    description: '实验室门口常驻一只大鹅，极具攻击性，已经啄伤了两个研究生。',
    category: 'network',
    choices: [
      { text: '绕道走', description: '每天多走十分钟，大家怨声载道。', effect: () => ({ satisfaction: -1 }) },
      { text: '与之搏斗', description: '你赢了，确立了实验室老大的地位。', effect: () => ({ reputation: 1 }) },
      { text: '铁锅炖大鹅...（误）', description: '保护动物！你被保卫处谈话了。', effect: () => ({ reputation: -1 }) }
    ]
  },
  {
    id: 'e_n_new6',
    title: '中年危机',
    description: '你发现自己不自觉地拿起了保温杯，并往里面放了枸杞。',
    category: 'network',
    choices: [
      { text: '坦然接受，养生第一', description: '身体变好了，工作效率提升。', effect: () => ({ academic: 1 }) },
      { text: '换成咖啡，假装年轻', description: '胃疼犯了。', effect: () => ({ satisfaction: -1 }) },
      { text: '去健身房举铁', description: '闪了腰，休息一周。', effect: () => ({ academic: -1 }) }
    ]
  },
  {
    id: 'e_n_new7',
    title: '诈骗电话',
    description: '接到电话：“我是张院长，明天来我办公室一下。”声音确实有点像。',
    category: 'network',
    choices: [
      { text: '“院长好！我马上准备。”', description: '被骗走了两千块钱“急用金”。', effect: () => ({ resources: -2 }) },
      { text: '反诈意识强，直接挂断', description: '安全无事。', effect: () => ({ resources: 0 }) },
      { text: '“院长，您假发片到了吗？”', description: '对方沉默了，骂骂咧咧地挂了。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
  {
    id: 'e_n_new8',
    title: '年底突击花钱',
    description: '财务通知，今年经费还有20万没花完，如果不花完明年会收回。',
    category: 'network',
    choices: [
      { text: '买一堆不需要的试剂', description: '仓库堆满了，但钱花出去了。', effect: () => ({ resources: -1 }) },
      { text: '给学生多发劳务费', description: '学生高呼万岁，干劲十足。', effect: () => ({ satisfaction: 3, resources: -1 }) },
      { text: '升级办公室电脑椅', description: '坐着舒服多了。', effect: () => ({ satisfaction: 1, resources: -1 }) }
    ]
  },
  {
    id: 'e_n_circle',
    title: '圈子文化',
    description: '有人邀请你加入一个隐秘的“互引群”，大家互相引用论文提升引用率。',
    category: 'network',
    choices: [
        { text: '加入', description: '引用率暴涨，但你觉得这种行为很Low。', effect: () => ({ academic: 2, reputation: -1 }) },
        { text: '拒绝', description: '你的论文引用率增长缓慢。', effect: () => ({ academic: 0 }) },
        { text: '截图举报', description: '你在圈内被孤立了，但维持了正义。', effect: () => ({ reputation: 2, resources: -2 }) }
    ]
  }
];

const RISK_EVENTS: GameEvent[] = [
  {
    id: 'e_r1',
    title: '学术不端疑云',
    description: '有人举报你五年前的一篇论文数据造假。',
    category: 'risk',
    choices: [
      { text: '身正不怕影子斜，申请彻查', description: '查清是学生失误，你负有监管责任。', effect: () => ({ reputation: -3, academic: -1 }) },
      { text: '动用关系压下去', description: '事情平息了，但留下了把柄。', effect: () => ({ resources: -3, reputation: -1 }), setFlag: 'covered_scandal' },
      { text: '公开道歉并撤稿', description: '声誉受损，但被认为有担当。', effect: () => ({ reputation: -2, satisfaction: 1 }) },
    ]
  },
  {
    id: 'e_r2',
    title: '经费审计',
    description: '审计处突击检查，发现几张发票有问题。',
    category: 'risk',
    choices: [
      { text: '据理力争，解释用途', description: '虽然通过了，但被列入重点关注名单。', effect: () => ({ reputation: -1, resources: -1 }), setFlag: 'audit_watch' },
      { text: '赶紧补漏洞，退钱', description: '破财消灾。', effect: () => ({ resources: -3 }) },
      { text: '甩锅给报账的学生', description: '学生心寒了，全网曝光你。', effect: () => ({ satisfaction: -10, reputation: -5 }) },
    ]
  },
  {
    id: 'e_r3',
    title: '实验室事故',
    description: '实验室半夜起火，幸好无人伤亡。',
    category: 'risk',
    choices: [
      { text: '全院通报批评，整改', description: '停工三个月，损失惨重。', effect: () => ({ academic: -2, resources: -2 }) },
      { text: '瞒报，私下处理', description: '风险极大，每天提心吊胆。', effect: () => ({ satisfaction: -2, reputation: -2 }), setFlag: 'hidden_fire' },
      { text: '第一时间承担责任，升级安全', description: '获得了“安全标兵”反向激励。', effect: () => ({ resources: -2, reputation: 1 }) },
    ]
  },
  {
    id: 'e_r4',
    title: '【高危】数据被质疑',
    description: '你的代表作被国外打假网站PubPeer挂了，质疑图片重复使用。',
    category: 'risk',
    choices: [
        { text: '装死，不回应', description: '舆论发酵，学校启动调查。', effect: () => ({ reputation: -5, academic: -2 }) },
        { text: '强行解释是“误操作”', description: '越描越黑，被同行耻笑。', effect: () => ({ reputation: -4, academic: -3 }) },
        { text: '承认错误，主动撤稿', description: '虽然丢脸，但保住了教职。', effect: () => ({ academic: -5, reputation: -2 }) }
    ]
  },
  {
    id: 'e_r5',
    title: '【高危】学生心理崩溃',
    description: '一名长期被延毕的博士生在天台徘徊，情况危急。',
    category: 'risk',
    choices: [
        { text: '立刻赶去现场安抚，承诺毕业', description: '人救下来了，但你被家长打了一顿。', effect: () => ({ satisfaction: 5, reputation: -2 }) },
        { text: '报警，让专业人士处理', description: '安全处理，但被学生贴上了“冷血”标签。', effect: () => ({ satisfaction: -5, reputation: -1 }) },
        { text: '怕担责任，躲起来', description: '悲剧发生，你被千夫所指。', effect: () => ({ satisfaction: -20, reputation: -20 }) }
    ]
  },
  {
    id: 'e_r6',
    title: '【高危】科研经费断裂',
    description: '由于连续两年没申到项目，实验室账户余额不足以支付学生补助。',
    category: 'risk',
    choices: [
        { text: '自掏腰包，卖房养学生', description: '学生感动，但你破产了。', effect: () => ({ resources: -4, satisfaction: 3 }) },
        { text: '停发补助', description: '学生集体罢工，实验室瘫痪。', effect: () => ({ satisfaction: -10, academic: -3 }) },
        { text: '到处借钱，拆东墙补西墙', description: '勉强维持，但信用破产。', effect: () => ({ resources: -3, reputation: -2 }) }
    ]
  }
];

// --- Chain Events ---
// [Important] Split Death Event into two based on flags because Choice cannot have condition.
export const CHAIN_EVENTS: GameEvent[] = [
  {
    id: 'ce_1',
    title: '陈年旧账（连锁风险）',
    description: '之前暗示学生送礼的事情被发到了网上，舆论哗然！',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['accepted_bribe'] && !flags['bribe_processed'],
    choices: [
        { text: '沉默装死', description: '被学校停职反省一年。', effect: () => ({ reputation: -5, academic: -2, resources: -2 }), setFlag: 'bribe_processed' },
        { text: '辩解是学生自愿的', description: '越描越黑。', effect: () => ({ reputation: -8, satisfaction: -3 }), setFlag: 'bribe_processed' }
    ]
  },
  {
    id: 'ce_2',
    title: '审计雷暴（连锁风险）',
    description: '由于之前被列入重点名单，这次专项审计直接查封了你的账本。',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['audit_watch'],
    choices: [
        { text: '上交违规资金', description: '多年积蓄一空，但审计组撤走了。', effect: () => ({ resources: -10 }), removeFlag: 'audit_watch' }
    ]
  },
  {
    id: 'ce_3',
    title: '版权律师函（连锁风险）',
    description: '软件公司发现了你们实验室长期使用盗版软件，发来了律师函。',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['pirated_software'] && !flags['software_judged'],
    choices: [
        { text: '赔偿巨额罚款', description: '经费彻底见底。', effect: () => ({ resources: -5, reputation: -2 }), removeFlag: 'pirated_software', setFlag: 'software_judged' },
        { text: '死不承认', description: '被起诉，事情闹大。', effect: () => ({ reputation: -5, academic: -2 }), removeFlag: 'pirated_software', setFlag: 'software_judged' }
    ]
  },
  {
    id: 'ce_4',
    title: '网络暴力（连锁风险）',
    description: '作为网红学者，你的一言一行都被放大，网友断章取义攻击你。',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['media_exposure'],
    choices: [
        { text: '注销账号，退网保平安', description: '回归平静，但少了一个发声渠道。', effect: () => ({ reputation: -1, academic: 1 }), removeFlag: 'media_exposure' },
        { text: '网上对线', description: '越吵越热，严重影响教学秩序。', effect: () => ({ reputation: -2, academic: -2, satisfaction: -2 }) }
    ]
  },
  {
    id: 'ce_5',
    title: '积劳成疾（连锁风险）',
    description: '长期亲力亲为、通宵工作，你突然在课堂上晕倒。',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['health_strain'],
    choices: [
        { text: '住院休养半年', description: '身体好转，但项目停滞。', effect: () => ({ academic: -3, resources: -1 }), removeFlag: 'health_strain' },
        { text: '打点滴坚持工作', description: '精神可嘉，但医生下了病危通知书。', effect: () => ({ academic: 1, satisfaction: 1, reputation: 1 }), removeFlag: 'health_strain', setFlag: 'critical_health' }
    ]
  },
  // [Fixed] Split Logic for Death Event: WITH Insurance
  {
    id: 'ce_6_saved',
    title: 'ICU 里的重生',
    description: '你倒在了实验台前，但幸亏购买了高端医疗保险，被连夜送往国外治疗。',
    category: 'risk',
    // Condition: Critical Health AND Has Insurance
    condition: (stats, traits, sc, flags) => !!flags['critical_health'] && !!flags['has_insurance'],
    choices: [
        { text: '花钱保命', description: '虽然花光了积蓄并休养了一年，但你活下来了。', effect: () => ({ academic: -5, resources: -5 }), removeFlag: 'critical_health' }
    ]
  },
  // [Fixed] Split Logic for Death Event: NO Insurance
  {
    id: 'ce_6_death',
    title: '死亡倒计时',
    description: '你倒在了实验台前。由于没有高端保险，加上常年积劳成疾，医院下了病危通知书...',
    category: 'risk',
    // Condition: Critical Health AND No Insurance
    condition: (stats, traits, sc, flags) => !!flags['critical_health'] && !flags['has_insurance'],
    choices: [
        { text: '抢救无效...', description: '你永远地睡着了。（游戏结束）', effect: () => ({}), setFlag: 'died_of_overwork' }
    ]
  }
];

export const EVENT_POOL = [
  ...ACADEMIC_EVENTS,
  ...STUDENT_EVENTS,
  ...CAREER_EVENTS,
  ...RESOURCE_EVENTS,
  ...RISK_EVENTS,
  ...DLC_EVENTS
];

export const HIDDEN_EVENTS: GameEvent[] = [
  {
    id: 'e_h1',
    title: '重大国家专项（隐藏）',
    description: '由于你学术造诣极高且资源丰富，国家级重大项目找上门来。',
    category: 'academic',
    condition: (stats, traits) => stats.academic >= 18 && stats.resources >= 15,
    choices: [
      { text: '签下军令状', description: '虽然掉了一层皮，但成为了国宝级科学家。', effect: () => ({ academic: 5, reputation: 5 }) },
      { text: '觉得太累，推辞', description: '错失良机。', effect: () => ({ reputation: -2 }) },
    ]
  },
  {
    id: 'e_h2',
    title: '桃李满天下（隐藏）',
    description: '你的学生在各行各业都成了大佬，回来联名给你办祝寿会。',
    category: 'student',
    condition: (stats, traits, studentCount) => stats.satisfaction >= 16 && studentCount > 15,
    choices: [
      { text: '感动落泪', description: '这辈子值了。', effect: () => ({ reputation: 5, satisfaction: 5 }) },
    ]
  }
];
