// Import required product images
import hdpePipes from '@assets/HDPE pipes (PE pipes) .png';
import manholeD400 from '@assets/Manhole cover D400(K) .png';
import rainwaterGrillD400 from '@assets/Rainwater grill D400 1 .png';
import rainwaterGrillD4002 from '@assets/Rainwater grill D400 2 .png';
import rainwaterGrillMeria from '@assets/Rainwater grill D400 MERIA .png';
import rainwaterGrillF900 from '@assets/Rainwater grill F900 .png';
import drainageGrateC250 from '@assets/Drainage channel 5066 high-resistance spherical graphite cast iron, C250 EN 1433 .png';
import steelPipesOilGas from '@assets/Steel Pipes For Oil and Gas Purpose .png';
import gateValve from '@assets/Gate valve cast iron DN50-500, PN10-16 .png';
import groundFireHydrant from '@assets/Ground fire hydrant .png';
import doubleCorrugatedPipes from '@assets/Double corrugated pipes .png';
import steelReinforcedPipe from '@assets/Steel reinforced corrugated polyethilene pipe.png';
import hsawPilesWater from '@assets/Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png';
import hsawPilesPurpose from '@assets/Helical Submerged Arc Welded (HSAW) Pipes For Pile Purpose.png';
import elbow90 from '@assets/Elbow 90° (Injection) fitting .png';
import equalTee from '@assets/Equal TEE 90° (Injection) fitting .png';
import elbow45 from '@assets/Elbow 45° (Injection) fitting .png';
import flangeAdapterShort from '@assets/Flange adapter-Short type (Injection) .png';
import wasteBox from '@assets/Waste box 30 l .png';

// Import aluminum profile images from attached assets
import uProfiles from '@assets/Aluminum U-Profiles.jpg';
import tProfiles from '@assets/Aluminum T-Profiles.jpg';
import ledProfiles from '@assets/Aluminum LED Profile.jpg';
import specialProfiles from '@assets/Aluminum-Profile-Extrusion.jpg';

import { ProductDetails } from './product-data';

