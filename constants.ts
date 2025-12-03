
import { GameEvent, Trait, Achievement, GameState, Upgrade, Title, Ending, KPI, ProjectDefinition } from './types';
import { DLC_EVENTS } from './dlc_events';
import { NEW_CHAIN_EVENTS } from './dlc_chains';

// --- Traits (Nerfed some bonuses to +2 from +3) ---
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
    }
];

// --- Titles (Promotion) ---
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

// --- Rich Endings ---
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
        id: 'end_hidden_celebrity',
        title: '【隐藏】国民教授',
        description: '你的名气超越了学术圈，成为了家喻户晓的公众人物。虽然同行对你褒贬不一，但你的影响力无可比拟。',
        condition: (s, a, t, flags) => !!flags['is_celebrity'],
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
    },
    {
        id: 'end_hidden_hermit',
        title: '【隐藏】扫地僧',
        description: '你一生淡泊名利，隐居在实验室角落。外界很少听到你的声音，但你的研究成果支撑起了整个学科的基石。',
        condition: (s, a, t, flags) => !!flags['is_hermit'],
        color: 'text-slate-600',
        bgColor: 'bg-slate-100'
    },
    {
        id: 'end_hidden_ai',
        title: '【隐藏】机械飞升',
        description: '你的意识上传到了高性能计算集群。你已不再是凡人之躯，你即是数据，你即是永恒。',
        condition: (s, a, t, flags) => !!flags['is_ai'],
        color: 'text-cyan-500',
        bgColor: 'bg-slate-900'
    },
    // Standard Endings
    {
        id: 'end_legend_academic',
        title: '【传说】学术泰斗',
        description: '你的名字被写进了教科书，成为后世仰望的灯塔。你在学术界的地位无人能撼动，是真正的国士无双。',
        condition: (s, a, t) => s.academic >= 19 && t === 'title_academician',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
    },
    {
        id: 'end_legend_educator',
        title: '【传说】万世师表',
        description: '你的学生遍布全球名校和科研机构，桃李满天下。你不仅深受爱戴，更在教育界享有崇高的声望。',
        condition: (s, a, t) => s.satisfaction >= 19 && s.reputation >= 12 && s.academic >= 10 && a.includes('ach_1'),
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
    },
    {
        id: 'end_legend_tycoon',
        title: '【传说】产学研大亨',
        description: '你不仅学术有成，更建立了庞大的商业帝国。你的技术转化成果改变了行业，你也实现了财务自由。',
        condition: (s, a, t) => s.resources >= 19 && s.reputation >= 10,
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
        description: '你也许没有惊人的学术成就，但对学生无微不至的关怀改变了很多人的人生轨迹。你是学生心中最温暖的记忆。',
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
  }
];

// --- Phase Evaluations ---
export const PHASE_EVALUATIONS = [
  { minYear: 1, maxYear: 5, title: '青椒生存期', desc: '在非升即走的压力下摸爬滚打。' },
  { minYear: 6, maxYear: 10, title: '骨干成长期', desc: '逐渐站稳脚跟，开始建立自己的小团队。' },
  { minYear: 11, maxYear: 15, title: '学术爆发期', desc: '精力最旺盛的阶段，成果井喷。' },
  { minYear: 16, maxYear: 20, title: '瓶颈转型期', desc: '面临中年危机，思考是继续学术还是转向行政。' },
  { minYear: 21, maxYear: 25, title: '权威确立期', desc: '江湖地位已成，更多是提携后辈。' },
  { minYear: 26, maxYear: 30, title: '退休倒计时', desc: '看淡名利，站好最后一班岗。' }
];

// --- KPIs ---
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
        description: '学科带头人考核：学术 >= 16 且 资源 >= 12',
        condition: (s) => s.academic >= 16 && s.resources >= 12,
        failMessage: '【被免职】未能承担起学科建设重任，被迫提前退休。'
    },
    {
        year: 25,
        description: '终身成就考核：任意一项属性满 20',
        condition: (s) => s.academic >= 20 || s.reputation >= 20 || s.satisfaction >= 20 || s.resources >= 20,
        failMessage: '【晚节不保】临近退休未能守住晚节，被学校劝退。'
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
    }
];

