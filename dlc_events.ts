import { GameEvent } from './types';

export const DLC_EVENTS: GameEvent[] = [
    // --- 原有事件保留 ---
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
    // --- 新增 Academic 事件 ---
    {
        id: 'e_dlc_ac_1',
        title: 'AI写基金申请书',
        description: '组里博后用GPT-8写了份基金申请书，逻辑比你手写的还好，但查重率0%却透着“机器味”。',
        category: 'academic',
        choices: [
            { text: '直接提交，赌评审看不出来', description: '居然中了！但评审私下说“这文风不像你”。', effect: () => ({ resources: 5, academic: 1, reputation: -1 }) },
            { text: '逐句修改，保留框架', description: '耗时两周，但申请书既有逻辑又有温度，顺利中标。', effect: () => ({ resources: 4, academic: 2 }) },
            { text: '怒斥博后，坚持手写', description: '写得焦头烂额，最终落选，博后觉得你食古不化。', effect: () => ({ resources: -1, satisfaction: -2 }) }
        ]
    },
    {
        id: 'e_dlc_ac_2',
        title: '古早数据复活',
        description: '翻实验室仓库时，发现一箱软盘，里面是90年代未发表的实验数据，居然能完美补全你现在的课题。',
        category: 'academic',
        choices: [
            { text: '直接用，署上老教授名字', description: '老教授感动落泪，带你发了顶刊。', effect: () => ({ academic: 3, reputation: 1 }) },
            { text: '重新验证数据', description: '发现当年的仪器误差，修正后结论更严谨。', effect: () => ({ academic: 2, satisfaction: 1 }) },
            { text: '当废品卖掉软盘', description: '后来得知同领域团队靠类似数据发了Nature，悔青肠子。', effect: () => ({ academic: -2, satisfaction: -3 }) }
        ]
    },
    {
        id: 'e_dlc_ac_3',
        title: '跨学科合作陷阱',
        description: '艺术学院邀请你合作“科学可视化”展览，要求把你的实验数据做成沉浸式装置，预算要你出一半。',
        category: 'academic',
        choices: [
            { text: '全力配合，砸钱做精品', description: '展览火出圈，你的课题成了网红，招生爆满。', effect: () => ({ reputation: 3, resources: -3, academic: 1 }) },
            { text: '只给数据，不参与也不掏钱', description: '装置做得四不像，艺术院骂你小气，学术圈笑你不懂审美。', effect: () => ({ reputation: -2 }) },
            { text: '要求艺术生帮你做课题配图', description: '配图美到被期刊选为封面，展览摆烂也无所谓了。', effect: () => ({ academic: 2, reputation: -1 }) }
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
    // --- 新增 Career 事件 ---
    {
        id: 'e_dlc_ca_1',
        title: '绩效考评内卷',
        description: '学校搞“量化考核”，要求每年至少发3篇SCI、带5个学生、拿1个项目，少一项扣绩效。',
        category: 'career',
        choices: [
            { text: '疯狂接项目发灌水论文', description: '绩效拿满，但学生累到退学，同行背后骂你卷王。', effect: () => ({ resources: 2, academic: -1, satisfaction: -3 }) },
            { text: '找教务处据理力争', description: '考核标准放宽，全院感谢你，但你被领导记恨。', effect: () => ({ reputation: 2, resources: -1 }) },
            { text: '摆烂，扣绩效就扣', description: '专心做一个高质量课题，年底发了顶刊，领导又来拉拢你。', effect: () => ({ academic: 3, resources: -2, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_ca_2',
        title: '会议室抢座大战',
        description: '全院大会只有前排有充电口和麦克风，早到的教授们开始抢座，甚至占座。',
        category: 'career',
        choices: [
            { text: '凌晨6点去占座', description: '抢到C位，发言被院长重视，就是少睡了3小时。', effect: () => ({ reputation: 1, satisfaction: -1 }) },
            { text: '带折叠充电宝坐后排', description: '安静摸鱼改论文，没人打扰效率超高。', effect: () => ({ academic: 2 }) },
            { text: '故意把水杯放前排占座后走掉', description: '被老教授骂没素质，全院通报批评。', effect: () => ({ reputation: -2 }) }
        ]
    },
    {
        id: 'e_dlc_ca_3',
        title: '办公用品申领荒',
        description: '学校后勤改革，中性笔、打印纸每月限量申领，实验室已经快断供了。',
        category: 'career',
        choices: [
            { text: '找后勤主任送礼', description: '申领额度翻倍，其他教授眼红举报你。', effect: () => ({ resources: -1, reputation: -1 }) },
            { text: '让学生从家里带纸和笔', description: '学生吐槽“上班还得自带装备”，满意度暴跌。', effect: () => ({ satisfaction: -2 }) },
            { text: '网购批发办公用品', description: '花小钱解决大问题，实验室成了“办公用品小卖部”。', effect: () => ({ resources: -1, satisfaction: 2 }) }
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
    // --- 新增 Student 事件 ---
    {
        id: 'e_dlc_st_1',
        title: '毕业答辩突发状况',
        description: '你的硕士生答辩时，PPT突然崩了，U盘也读不出来，评委脸色越来越差。',
        category: 'student',
        choices: [
            { text: '让学生口头答辩', description: '学生临场发挥超棒，评委夸应变能力强，顺利通过。', effect: () => ({ academic: 1, satisfaction: 2 }) },
            { text: '冲回办公室拿备份U盘', description: '迟到10分钟，评委不耐烦，给了“修改后答辩”。', effect: () => ({ academic: -1, satisfaction: -1 }) },
            { text: '当场帮学生圆场，甩锅给学校系统', description: '评委被逗笑，放过了学生，但你被教务处警告。', effect: () => ({ reputation: -1, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_st_2',
        title: '实验室奶茶自由',
        description: '学生们众筹想买个奶茶机放实验室，每人每月扣50块，问你同不同意。',
        category: 'student',
        choices: [
            { text: '同意，还自掏腰包加预算', description: '奶茶机到位，学生实验效率翻倍，就是总有人偷喝不加糖。', effect: () => ({ satisfaction: 4, resources: -1 }) },
            { text: '反对，说影响实验安全', description: '学生偷偷买了迷你咖啡机，躲在通风橱里喝。', effect: () => ({ satisfaction: -2, academic: 0 }) },
            { text: '要求奶茶机只在休息时间用', description: '劳逸结合，学生既开心又不耽误工作。', effect: () => ({ satisfaction: 2, academic: 1 }) }
        ]
    },
    {
        id: 'e_dlc_st_3',
        title: '师弟师妹抢工位',
        description: '新来的研一学生抢了师姐用了三年的靠窗工位，师姐气到要罢工。',
        category: 'student',
        choices: [
            { text: '让师弟把工位让出来', description: '师姐安心实验，师弟觉得你偏心，消极怠工。', effect: () => ({ academic: 1, satisfaction: -1 }) },
            { text: '抽签决定工位归属', description: '公平公正，两人都没意见，就是师姐抽输了哭了半天。', effect: () => ({ satisfaction: 1 }) },
            { text: '把自己的办公室工位让出来', description: '学生们都感动了，抢着帮你干活，你只能蹲实验室角落办公。', effect: () => ({ satisfaction: 3, academic: -1 }) }
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
    // --- 新增 Network 事件 ---
    {
        id: 'e_dlc_ne_1',
        title: '学术群聊误发消息',
        description: '你把吐槽“院长的项目评审就是走过场”的消息，误发到了全院教授群，已读人数瞬间破百。',
        category: 'network',
        choices: [
            { text: '假装号被盗了', description: '大家半信半疑，院长私下找你喝茶，没明说但气氛尴尬。', effect: () => ({ reputation: -1, satisfaction: -1 }) },
            { text: '立刻补一句“反例如下”，假装是学术讨论', description: '强行圆成学术观点，反应快被夸机智，就是手心全是汗。', effect: () => ({ reputation: 1, satisfaction: 0 }) },
            { text: '干脆继续吐槽，说出大家的心声', description: '被院长移出群聊，但其他教授私下给你发红包点赞。', effect: () => ({ reputation: -2, satisfaction: 3 }) }
        ]
    },
    {
        id: 'e_dlc_ne_2',
        title: '展会薅羊毛大赛',
        description: '参加行业展会，学生们比谁薅的周边（帆布袋、笔记本、徽章）多，甚至跟其他学校的人抢。',
        category: 'network',
        choices: [
            { text: '帮学生一起薅，主打一个不亏', description: '薅了三大袋，实验室办公用品全包了，就是被同行拍下来发朋友圈。', effect: () => ({ resources: 1, reputation: -1, satisfaction: 2 }) },
            { text: '制止学生，专注交流学术', description: '认识了大牛教授，拿到合作机会，学生抱怨没薅到好看的徽章。', effect: () => ({ academic: 2, satisfaction: -1 }) },
            { text: '把薅来的周边分给其他展位的同行', description: '人脉暴涨，好多人主动加你微信，后续合作不断。', effect: () => ({ reputation: 2, academic: 1 }) }
        ]
    },
    {
        id: 'e_dlc_ne_3',
        title: '合作导师放鸽子',
        description: '你约了外校的大牛导师合作申请重大项目，提交前一天他突然说没空参与，理由是“要带孙子逛公园”。',
        category: 'network',
        choices: [
            { text: '卑微求情，说项目成了分他通讯作者', description: '大牛同意了，但要求第一作者给他的学生，你组里的博后气到离职。', effect: () => ({ academic: 1, satisfaction: -2, resources: 3 }) },
            { text: '临时换合作导师，找同门师兄', description: '项目顺利提交，还拉近了和师兄的关系，就是熬夜改了一整晚申请书。', effect: () => ({ academic: 2, satisfaction: -1 }) },
            { text: '放弃申请，专注现有课题', description: '虽然丢了大项目，但把现有课题做深，年底发了篇重磅论文。', effect: () => ({ academic: 3, resources: -1 }) }
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
    // --- 新增 Risk 事件 ---
    {
        id: 'e_dlc_ri_1',
        title: '试剂瓶标签脱落',
        description: '实验室冰箱里的一瓶剧毒试剂标签掉了，没人知道是什么，闻起来还有点甜。',
        category: 'risk',
        choices: [
            { text: '取样送去检测中心', description: '确认是氰化物，及时封存，避免了事故，被评为安全标兵。', effect: () => ({ reputation: 2, resources: -1 }) },
            { text: '凭经验猜测，随便贴个标签', description: '学生用它做实验，幸好只是轻微中毒，你被停职检查。', effect: () => ({ academic: -3, reputation: -2 }) },
            { text: '直接扔掉，眼不见为净', description: '被环保部门查到，实验室被罚巨款，还上了新闻。', effect: () => ({ resources: -4, reputation: -3 }) }
        ]
    },
    {
        id: 'e_dlc_ri_2',
        title: '实验记录丢失',
        description: '你手写的核心实验记录本丢了，里面是三年的关键数据，马上要结题了。',
        category: 'risk',
        choices: [
            { text: '发动全组翻遍实验室和垃圾桶', description: '在保洁阿姨的垃圾袋里找到，数据保住，就是臭烘烘的。', effect: () => ({ academic: 2, satisfaction: -1 }) },
            { text: '凭记忆补写记录', description: '数据和原始有出入，结题被专家质疑，项目延期。', effect: () => ({ academic: -2, resources: -1 }) },
            { text: '坦白记录丢失，申请延期结题', description: '专家夸你诚实，给了延期半年，学生们松了一口气。', effect: () => ({ reputation: 1, satisfaction: 1 }) }
        ]
    },
    {
        id: 'e_dlc_ri_3',
        title: '校庆表演翻车',
        description: '校庆被安排表演“科研人之歌”诗朗诵，你紧张到忘词，还把“SCI”念成了“KTV”。',
        category: 'risk',
        choices: [
            { text: '当场尬笑，即兴编词圆场', description: '“KTV里唱科研，SCI里写青春”，台下笑成一片，反而火了。', effect: () => ({ reputation: 2, satisfaction: 1 }) },
            { text: '跑下台，假装身体不舒服', description: '被校领导批评没集体荣誉感，校庆奖金没了。', effect: () => ({ resources: -1, reputation: -2 }) },
            { text: '硬着头皮念完，全程面无表情', description: '没人记住你的翻车，只觉得你高冷，反而有学生粉你。', effect: () => ({ satisfaction: -1, reputation: 1 }) }
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
    },
    // --- 新增 Hidden 事件 ---
    {
        id: 'e_h_lab_celebrity',
        title: '实验室成网红打卡点',
        description: '你之前和学术博主合作的视频爆火，游客天天堵在实验室门口打卡，甚至有人翻窗户进来拍照。',
        category: 'academic',
        condition: (stats, traits, sc, flags) => stats.reputation >= 15 && flags['media_exposure'],
        choices: [
          { text: '开放限时参观，收门票补贴实验室', description: '赚了不少钱，但实验总被打扰，学生苦不堪言。', effect: () => ({ resources: 8, academic: -2, satisfaction: -1 }) },
          { text: '申请学校安保，禁止外人进入', description: '恢复安静，但网红游客骂你“耍大牌”，口碑下滑。', effect: () => ({ reputation: -1, academic: 2 }) },
          { text: '把实验室做成科普体验馆', description: '既满足游客又做了科普，被评为“科普教育基地”。', effect: () => ({ reputation: 5, resources: 5, satisfaction: 2 }) }
        ]
    },
    {
        id: 'e_h_retirement_class',
        title: '退休前的最后一课',
        description: '你到了退休年龄，最后一堂课来了上百名校友，甚至有诺奖得主（你的学生）专程回来听课。',
        category: 'student',
        condition: (stats, traits, sc, flags, year) => year >= 30 && stats.satisfaction >= 15,
        choices: [
          { text: '讲最后一次专业课，全程落泪', description: '感动全场，校史馆把你的教案收藏，学生们众筹给你立了雕像。', effect: () => ({ reputation: 5, satisfaction: 5 }) },
          { text: '不讲课本，聊人生和科研的遗憾', description: '内容被整理成书，成了科研人的必读书，版税拿到手软。', effect: () => ({ resources: 6, academic: 2 }) },
          { text: '提前下课，和老同事去喝酒', description: '大家说你随性洒脱，最后一课成了校园传说，就是校友有点失望。', effect: () => ({ satisfaction: 4, reputation: 1 }) }
        ]
    },
    {
        id: 'e_h_nobel_jury',
        title: '诺奖评委的匿名调研',
        description: '你收到匿名邮件，是诺贝尔奖评审团的调研，问你认为本年度该领域最有价值的研究是谁的。',
        category: 'academic',
        condition: (stats, traits, sc, flags) => stats.academic >= 25 && flags['nobel_winner'],
        choices: [
          { text: '推荐自己的竞争对手', description: '对方获奖后，公开感谢你的公正，两人冰释前嫌合作研究。', effect: () => ({ academic: 4, reputation: 3 }) },
          { text: '推荐自己的学生', description: '学生成了最年轻的诺奖得主，你被称为“伯乐中的伯乐”。', effect: () => ({ reputation: 4, satisfaction: 4 }) },
          { text: '推荐自己未发表的研究', description: '评审团认为你功利心太重，取消了你的提名资格，得不偿失。', effect: () => ({ academic: -2, reputation: -2 }) }
        ]
    }
];