// Chinese (Simplified) product details map
export const zhCNProductDetailsMap: Record<string, Partial<ProductDetails>> = {
  'standard-profiles': {
    id: 'standard-profiles',
    title: '标准型材',
    description: '适用于建筑和结构应用的标准铝型材，能承受高负荷并具有优异的耐腐蚀性。',
    image: uProfiles,
    category: 'aluminum',
    features: [
      '耐腐蚀性',
      '高强度',
      '易于加工',
      '轻量化设计'
    ],
    applications: [
      '商业建筑',
      '住宅建筑',
      '工业框架',
      '建筑外墙系统'
    ],
    specifications: {
      '材料': '铝合金 EN AW-6060, EN AW-6063',
      '表面处理': '阳极氧化, 粉末涂层或自然状态',
      '标准长度': '6000毫米',
      '生产方法': '热挤压'
    }
  },
  'machine-building-profiles': {
    id: 'machine-building-profiles',
    title: '机械加工型材',
    description: '专为机械制造和工业自动化设计的精密铝型材，具有出色的刚性和稳定性。',
    image: tProfiles,
    category: 'aluminum',
    features: [
      '高精度尺寸',
      '优异的表面光洁度',
      '卓越的刚性',
      '多种连接选项'
    ],
    applications: [
      '工业自动化',
      '机器防护',
      '工作站',
      '组装线'
    ],
    specifications: {
      '材料': '铝合金 EN AW-6063, EN AW-6082',
      '合金状态': 'T5, T6',
      '精度': '高于标准型材',
      '尺寸范围': '20x20毫米至80x80毫米',
      '特性': '各种槽系统（包括T型槽）'
    }
  },
  'led-profiles': {
    id: 'led-profiles',
    title: 'LED型材',
    description: '专为LED照明应用设计的铝型材，提供优异的散热性能和灵活的安装选项。',
    image: ledProfiles,
    category: 'aluminum',
    features: [
      '优异的散热性能',
      '多样化的安装选项',
      '易于集成的设计',
      '美观的表面处理'
    ],
    applications: [
      '商业照明',
      '住宅照明',
      '橱柜照明',
      '展示照明'
    ],
    specifications: {
      '材料': '高品质铝合金',
      '表面处理': '阳极氧化处理',
      '颜色选项': '银色, 黑色, 白色, 定制颜色',
      '配件': '终端盖, 安装夹, 扩散器'
    }
  },
  'special-profiles': {
    id: 'special-profiles',
    title: '特殊型材',
    description: '根据客户规格定制的铝型材，满足独特应用需求，提供量身定制的解决方案。',
    image: specialProfiles,
    category: 'aluminum',
    features: [
      '定制尺寸和形状',
      '专用合金选项',
      '特殊表面处理',
      '复杂几何设计能力'
    ],
    applications: [
      '航空航天',
      '铁路运输',
      '医疗设备',
      '专业制造'
    ],
    specifications: {
      '材料': '根据需求定制的铝合金',
      '表面处理': '根据需求定制',
      '尺寸': '完全定制',
      '公差': '根据应用的严格公差'
    }
  },
  'hdpe-pipes': {
    id: 'hdpe-pipes',
    title: 'HDPE管道',
    description: '高密度聚乙烯(HDPE)管道系统，提供卓越的耐用性和灵活性，适用于各种基础设施应用。',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      '优异的抗化学腐蚀性',
      '耐冲击性',
      '长使用寿命',
      '维护需求低'
    ],
    applications: [
      '饮用水输送',
      '燃气分配',
      '污水系统',
      '工业流体运输'
    ],
    specifications: {
      '材料': 'PE100（高密度聚乙烯）',
      '标准': 'EN 12201, ISO 4427',
      '直径': '20毫米至1200毫米',
      '压力等级': 'PN4至PN25',
      '颜色': '黑色带蓝色条纹（水）或黄色条纹（气）',
      '连接': '热熔对接、电熔或机械接头'
    }
  },
  'double-corrugated-pipes': {
    id: 'double-corrugated-pipes',
    title: '双壁波纹管',
    description: '双壁波纹聚乙烯管道系统，设计用于各种排水和下水道应用，具有优异的耐用性和抗冲击性能。',
    image: doubleCorrugatedPipes,
    category: 'polyethylene',
    features: [
      '耐腐蚀',
      '优异的抗冲击性能',
      '轻量化安装',
      '长使用寿命',
      '成本效益高'
    ],
    applications: [
      '雨水排放系统',
      '市政排水',
      '地下排水系统',
      '农业排水'
    ],
    specifications: {
      '材料': 'HDPE（高密度聚乙烯）',
      '标准': 'EN 13476',
      '直径': '110毫米至1000毫米',
      '环刚度': 'SN4, SN8, SN16 kN/m²',
      '颜色': '外部黑色，内部绿色或蓝色',
      '连接': '带橡胶密封圈的插口连接'
    }
  },
  'reinforced-corrugated-pipes': {
    id: 'reinforced-corrugated-pipes',
    title: '钢筋增强波纹管',
    description: '钢筋增强的聚乙烯波纹管，为需要额外强度和耐用性的重型应用提供完美解决方案。',
    image: steelReinforcedPipe,
    category: 'polyethylene',
    features: [
      '高承载能力',
      '出色的结构完整性',
      '抗变形',
      '耐化学腐蚀',
      '安装简便'
    ],
    applications: [
      '高速公路排水',
      '重型工业排水',
      '地下涵洞',
      '雨水管理系统'
    ],
    specifications: {
      '材料': '钢筋增强HDPE',
      '直径': '300毫米至2000毫米',
      '环刚度': 'SN8至SN16',
      '钢筋': '螺旋或环形钢筋增强',
      '连接': '带橡胶密封圈的插口连接'
    }
  },
  'manhole-covers': {
    id: 'manhole-covers',
    title: '井盖',
    description: '重型铸铁井盖，具有高承载能力，设计用于各种城市应用，符合国际标准。',
    image: manholeD400,
    category: 'cast-iron',
    features: [
      '高承载能力',
      '耐腐蚀设计',
      '防盗功能',
      '符合国际标准'
    ],
    applications: [
      '城市道路',
      '人行道',
      '停车场',
      '工业区'
    ],
    specifications: {
      '材料': '高品质灰铸铁',
      '负载分类': 'B125至D400',
      '直径': '600毫米，800毫米，1000毫米（标准尺寸）',
      '高度': '根据等级，80毫米至150毫米'
    }
  },
  'drainage-grates': {
    id: 'drainage-grates',
    title: '排水格栅',
    description: '高强度铸铁排水格栅，提供高效的表面水收集和排放，适用于各种城市环境。',
    image: rainwaterGrillD400,
    category: 'cast-iron',
    features: [
      '高流量设计',
      '防滑表面',
      '抗锈蚀处理',
      '安装简便'
    ],
    applications: [
      '城市人行道和步行区',
      '停车场和车道',
      '商业空间',
      '住宅开发区',
      '公园和休闲区'
    ],
    specifications: {
      '材料': '铸铁框架和格栅',
      '负载分类': '根据EN 124的D400',
      '尺寸': '600 x 600毫米（标准尺寸）',
      '表面处理': '黑色沥青或粉末涂层'
    }
  },
  'hsaw-pipes': {
    id: 'hsaw-pipes',
    title: 'HSAW钢管',
    description: '螺旋埋弧焊接(HSAW)钢管，广泛用于供水、污水和天然气输送系统。',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      '高强度钢结构',
      '耐腐蚀涂层',
      '高压能力',
      '长寿命',
      '多种尺寸选择'
    ],
    applications: [
      '市政水务工程',
      '天然气运输',
      '石油输送',
      '工业管道系统'
    ],
    specifications: {
      '材料': '碳钢（S235JR/S275JR/S355JR）',
      '直径范围': '200毫米至3000毫米',
      '壁厚': '3毫米至25毫米',
      '标准': 'EN 10217-1, API 5L',
      '长度': '6米至12米标准长度'
    }
  },
  'oil-gas-pipes': {
    id: 'oil-gas-pipes',
    title: '石油和天然气管道',
    description: '专为石油和天然气运输设计的高性能钢管，能承受极端条件和高压。',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      '高压能力',
      '抗震性',
      '多种涂层选择',
      '严格质量控制',
      '符合行业标准'
    ],
    applications: [
      '石油提取与运输',
      '天然气分配',
      '炼油厂基础设施',
      '海上平台'
    ],
    specifications: {
      '材料': '高强度碳钢或合金钢',
      '规格': 'API 5L X42至X70',
      '焊接类型': 'ERW/LSAW/SSAW',
      '涂层': '三层PE/PP, FBE, 内外环氧',
      '压力等级': '可达到450巴'
    }
  },
  'drainage-channel': {
    id: 'drainage-channel',
    title: '排水沟',
    description: '高强度排水沟系统，提供高效的表面水收集和排水，适用于各种城市和工业环境。',
    image: drainageGrateC250,
    category: 'cast-iron',
    features: [
      '高承载能力',
      '抗腐蚀材料',
      '模块化设计',
      '简单安装',
      '低维护需求'
    ],
    applications: [
      '道路和高速公路',
      '停车场',
      '工业区域',
      '商业设施',
      '住宅区'
    ],
    specifications: {
      '材料': '高强度球墨铸铁',
      '负载等级': 'C250至F900',
      '宽度': '100毫米至300毫米',
      '长度': '500毫米至1000毫米（标准段）',
      '标准': 'EN 1433'
    }
  },
  'elbow-fitting': {
    id: 'elbow-fitting',
    title: '90°弯头管件',
    description: '高品质90°弯头管件，用于聚乙烯管道系统中改变管道方向，提供紧密连接和最小流量阻力。',
    image: elbow90,
    category: 'fittings',
    features: [
      '耐冲击',
      '简单安装',
      '卓越的密封性能',
      '耐压能力强',
      '腐蚀和化学品抵抗力'
    ],
    applications: [
      '供水系统',
      '污水处理',
      '灌溉系统',
      '工业管道'
    ],
    specifications: {
      '材料': '高密度聚乙烯（HDPE）',
      '直径范围': '20毫米至800毫米',
      '压力等级': 'PN10至PN16',
      '连接类型': '电熔、对接焊接或机械连接',
      '适用标准': 'ISO 4427, EN 12201'
    }
  },
  'elbow-45-fitting': {
    id: 'elbow-45-fitting',
    title: '45°弯头管件',
    description: '精密设计的45°弯头管件，为聚乙烯管道系统提供柔和过渡，减少压力损失和湍流。',
    image: elbow45,
    category: 'fittings',
    features: [
      '流线型设计',
      '减少压力损失',
      '预防湍流',
      '易于安装',
      '长期密封性能'
    ],
    applications: [
      '供水管道',
      '排水系统',
      '土木工程项目',
      '灌溉基础设施'
    ],
    specifications: {
      '材料': '高密度聚乙烯（HDPE）',
      '直径范围': '20毫米至630毫米',
      '压力等级': 'PN10至PN16',
      '角度': '45度',
      '制造工艺': '注塑成型'
    }
  },
  'tee-fitting': {
    id: 'tee-fitting',
    title: 'T型管件',
    description: '高品质T型管件，用于创建管道分支，确保系统的完整性和可靠的流体分配。',
    image: equalTee,
    category: 'fittings',
    features: [
      '均匀流体分配',
      '高抗压强度',
      '抗紫外线',
      '可靠密封',
      '耐化学腐蚀'
    ],
    applications: [
      '市政供水系统',
      '灌溉网络',
      '工业管道',
      '地下公用设施'
    ],
    specifications: {
      '材料': '高密度聚乙烯（HDPE）',
      '直径范围': '20毫米至500毫米',
      '压力等级': 'PN10至PN16',
      '类型': '等径或异径',
      '连接方式': '电熔或热熔'
    }
  },
  'flange-adapter': {
    id: 'flange-adapter',
    title: '法兰适配器',
    description: '专业设计的法兰适配器，用于连接聚乙烯管道和法兰组件，确保安全和可靠的连接。',
    image: flangeAdapterShort,
    category: 'fittings',
    features: [
      '强力密封性能',
      '耐压能力强',
      '简易安装',
      '防泄漏设计',
      '适用性广泛'
    ],
    applications: [
      '水资源处理',
      '泵站',
      '阀门连接',
      '废水系统'
    ],
    specifications: {
      '材料': '高密度聚乙烯（HDPE）+ 钢',
      '直径范围': '20毫米至630毫米',
      '法兰标准': 'DIN / ANSI / GOST',
      '压力等级': 'PN10, PN16, PN25',
      '连接类型': '焊接/螺栓连接'
    }
  },
  'hsaw-water-pipes': {
    id: 'hsaw-water-pipes',
    title: 'HSAW水管',
    description: '螺旋埋弧焊接钢管，专为水资源传输和分配系统提供可靠性能和耐用性。',
    image: hsawPilesWater,
    category: 'steel',
    features: [
      '优异的结构强度',
      '耐腐蚀处理',
      '大直径可用',
      '高压应用',
      '长使用寿命'
    ],
    applications: [
      '市政供水',
      '水资源管理',
      '工业水系统',
      '灌溉基础设施'
    ],
    specifications: {
      '材料': '碳钢（S235JR/S275JR/S355JR）',
      '直径范围': '300毫米至3000毫米',
      '壁厚': '5毫米至25毫米',
      '涂层': '环氧树脂/聚乙烯/水泥砂浆',
      '标准': 'EN 10224, AWWA C200'
    }
  },
  'gate-valve': {
    id: 'gate-valve',
    title: '闸阀',
    description: '铸铁闸阀，用于控制管道中流体的流动，提供可靠的截断功能和长期使用寿命。',
    image: gateValve,
    category: 'cast-iron',
    features: [
      '全通径设计',
      '低阻力流动',
      '双向密封',
      '手轮操作方便',
      '工业级铸铁材质'
    ],
    applications: [
      '市政供水',
      '工业流体控制',
      '消防系统',
      '灌溉网络'
    ],
    specifications: {
      '材料': '铸铁主体，黄铜/不锈钢内部部件',
      '直径范围': 'DN50至DN500',
      '压力等级': 'PN10至PN16',
      '控制类型': '手动轮',
      '连接类型': '法兰连接（EN 1092-2）'
    }
  },
  'ground-fire-hydrant': {
    id: 'ground-fire-hydrant',
    title: '地上式消防栓',
    description: '高可靠性地上式消防栓，提供紧急消防用水，确保关键时刻的安全响应。',
    image: groundFireHydrant,
    category: 'cast-iron',
    features: [
      '高流量设计',
      '防冻结构',
      '坚固耐用材质',
      '快速连接接口',
      '符合消防标准'
    ],
    applications: [
      '城市消防系统',
      '商业区域',
      '住宅社区',
      '工业园区'
    ],
    specifications: {
      '材料': '铸铁主体，不锈钢内部组件',
      '工作压力': '1.0 MPa至1.6 MPa',
      '阀门数量': '2个或更多出水口',
      '高度': '标准型（750-900毫米）',
      '标准': 'EN 14384, GOST 8220'
    }
  },
  'rainwater-grill-d400-standard': {
    id: 'rainwater-grill-d400-standard',
    title: 'D400排水格栅标准型',
    description: '专为重型交通区域设计的D400级排水格栅，提供卓越的排水能力和耐用性。',
    image: rainwaterGrillD400,
    category: 'cast-iron',
    features: [
      'D400承载等级（40吨）',
      '抗滑设计',
      '耐腐蚀铸铁材质',
      '符合EN124标准',
      '安装简便'
    ],
    applications: [
      '城市道路',
      '工业区域',
      '停车场',
      '商业区域'
    ],
    specifications: {
      '材料': '球墨铸铁 GGG50/GJS-500-7',
      '标准': 'EN 124',
      '承载等级': 'D400（40吨）',
      '尺寸': '500 x 500毫米（标准尺寸）',
      '表面处理': '黑色沥青涂层'
    }
  },
  'rainwater-grill-d400-type2': {
    id: 'rainwater-grill-d400-type2',
    title: 'D400排水格栅强化型',
    description: '加强型D400级排水格栅，为高交通流量区域提供更强的耐用性和可靠性。',
    image: rainwaterGrillD4002,
    category: 'cast-iron',
    features: [
      '加强型框架设计',
      '铰链式开启机制',
      '防盗锁定系统',
      '耐用铸铁结构',
      '抗振动性能'
    ],
    applications: [
      '高速公路',
      '港口区域',
      '工业园区',
      '物流中心'
    ],
    specifications: {
      '材料': '球墨铸铁 GGG50/GJS-500-7',
      '标准': 'EN 124',
      '承载等级': 'D400（40吨）',
      '尺寸': '600 x 600毫米',
      '开口面积': '大于30%的总面积'
    }
  },
  'rainwater-grill-meria': {
    id: 'rainwater-grill-meria',
    title: 'MERIA系列排水格栅',
    description: 'MERIA系列高性能排水格栅，结合现代设计与卓越功能，适用于城市环境。',
    image: rainwaterGrillMeria,
    category: 'cast-iron',
    features: [
      '现代化外观设计',
      '优化的水流能力',
      '防堵塞构造',
      '多种尺寸可选',
      '减噪设计'
    ],
    applications: [
      '城市广场',
      '商业步行街',
      '住宅区',
      '公共建筑周边'
    ],
    specifications: {
      '材料': '球墨铸铁 GGG50/GJS-500-7',
      '标准': 'EN 124',
      '承载等级': 'D400（40吨）',
      '尺寸': '可定制',
      '表面处理': '黑色沥青或电镀'
    }
  },
  'rainwater-grill-f900': {
    id: 'rainwater-grill-f900',
    title: 'F900超重型排水格栅',
    description: 'F900级超重型排水格栅，专为极端负载环境设计，提供最高等级的承重能力。',
    image: rainwaterGrillF900,
    category: 'cast-iron',
    features: [
      'F900承载等级（90吨）',
      '加强型框架和格栅',
      '特殊合金铸铁',
      '防松动锁定系统',
      '耐极端条件'
    ],
    applications: [
      '机场跑道',
      '港口码头',
      '重工业区',
      '物流转运中心'
    ],
    specifications: {
      '材料': '特殊高强度球墨铸铁',
      '标准': 'EN 124',
      '承载等级': 'F900（90吨）',
      '表面处理': '特殊防腐涂层',
      '重量': '50-80千克（根据尺寸）'
    }
  },
  'waste-box': {
    id: 'waste-box',
    title: '废物收集箱',
    description: '耐用城市废物收集箱，适用于公共空间，提供卫生的废物管理解决方案。',
    image: wasteBox,
    category: 'Urban Infrastructure',
    features: [
      '防风雨设计',
      '易清洁表面',
      '防腐蚀材料',
      '符合人体工程学',
      '可锁定防盗'
    ],
    applications: [
      '公园和休闲区',
      '城市街道',
      '商业区域',
      '公共广场',
      '交通枢纽'
    ],
    specifications: {
      '材料': '高密度聚乙烯或耐候钢',
      '容量': '30-100升',
      '尺寸': '根据容量变化',
      '安装方式': '地面固定或独立式',
      '颜色': '多种选择（标准灰色，绿色，蓝色）'
    }
  },
  'pile-pipes': {
    id: 'pile-pipes',
    title: '桩用钢管',
    description: '专为地基和桩基工程设计的高强度螺旋埋弧焊接钢管，提供卓越的承载能力和耐久性。',
    image: hsawPilesPurpose,
    category: 'steel',
    features: [
      '超高强度设计',
      '精密焊接工艺',
      '抗腐蚀处理',
      '符合结构工程标准',
      '多种规格可选'
    ],
    applications: [
      '桥梁基础',
      '高层建筑地基',
      '海岸和港口结构',
      '工业厂房基础'
    ],
    specifications: {
      '材料': '高强度结构钢 S355JR/S420',
      '直径范围': '300毫米至2000毫米',
      '壁厚': '8毫米至40毫米',
      '长度': '根据项目要求定制',
      '焊接类型': '螺旋埋弧焊（HSAW）'
    }
  },
  'aluminum': {
    id: 'aluminum',
    title: '铝制品',
    description: '高品质铝制品，适用于各种工业和商业应用，集轻量和高强度于一体。',
    image: uProfiles,
    category: 'aluminum',
    features: [
      '轻量化高强度',
      '出色的耐腐蚀性',
      '多样化的产品系列',
      '环保可回收材料',
      '高精度加工'
    ],
    applications: [
      '建筑行业',
      '交通运输',
      '工业应用',
      '建筑装饰'
    ]
  },
  'polyethylene': {
    id: 'polyethylene',
    title: '聚乙烯制品',
    description: '多功能聚乙烯产品，提供卓越的耐久性和灵活性，适用于广泛的基础设施应用。',
    image: hdpePipes,
    category: 'polyethylene',
    features: [
      '卓越的耐化学性',
      '使用寿命长',
      '安装和维护成本低',
      '环保可持续'
    ],
    applications: [
      '供水系统',
      '污水管网',
      '天然气分配',
      '工业应用'
    ]
  },
  'steel': {
    id: 'steel',
    title: '钢铁产品',
    description: '高强度钢铁产品，为要求苛刻的基础设施项目提供可靠的结构解决方案。',
    image: steelPipesOilGas,
    category: 'steel',
    features: [
      '超高强度材料',
      '多种规格尺寸',
      '优异的承载能力',
      '符合国际标准'
    ],
    applications: [
      '输油输气',
      '水资源管理',
      '建筑地基',
      '海洋工程'
    ]
  },
  'cast-iron': {
    id: 'cast-iron',
    title: '铸铁产品',
    description: '耐用的铸铁产品，为城市基础设施和公共设施提供长期可靠的解决方案。',
    image: manholeD400,
    category: 'cast-iron',
    features: [
      '极高的承载能力',
      '卓越的耐磨性',
      '耐候性和耐腐蚀性',
      '符合城市美观要求'
    ],
    applications: [
      '城市道路设施',
      '排水系统',
      '公用设施接入',
      '城市美化'
    ]
  },
  'fittings': {
    id: 'fittings',
    title: '管道配件',
    description: '全系列高质量管道配件，用于连接、改变方向和控制各种管道系统。',
    image: elbow90,
    category: 'fittings',
    features: [
      '高精度制造',
      '可靠密封性能',
      '多种连接方式',
      '适用于不同管道材质'
    ],
    applications: [
      '市政供水',
      '工业流体运输',
      '污水处理',
      '灌溉系统'
    ]
  },
  'urban-infrastructure': {
    id: 'urban-infrastructure',
    title: '城市基础设施',
    description: '综合城市基础设施解决方案，包括雨水管理、道路附属设施和公共空间元素。',
    image: wasteBox,
    category: 'Urban Infrastructure',
    features: [
      '现代化设计',
      '耐用耐候材料',
      '易于安装维护',
      '符合城市规划要求'
    ],
    applications: [
      '城市街道',
      '公共广场',
      '商业区域',
      '住宅社区'
    ]
  }
};

export default zhCNProductDetailsMap;