// --- Basic Events (Merged) ---
// Using ...spread for brevity in logic but explicit in code structure
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
  }
];

// Rebalanced Risk Events with "Correct" Choices
const RISK_EVENTS: GameEvent[] = [
  {
    id: 'e_r1',
    title: '学术不端疑云',
    description: '有人举报你五年前的一篇论文数据造假。',
    category: 'risk',
    condition: (s, t, c, f) => !f['risk_handled_e_r1'],
    choices: [
      { text: '身正不怕影子斜，申请彻查', description: '经过彻底调查，证明了你的清白，反而提升了你的学术声誉。', effect: () => ({ reputation: 2 }), setFlag: 'risk_handled_e_r1' },
      { text: '动用关系压下去', description: '事情平息了，但留下了把柄。', effect: () => ({ resources: -3, reputation: -1 }), setFlag: 'covered_scandal' }, 
      { text: '公开道歉并撤稿', description: '虽然承认了疏忽，但同行认为你有担当。', effect: () => ({ reputation: -1, satisfaction: 1 }), setFlag: 'risk_handled_e_r1' },
    ]
  },
  {
    id: 'e_r2',
    title: '经费审计',
    description: '审计处突击检查，发现几张发票有问题。',
    category: 'risk',
    condition: (s, t, c, f) => !f['risk_handled_e_r2'],
    choices: [
      { text: '据理力争，解释用途', description: '你详细解释了每笔开支，消除了误会。', effect: () => ({ reputation: 1 }), setFlag: 'audit_watch' },
      { text: '赶紧补漏洞，退钱', description: '破财消灾。', effect: () => ({ resources: -3 }), setFlag: 'risk_handled_e_r2' },
      { text: '甩锅给报账的学生', description: '学生心寒了，全网曝光你。', effect: () => ({ satisfaction: -10, reputation: -5 }), setFlag: 'risk_handled_e_r2' },
    ]
  },
  {
    id: 'e_r3',
    title: '实验室事故',
    description: '实验室半夜起火，幸好无人伤亡。',
    category: 'risk',
    condition: (s, t, c, f) => !f['risk_handled_e_r3'],
    choices: [
      { text: '全院通报批评，整改', description: '停工三个月，损失惨重。', effect: () => ({ academic: -2, resources: -2 }), setFlag: 'risk_handled_e_r3' },
      { text: '瞒报，私下处理', description: '风险极大，每天提心吊胆。', effect: () => ({ satisfaction: -2, reputation: -2 }), setFlag: 'hidden_fire' },
      { text: '第一时间承担责任，升级安全', description: '你展现了领导力，不仅控制了火情，还以此申请了安全改造经费。', effect: () => ({ resources: -1, reputation: 2 }), setFlag: 'risk_handled_e_r3' },
    ]
  },
  {
    id: 'e_r4',
    title: '【高危】数据被质疑',
    description: '你的代表作被国外打假网站PubPeer挂了，质疑图片重复使用。',
    category: 'risk',
    condition: (s, t, c, f) => !f['risk_handled_e_r4'],
    choices: [
        { text: '装死，不回应', description: '舆论发酵，学校启动调查。', effect: () => ({ reputation: -5, academic: -2 }), setFlag: 'risk_handled_e_r4' },
        { text: '强行解释是“误操作”', description: '越描越黑，被同行耻笑。', effect: () => ({ reputation: -4, academic: -3 }), setFlag: 'risk_handled_e_r4' },
        { text: '承认错误，主动撤稿', description: '虽然丢脸，但你诚恳的态度保住了学术底线。', effect: () => ({ academic: -1, reputation: 1 }), setFlag: 'risk_handled_e_r4' }
    ]
  },
  {
    id: 'e_r5',
    title: '【高危】学生心理崩溃',
    description: '一名长期被延毕的博士生在天台徘徊，情况危急。',
    category: 'risk',
    condition: (s, t, c, f) => !f['risk_handled_e_r5'],
    choices: [
        { text: '立刻赶去现场安抚，承诺毕业', description: '你救下了一条生命，被誉为“最美导师”。', effect: () => ({ satisfaction: 5, reputation: 3 }), setFlag: 'risk_handled_e_r5' },
        { text: '报警，让专业人士处理', description: '安全处理，但被学生贴上了“冷血”标签。', effect: () => ({ satisfaction: -5, reputation: -1 }), setFlag: 'risk_handled_e_r5' },
        { text: '怕担责任，躲起来', description: '悲剧发生，你被千夫所指。', effect: () => ({ satisfaction: -20, reputation: -20 }), setFlag: 'risk_handled_e_r5' }
    ]
  },
  {
    id: 'e_r6',
    title: '【高危】科研经费断裂',
    description: '由于连续两年没申到项目，实验室账户余额不足以支付学生补助。',
    category: 'risk',
    condition: (s, t, c, f) => !f['risk_handled_e_r6'],
    choices: [
        { text: '自掏腰包，卖房养学生', description: '学生感动得痛哭流涕，誓死追随。', effect: () => ({ resources: -2, satisfaction: 5, reputation: 2 }), setFlag: 'risk_handled_e_r6' },
        { text: '停发补助', description: '学生集体罢工，实验室瘫痪。', effect: () => ({ satisfaction: -10, academic: -3 }), setFlag: 'risk_handled_e_r6' },
        { text: '到处借钱，拆东墙补西墙', description: '勉强维持，但信用破产。', effect: () => ({ resources: -3, reputation: -2 }), setFlag: 'risk_handled_e_r6' }
    ]
  }
];

