import { GameEvent } from './types';

export const DLC_EVENTS: GameEvent[] = [
    // --- Academic & Sci-Fi ---
    {
        id: 'e_dlc_1',
        title: 'GPT 论文风波',
        description: '你发现一名硕士生的论文逻辑极其通顺，但引用的文献全是编的。',
        category: 'academic',
        choices: [
            { text: '全组开展学术诚信教育', description: '杀鸡儆猴，大家学会了正确使用工具。', effect: () => ({ academic: 1, satisfaction: -1 }) },
            { text: '勒令重写，延期毕业', description: '学生心态崩了，但守住了底线。', effect: () => ({ academic: 0, satisfaction: -2 }) },
            { text: '自己动手帮他改', description: '你成了“超级润色机器”，累得够呛。', effect: () => ({ academic: 1, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_3',
        title: '外星信号？',
        description: '你的射电望远镜收到了一段极似智慧生命的信号，如果是真的，将是诺奖级发现。',
        category: 'academic',
        choices: [
            { text: '立刻召开新闻发布会', description: '后来发现是微波炉干扰，成了国际笑话。', effect: () => ({ reputation: -4, academic: -1 }) },
            { text: '严谨验证，不急发声', description: '错过了热度，但保持了严谨。', effect: () => ({ academic: 1 }) },
            { text: '写成科幻小说出版', description: '意外畅销，赚了一笔版税。', effect: () => ({ resources: 3 }) }
        ]
    },
    {
        id: 'e_dlc_new_1',
        title: '多维空间',
        description: '你在推导公式时，发现了一个数学上的异常，似乎指向了更高维度的存在。',
        category: 'academic',
        choices: [
            { text: '深入研究，走火入魔', description: '你精神恍惚了三个月，醒来发现草稿纸上全是乱码。', effect: () => ({ academic: -1, satisfaction: -1 }) },
            { text: '发表论文', description: '被当成民科嘲笑，但也吸引了一批狂热粉丝。', effect: () => ({ reputation: -1, satisfaction: 1 }) },
            { text: '当作巧合忽略', description: '生活回归平静。', effect: () => ({ academic: 0 }) }
        ]
    },
    {
        id: 'e_dlc_new_3',
        title: '数据重复危机',
        description: '顶刊编辑来信，说你十年前的论文数据和另一篇俄罗斯论文高度相似，要求解释。',
        category: 'academic',
        choices: [
            { text: '找出原始记录自证清白', description: '发现是独立研究巧合，反而证明了结论可靠性。', effect: () => ({ academic: 2, reputation: 1 }) },
            { text: '指责对方抄袭', description: '国际骂战升级，双方学校都被牵连。', effect: () => ({ reputation: -2 }) },
            { text: '默默撤稿保平安', description: '虽然损失声誉，但避免了更麻烦的调查。', effect: () => ({ academic: -1, reputation: -1 }) }
        ]
    },
    
    // --- Career & Admin ---
    {
        id: 'e_dlc_2',
        title: '实验室搬迁',
        description: '学校要盖新大楼，要求你们限期搬迁到临时校区（荒郊野岭）。',
        category: 'career',
        choices: [
            { text: '配合学校，吃苦耐劳', description: '通勤时间+2小时，学生怨声载道。', effect: () => ({ reputation: 1, satisfaction: -3 }) },
            { text: '赖着不走，当钉子户', description: '水电被断了，实验被迫中断。', effect: () => ({ academic: -2, resources: -1 }) },
            { text: '争取经费，找搬家公司', description: '设备无损，但花了一大笔钱。', effect: () => ({ resources: -2, academic: 1 }) }
        ]
    },
    {
        id: 'e_dlc_6',
        title: '院长退休风云',
        description: '老院长退休，新院长空降，全院面临站队。',
        category: 'career',
        choices: [
            { text: '第一时间表忠心', description: '被老派系鄙视，但新院长给了点甜头。', effect: () => ({ resources: 2, reputation: -2 }) },
            { text: '保持中立，专注学术', description: '两边都不讨好，经费被削减。', effect: () => ({ resources: -2, academic: 1 }) },
            { text: '联合其他教授搞小团体', description: '形成了第三方势力，没人敢惹你。', effect: () => ({ reputation: 1, resources: 1 }) }
        ]
    },
    {
        id: 'e_dlc_7',
        title: '空调大战',
        description: '夏天，实验室空调坏了，报修显示要排队两周。',
        category: 'career',
        choices: [
            { text: '自费买新空调', description: '学生感动得痛哭流涕，尊你为神。', effect: () => ({ satisfaction: 4, resources: -2 }) },
            { text: '去院长办公室蹭空调', description: '顺便汇报了工作，一举两得。', effect: () => ({ academic: 1 }) },
            { text: '发放冰块和绿豆汤', description: '治标不治本，大家无心工作。', effect: () => ({ academic: -1 }) }
        ]
    },
    {
        id: 'e_dlc_10',
        title: '断网危机',
        description: '校园网光缆被挖掘机挖断了，全校断网三天。',
        category: 'career',
        choices: [
            { text: '用手机热点坚持工作', description: '流量费爆表。', effect: () => ({ resources: -1, academic: 1 }) },
            { text: '组织大家进行“无网团建”', description: '爬山、桌游，关系更铁了。', effect: () => ({ satisfaction: 3 }) },
            { text: '回家睡觉', description: '难得的假期。', effect: () => ({ academic: -1, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_new_4',
        title: '设备采购回扣',
        description: '仪器供应商偷偷塞给你一个信封，说可以“灵活处理”报价单。',
        category: 'career',
        choices: [
            { text: '当场拒绝并举报', description: '供应商被拉黑，你获得廉洁模范称号。', effect: () => ({ reputation: 2, resources: -1 }) },
            { text: '收下钱补贴实验室', description: '买了一批零食柜，学生幸福感爆棚。', effect: () => ({ satisfaction: 2, reputation: -1 }) },
            { text: '假装没看见', description: '对方以为你默认了，后续合作总给打折。', effect: () => ({ resources: 1 }) }
        ]
    },

    // --- Student Life ---
    {
        id: 'e_dlc_4',
        title: '学生博主',
        description: '你发现有个学生在 B 站做 Up 主，吐槽读研生活，粉丝比你引用数还多。',
        category: 'student',
        choices: [
            { text: '客串出镜，与民同乐', description: '你被做成了鬼畜视频，全网爆火。', effect: () => ({ reputation: 1, satisfaction: 2 }), setFlag: 'media_exposure' },
            { text: '严禁泄露实验室机密', description: '学生停更了，粉丝在评论区骂你。', effect: () => ({ reputation: -1 }) },
            { text: '让他帮忙剪辑课题组宣传片', description: '招生宣传效果拔群！', effect: () => ({ academic: 1, resources: 1 }) }
        ]
    },
    {
        id: 'e_dlc_5',
        title: '相亲角的传说',
        description: '你的学生去公园相亲角，因为发了顶刊，被大爷大妈疯抢。',
        category: 'student',
        choices: [
            { text: '鼓励学生多社交', description: '学生脱单了，心情变好，效率提升。', effect: () => ({ satisfaction: 2, academic: 1 }) },
            { text: '“有这时间不如跑胶”', description: '你被挂到了相亲群黑名单。', effect: () => ({ satisfaction: -2 }) },
            { text: '去相亲角帮学生把关', description: '你也被大妈看上了...场面混乱。', effect: () => ({ reputation: -1, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_15',
        title: '实验室闹鬼传闻',
        description: '学生传说深夜的细胞间有哭声，没人敢做晚上的实验。',
        category: 'student',
        choices: [
            { text: '带头夜宿实验室辟谣', description: '发现是离心机轴承坏了发出的声音。', effect: () => ({ satisfaction: 1, resources: -1 }) },
            { text: '请法师...做法', description: '封建迷信，被书记谈话。', effect: () => ({ reputation: -2 }) },
            { text: '那就不做夜间实验了', description: '进度变慢，但学生睡了个好觉。', effect: () => ({ academic: -1, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_new_5',
        title: '实验室宠物',
        description: '师兄偷偷在试剂柜养了只仓鼠，现在它把标记笔咬得满地都是。',
        category: 'student',
        choices: [
            { text: '正式收养，取名“小白鼠”', description: '成为课题组吉祥物，缓解科研压力。', effect: () => ({ satisfaction: 3, resources: -1 }) },
            { text: '勒令送走', description: '师兄emo了三天，实验频频出错。', effect: () => ({ academic: -1, satisfaction: -2 }) },
            { text: '做成“动物行为学观察实验”', description: '意外发了篇科普文章。', effect: () => ({ academic: 1, satisfaction: 1 }) }
        ]
    },

    // --- Network & Random ---
    {
        id: 'e_dlc_8',
        title: '二手仪器捡漏',
        description: '隔壁课题组倒闭了，有一批仪器低价处理。',
        category: 'network',
        choices: [
            { text: '全盘接收', description: '虽然旧了点，但极大地扩充了产能。', effect: () => ({ resources: -2, academic: 2 }) },
            { text: '挑挑拣拣', description: '买了个显微镜，结果是坏的。', effect: () => ({ resources: -1 }) },
            { text: '没钱，看热闹', description: '错过了扩充实力的机会。', effect: () => ({ academic: 0 }) }
        ]
    },
    {
        id: 'e_dlc_9',
        title: '保安大叔的扫地僧属性',
        description: '你看门的大叔突然指出了你黑板上公式的错误。',
        category: 'network',
        choices: [
            { text: '虚心请教', description: '发现大叔是退休的高级工程师。', effect: () => ({ academic: 2, reputation: 1 }) },
            { text: '觉得没面子，无视', description: '固步自封。', effect: () => ({ academic: -1 }) },
            { text: '聘请为实验室顾问', description: '大叔帮忙修好了所有坏掉的仪器。', effect: () => ({ resources: 2 }) }
        ]
    },
    {
        id: 'e_dlc_11',
        title: '神秘的快递盲盒',
        description: '实验室收到一个无主快递，里面是一箱昂贵的进口试剂。',
        category: 'network',
        choices: [
            { text: '据为己有', description: '用得很爽，但后来发现是送错的，赔了钱。', effect: () => ({ resources: -2, academic: 1 }) },
            { text: '全楼寻找失主', description: '找到了，对方为了感谢送了锦旗。', effect: () => ({ reputation: 1 }) },
            { text: '放在走廊吃灰', description: '最后过期了，浪费。', effect: () => ({ resources: 0 }) }
        ]
    },
    {
        id: 'e_dlc_12',
        title: '学术会议的自助餐',
        description: '你带学生参加会议，学生们拿着饭盒在自助餐疯狂打包。',
        category: 'network',
        choices: [
            { text: '觉得丢人，假装不认识', description: '学生觉得你太装。', effect: () => ({ satisfaction: -1 }) },
            { text: '加入打包队伍', description: '“这虾不错，给没来的师弟带点。”', effect: () => ({ satisfaction: 2, reputation: -1 }) },
            { text: '制止并教育礼仪', description: '学生虽然不爽，但学会了体面。', effect: () => ({ reputation: 1 }) }
        ]
    },
    {
        id: 'e_dlc_new_6',
        title: '学术网红合作',
        description: '百万粉丝科普博主想跟你拍一期“实验室探秘”，但风格很娱乐化。',
        category: 'network',
        choices: [
            { text: '全程配合玩梗', description: '视频火了，报考咨询量翻倍。', effect: () => ({ reputation: 2, satisfaction: 1 }) },
            { text: '坚持严谨科普', description: '视频播放量惨淡，但同行点赞。', effect: () => ({ academic: 1, reputation: -1 }) },
            { text: '让学生出镜当主播', description: '学生成了学术圈顶流，天天被粉丝追着问问题。', effect: () => ({ satisfaction: 2, academic: -1 }) }
        ]
    },

    // --- Risk ---
    {
        id: 'e_dlc_new_2',
        title: '深夜的敲门声',
        description: '半夜独自在办公室，有人敲门，打开却空无一人，只有一杯热咖啡。',
        category: 'risk',
        choices: [
            { text: '喝了它！', description: '味道不错，精力+100，通宵效率倍增。', effect: () => ({ academic: 2 }) },
            { text: '调监控', description: '监控显示是你自己梦游去买的。', effect: () => ({ satisfaction: -1 }) },
            { text: '吓得赶紧回家', description: '保命要紧。', effect: () => ({ academic: -1 }) }
        ]
    },
    {
        id: 'e_dlc_13',
        title: '停水风波',
        description: '实验楼停水，但有个反应必须用到冷凝水，否则会爆炸。',
        category: 'risk',
        choices: [
            { text: '组织学生接力搬运桶装水', description: '虽然累瘫了，但实验保住了。', effect: () => ({ academic: 1, satisfaction: -1 }) },
            { text: '紧急停止实验', description: '原料报废，损失惨重。', effect: () => ({ resources: -2 }) },
            { text: '祈祷不要炸', description: '真的炸了。', effect: () => ({ resources: -5, reputation: -2 }) }
        ]
    },
    {
        id: 'e_dlc_14',
        title: '优秀毕业论文抽检',
        description: '教育厅突然抽检上一届的硕士论文。',
        category: 'risk',
        choices: [
            { text: '自信满满，随便查', description: '全部合格，获得表彰。', effect: () => ({ reputation: 2 }) },
            { text: '连夜召回学生修改', description: '虚惊一场，但把学生折腾得够呛。', effect: () => ({ satisfaction: -2 }) },
            { text: '发现有一篇格式不对，试图掩盖', description: '被查出来了，全院通报。', effect: () => ({ reputation: -3 }) }
        ]
    },
    {
        id: 'e_dlc_new_7',
        title: '论文被撤稿预警',
        description: '某论文工厂被曝光，你三年前合作的一篇文章赫然在列。',
        category: 'risk',
        choices: [
            { text: '主动联系期刊说明情况', description: '虽然撤稿了，但赢得了学术诚信声誉。', effect: () => ({ reputation: 1, academic: -1 }) },
            { text: '甩锅给合作方', description: '互撕大战让你声名狼藉。', effect: () => ({ reputation: -3 }) },
            { text: '抓紧时间用该成果申个专利', description: '专利下来了，但被同行鄙视。', effect: () => ({ resources: 2, academic: -1 }) }
        ]
    },

    // --- Hidden Events ---
    {
        id: 'e_h_nobel_call',
        title: '斯德哥尔摩的来电',
        description: '电话那头传来英语，通知你获得了本年度的诺贝尔奖。这一切太不真实了。',
        category: 'academic',
        condition: (stats) => stats.academic >= 20 && stats.reputation >= 20,
        choices: [
          { text: '平静地接受，实至名归', description: '你登上了人类智慧的巅峰。', effect: () => ({ reputation: 10 }), setFlag: 'nobel_winner' },
          { text: '以为是诈骗，挂断电话', description: '组委会坚持打来了第二次。你成为了传奇。', effect: () => ({ reputation: 10 }), setFlag: 'nobel_winner' }
        ]
    },
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
    {
        id: 'e_h_parallel',
        title: '平行宇宙的邮件',
        description: '你收到一封来自“另一个你”的邮件，附件是你放弃的研究方向的诺贝尔奖获奖论文。',
        category: 'academic',
        condition: (stats, traits, sc, flags) => stats.academic >= 15 && stats.satisfaction <= 5,
        choices: [
          { text: '按邮件思路重新研究', description: '五年后你站在了领奖台上，却总觉得哪里不对。', effect: () => ({ academic: 5, satisfaction: -2 }) },
          { text: '删除邮件，坚守自己的道路', description: '虽然平凡，但每晚睡得安稳。', effect: () => ({ satisfaction: 3, academic: 1 }) },
          { text: '回信询问平行宇宙的生活', description: '邮箱自动回复：“该地址不存在”。', effect: () => ({ satisfaction: -1 }) }
        ]
    },
    {
        id: 'e_h_alumni',
        title: '亿万校友的投资',
        description: '你20年前教过的学渣突然回来，说要捐一个亿建实验室，条件是挂名通讯作者。',
        category: 'network',
        condition: (stats, traits, sc, flags) => stats.reputation >= 10 && flags['media_exposure'],
        choices: [
          { text: '接受条件，共建实验室', description: '科研条件大幅改善，同行议论纷纷。', effect: () => ({ resources: 10, academic: 3, reputation: -2 }) },
          { text: '拒绝挂名，只接受匿名捐赠', description: '他被你的风骨打动，捐了双倍。', effect: () => ({ resources: 20, reputation: 3 }) },
          { text: '建议他设立奖学金', description: '成为教育界美谈，你获得了“伯乐奖”。', effect: () => ({ reputation: 5, satisfaction: 3 }) }
        ]
    }
];
