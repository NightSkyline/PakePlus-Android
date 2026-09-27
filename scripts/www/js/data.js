// 非遗主题数据 — 六大中华非物质文化遗产
// 每个主题包含：标题、副题、图片、详细介绍（模拟视频内容）、3道答题
// 图片使用在线生成接口，prompt 遵循 SDXL 风格，描述具体可视画面

const HERITAGE_DATA = [
  {
    id: "jingju",
    title: "京 剧",
    subtitle: "国粹之韵 · 粉墨春秋",
    era: "距今二百余载",
    region: "北京",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/tool_text_to_image?prompt=Close%20up%20of%20Peking%20Opera%20performer%20with%20elaborate%20painted%20face%20makeup%20and%20ornate%20headdress%2C%20traditional%20Chinese%20opera%20costume%20in%20vermilion%20and%20gold%2C%20dramatic%20stage%20lighting%2C%20ink%20wash%20painting%20backdrop&image_size=portrait_4_3",
    intro:
      "京剧，又称「皮黄」，乃中国影响最深之戏曲剧种，发轫于清乾隆年间，融徽汉二调于一炉，迄今二百余载。其以「唱念做打」为四功，行当分「生、旦、净、丑」四大类，各擅胜场。脸谱设色皆有讲究：红表忠勇、黑表刚直、白表奸诈、金银表神怪。",
    body: [
      "「一身之戏在于脸，一脸之戏在于眼。」京剧脸谱以程式化色彩描摹人物心性，关公红脸尽显忠义，包拯黑脸铁面无私，曹操白脸奸雄毕露。",
      "「无声不歌，无动不舞。」水袖轻扬可诉千般衷肠，圆场一转便行万里之遥，一桌二椅可化万千景象，此乃中国戏曲「以虚拟实」之妙境。",
      "二零一零年，京剧入选联合国教科文组织「人类非物质文化遗产代表作名录」，被誉为东方艺术之瑰宝、中华民族之国粹。"
    ],
    quiz: [
      {
        q: "京剧的四大行当是下列哪一组？",
        options: ["生、旦、净、丑", "生、旦、净、末", "唱、念、做、打", "梅、程、荀、尚"],
        answer: 0
      },
      {
        q: "京剧脸谱中，红色通常代表何种品性？",
        options: ["奸诈阴险", "忠勇刚正", "神怪异相", "鲁莽暴躁"],
        answer: 1
      },
      {
        q: "京剧于哪一年入选联合国非遗名录？",
        options: ["2008年", "2010年", "2014年", "2006年"],
        answer: 1
      }
    ]
  },
  {
    id: "jianzhi",
    title: "剪 纸",
    subtitle: "刀剪春秋 · 纸上生花",
    era: "距今千五百载",
    region: "陕北",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/tool_text_to_image?prompt=Chinese%20red%20paper%20cut%20art%20on%20white%20rice%20paper%2C%20intricate%20floral%20and%20phoenix%20patterns%2C%20traditional%20folk%20craft%2C%20vermilion%20red%20paper%2C%20soft%20studio%20light&image_size=portrait_4_3",
    intro:
      "剪纸，中国最古之民间艺术也，迄今千五百余载。以剪刀或刻刀游走于红纸之上，顷刻间花鸟鱼虫、神话传说跃然纸上。北方浑厚粗犷，南方清秀细腻，同为巧夺天工。",
    body: [
      "「一剪之巧夺神功，美在民间永不朽。」剪纸多取朱红之纸，盖因红色于中华传统中表吉祥喜庆，每逢新春婚嫁，窗棂之上必见其影。",
      "题材广涉万事：鱼寓「年年有余」，石榴寓「多子多福」，鹿谐「禄」，蝠谐「福」，葫芦纳百宝，皆寄托民间最朴素之祈愿。",
      "二零零九年，中国剪纸入选联合国教科文组织「人类非物质文化遗产代表作名录」，一纸一刀之间，承载着千百年来寻常百姓之烟火与巧思。"
    ],
    quiz: [
      {
        q: "剪纸通常使用什么颜色的纸张？",
        options: ["白色", "蓝色", "朱红色", "黑色"],
        answer: 2
      },
      {
        q: "剪纸艺术距今约有多少年历史？",
        options: ["约500年", "约1500年", "约3000年", "约200年"],
        answer: 1
      },
      {
        q: "中国剪纸于哪一年入选联合国非遗名录？",
        options: ["2009年", "2010年", "2008年", "2014年"],
        answer: 0
      }
    ]
  },
  {
    id: "shufa",
    title: "书 法",
    subtitle: "墨舞千秋 · 笔走龙蛇",
    era: "三千余载",
    region: "中原",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/tool_text_to_image?prompt=Ancient%20Chinese%20calligraphy%20brush%20writing%20on%20rice%20paper%2C%20ink%20stone%20and%20bamboo%20brush%2C%20flowing%20black%20ink%20characters%2C%20scholar%20study%20desk%2C%20warm%20amber%20lamplight&image_size=portrait_4_3",
    intro:
      "中国书法，以汉字为骨、以笔墨为魂之独特艺术也。文房四宝——笔、墨、纸、砚，乃书家之器。书体凡五：篆、隶、楷、行、草，各具风骨，或端严或飞动。",
    body: [
      "「书，心画也。」一管柔毫，能藏千钧之力；一点一画，可见书者之心性气度。横如千里阵云，竖如万岁枯藤，此书法所以为「无声之诗」也。",
      "王羲之被誉为「书圣」，其《兰亭集序》笔意翩若惊鸿、婉若游龙，被尊为「天下第一行书」，千载以来无人能出其右。",
      "二零零九年，中国书法入选联合国教科文组织「人类非物质文化遗产代表作名录」，汉字之形与意，于笔墨流转间得以永生。"
    ],
    quiz: [
      {
        q: "「文房四宝」指的是下列哪一组？",
        options: ["琴、棋、书、画", "笔、墨、纸、砚", "诗、酒、花、茶", "梅、兰、竹、菊"],
        answer: 1
      },
      {
        q: "下列书体中，不属于五种主要书体的是？",
        options: ["篆书", "隶书", "楷书", "宋体"],
        answer: 3
      },
      {
        q: "被后世尊为「书圣」的书法家是？",
        options: ["王羲之", "颜真卿", "柳公权", "苏轼"],
        answer: 0
      }
    ]
  },
  {
    id: "chayi",
    title: "茶 艺",
    subtitle: "一叶知春 · 壶中乾坤",
    era: "数千载",
    region: "江南",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/tool_text_to_image?prompt=Chinese%20tea%20ceremony%2C%20celadon%20teapot%20pouring%20tea%20into%20small%20porcelain%20cups%2C%20bamboo%20mat%2C%20steam%20rising%2C%20warm%20amber%20light%2C%20ink%20wash%20painting%20ambiance&image_size=portrait_4_3",
    intro:
      "中国茶艺源远流长，茶圣陆羽著《茶经》三卷，乃世上第一部茶学专著。中国茶分六大类：绿、红、青、白、黄、黑，各擅其香。功夫茶讲究「高冲低斟」，紫砂为上。",
    body: [
      "「茶之为饮，发乎神农氏。」相传神农尝百草而得茶解毒，自此茶由药而饮，由饮而艺，渐成中华待客敬天之道。",
      "「高冲低斟」乃冲泡之要诀：高冲以激茶香，低斟以保温度。一壶之内，先敬天地，次敬客长，再自饮之，礼数之中尽显东方之温润。",
      "二零二二年，「中国传统制茶技艺及其相关习俗」入选联合国教科文组织人类非遗名录，中华茶香，香飘四海，历久弥新。"
    ],
    quiz: [
      {
        q: "被尊为「茶圣」、著有《茶经》的是？",
        options: ["陆羽", "神农", "卢仝", "蔡襄"],
        answer: 0
      },
      {
        q: "下列哪一项不属于中国六大茶类？",
        options: ["绿茶", "红茶", "黄茶", "花茶"],
        answer: 3
      },
      {
        q: "中国制茶技艺及其相关习俗于哪年入选联合国非遗？",
        options: ["2022年", "2018年", "2020年", "2019年"],
        answer: 0
      }
    ]
  },
  {
    id: "cixiu",
    title: "刺 绣",
    subtitle: "针黹生辉 · 锦上生花",
    era: "数千载",
    region: "苏湘蜀粤",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/tool_text_to_image?prompt=Close%20up%20of%20Chinese%20silk%20embroidery%20with%20colorful%20threads%2C%20peony%20and%20phoenix%20pattern%2C%20fine%20needlework%20on%20silk%2C%20gold%20and%20jade%20green%2C%20soft%20light&image_size=portrait_4_3",
    intro:
      "中国刺绣有数千载历史，「四大名绣」——苏绣、湘绣、蜀绣、粤绣，各擅其妙。苏绣以「双面绣」独步天下，蜀绣以芙蓉鲤鱼见长。针法凡数十种，丝绸为底，彩线为饰。",
    body: [
      "「慈母手中线，游子身上衣。」刺绣之始，本为生计之需，后渐成一门绝艺。一针一线，可绣山川日月、花鸟虫鱼，丝缕之间尽显中华女子之巧思与坚忍。",
      "苏绣之「双面绣」，一面观之为猫，一面观之为犬，同针异彩，两面各异，乃刺绣技艺登峰造极之作，世称「绣中绝品」。",
      "中国「苏绣、湘绣、蜀绣、粤绣」四大名绣，与各地民间刺绣交相辉映，于二零零六年入选首批国家级非物质文化遗产名录，千针万线，绣出锦绣中华。"
    ],
    quiz: [
      {
        q: "下列哪一项不属于中国「四大名绣」？",
        options: ["苏绣", "湘绣", "蜀绣", "京绣"],
        answer: 3
      },
      {
        q: "以「双面绣」绝技闻名于世的是？",
        options: ["苏绣", "湘绣", "蜀绣", "粤绣"],
        answer: 0
      },
      {
        q: "中国传统刺绣通常以何物为底料？",
        options: ["棉布", "麻布", "丝绸", "纸张"],
        answer: 2
      }
    ]
  },
  {
    id: "piying",
    title: "皮影戏",
    subtitle: "灯影千年 · 一幕大千",
    era: "距今两千载",
    region: "陕西",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/tool_text_to_image?prompt=Chinese%20shadow%20puppetry%2C%20illuminated%20translucent%20leather%20puppet%20behind%20white%20screen%2C%20warm%20backlight%2C%20traditional%20figures%20and%20horse%2C%20silhouette%20art&image_size=portrait_4_3",
    intro:
      "皮影戏，又称「灯影戏」，乃借助灯光照射兽皮剪影以演故事之民间戏剧也，迄今约两千载。艺人一手操纵影人，一边说唱念打，方寸幕布可演千秋家国、万古风流。",
    body: [
      "「一口叙说千古事，双手对舞百万兵。」皮影艺人一人多角，生旦净丑皆出口中，千军万马尽在双手，方寸白幕之间，山河万里，岁月千年。",
      "影人以牛皮、驴皮雕镂而成，刻工精绝，设色浓丽。关节处以线连缀，操纵自如。陕西华县皮影最为著名，刀法洗练，造型夸张，世称「中国皮影之首」。",
      "二零一一年，中国皮影戏入选联合国教科文组织「人类非物质文化遗产代表作名录」，一盏孤灯，一幕白布，照见千载人间烟火与匠心。"
    ],
    quiz: [
      {
        q: "皮影戏又称作什么？",
        options: ["灯影戏", "木偶戏", "傩戏", "评剧"],
        answer: 0
      },
      {
        q: "皮影戏距今约有多少年历史？",
        options: ["约2000年", "约500年", "约1000年", "约300年"],
        answer: 0
      },
      {
        q: "中国皮影戏于哪一年入选联合国非遗名录？",
        options: ["2011年", "2010年", "2014年", "2008年"],
        answer: 0
      }
    ]
  }
];

window.HERITAGE_DATA = HERITAGE_DATA;