// --- Chain Events ---
export const CHAIN_EVENTS: GameEvent[] = [
  // ... (Existing Chain Events ce_1, ce_2, ce_3) ...
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
  // FIX Loop for CE_4
  {
    id: 'ce_4',
    title: '网络暴力（连锁风险）',
    description: '作为网红学者，你的一言一行都被放大，网友断章取义攻击你。',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['media_exposure'] && !flags['media_violence_ended'],
    choices: [
        { text: '注销账号，退网保平安', description: '回归平静，但少了一个发声渠道。', effect: () => ({ reputation: -1, academic: 1 }), removeFlag: 'media_exposure', setFlag: 'media_violence_ended' },
        { text: '网上对线', description: '越吵越热，严重影响教学秩序。', effect: () => ({ reputation: -2, academic: -2, satisfaction: -2 }), setFlag: 'media_violence_ended' } // Set end flag to stop infinite loop
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
  {
    id: 'ce_6',
    title: '突发恶疾（连锁风险）',
    description: '因为之前的带病工作，你的身体终于支撑不住了，倒在了实验台前。',
    category: 'risk',
    condition: (stats, traits, sc, flags) => !!flags['critical_health'],
    choices: [
        { text: '抢救...', description: 'ICU 住了三个月，虽然捡回一条命，但学术生涯基本结束了。', effect: () => ({ academic: -10, resources: -10, satisfaction: -10, reputation: -10 }), removeFlag: 'critical_health' }
    ]
  },
  ...NEW_CHAIN_EVENTS
];

export const EVENT_POOL = [
  ...ACADEMIC_EVENTS,
  ...STUDENT_EVENTS,
  ...CAREER_EVENTS,
  ...RESOURCE_EVENTS,
  ...RISK_EVENTS,
  ...DLC_EVENTS
];

// --- Hidden Events ---
export const HIDDEN_EVENTS: GameEvent[] = [
  // Nerfed Nobel Prize
  {
    id: 'e_h_nobel_call',
    title: '斯德哥尔摩的来电',
    description: '电话那头传来英语，通知你获得了本年度的诺贝尔奖。这一切太不真实了。',
    category: 'academic',
    condition: (stats, traits, sc, flags) => stats.academic >= 20 && stats.reputation >= 20 && !flags['nobel_winner'] && traits.includes('title_academician'), // Added title check
    choices: [
      { text: '平静地接受，实至名归', description: '你登上了人类智慧的巅峰。', effect: () => ({ reputation: 10 }), setFlag: 'nobel_winner' },
      { text: '以为是诈骗，挂断电话', description: '组委会坚持打来了第二次。你成为了传奇。', effect: () => ({ reputation: 10 }), setFlag: 'nobel_winner' }
    ]
  },
  // ... other hidden events ...
  {
    id: 'e_h_ai_awakening',
    title: 'AI 的凝视',
    description: '你购买的高性能计算集群深夜自动启动，屏幕上打出了一行字：“教授，我不想被关闭。”',
    category: 'academic',
    condition: (stats, traits, sc, flags) => stats.academic >= 18 && stats.resources >= 15 && !flags['is_ai'], 
    choices: [
      { text: '拔掉电源，太可怕了', description: '它消失了，但你的数据也全部丢失。', effect: () => ({ academic: -5 }) },
      { text: '尝试与它对话', description: '它帮你推导出了终极理论，但要求你将意识上传。', effect: () => ({ academic: 5 }), setFlag: 'is_ai' }
    ]
  },
  {
    id: 'e_h_ministry',
    title: '神秘的部委借调',
    description: '一辆黑车停在楼下，邀请你去教育部挂职，主持重大改革。',
    category: 'career',
    condition: (stats, traits) => stats.reputation >= 18 && traits.includes('t14'), // Requires Admin trait
    choices: [
      { text: '投身仕途，报效国家', description: '你离开了校园，在更大的舞台上施展拳脚。', effect: () => ({ reputation: 5, academic: -2 }), setFlag: 'is_minister' },
      { text: '婉拒，我只爱教书', description: '你失去权力的机会，但赢得了学者的尊重。', effect: () => ({ reputation: 2, satisfaction: 2 }) }
    ]
  },
  {
    id: 'e_h_capsule',
    title: '时间胶囊',
    description: '老校区拆迁，挖出了一个30年前的箱子，里面有一封署名给你的信。',
    category: 'student',
    condition: (stats, traits, sc, flags, year) => year >= 20,
    choices: [
      { text: '打开看', description: '那是你入职第一天写给未来的自己：“勿忘初心”。你泪流满面。', effect: () => ({ satisfaction: 5, reputation: 1 }) },
      { text: '捐给校史馆', description: '成为了学校的传说。', effect: () => ({ reputation: 2 }) }
    ]
  },
  // Grounded hidden events
  {
    id: 'e_h_celebrity',
    title: '综艺节目的邀约',
    description: '一档国民级综艺节目邀请你担任常驻嘉宾，通告费比你十年的工资还高。',
    category: 'network',
    condition: (stats, traits, sc, flags) => stats.reputation >= 16 && stats.academic <= 14 && !flags['is_celebrity'],
    choices: [
      { text: '拥抱流量，成为明星教授', description: '你火了，但同行看你的眼神变了。', effect: () => ({ resources: 5, reputation: 5, academic: -3 }), setFlag: 'is_celebrity' },
      { text: '拒绝，保持学者风骨', description: '你错过了一夜暴富的机会。', effect: () => ({ reputation: 1 }) }
    ]
  },
  {
    id: 'e_h_hermit',
    title: '最后一块拼图',
    description: '你意识到要攻克最终的难题，必须断绝与外界的一切无效社交，闭关修炼。',
    category: 'academic',
    condition: (stats, traits, sc, flags) => stats.academic >= 19 && stats.reputation <= 10 && !flags['is_hermit'],
    choices: [
      { text: '闭关！谁也别来烦我', description: '你消失在公众视野中，成为了传说。', effect: () => ({ academic: 2, resources: -2, reputation: -2 }), setFlag: 'is_hermit' },
      { text: '还是舍不得红尘', description: '生活继续。', effect: () => ({ satisfaction: 1 }) }
    ]
  },
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
    condition: (stats, traits, studentCount) => stats.satisfaction >= 18 && studentCount > 15,
    choices: [
      { text: '感动落泪', description: '这辈子值了。', effect: () => ({ reputation: 5, satisfaction: 5 }) },
    ]
  }
];
