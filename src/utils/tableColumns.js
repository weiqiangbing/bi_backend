export const tableColumns = [
  // {prop: 'id', label: 'ID', noRepeat: true},
  {
    prop: 'timeline',
    label: '时间',
    width: '120'
  },
  {
    prop: 'hour',
    label: '小时',
    placeholder: '小时'
  },
  {
    prop: 'site_id',
    label: '站点',
    placeholder: '站点的名称'
  },
  {
    prop: 'platform',
    label: '平台',
    placeholder: '所属平台'
  },
  { 
    prop: 'section_id',
    label: '频道',
    placeholder:'小说所属频道'
  },
  {
    prop: 'tj_page',
    label: '所在页面'
  },
  {
    prop: 'tj_pos',
    label: '推荐位'
  },
  {
    prop: 'date',
    label: '日期'
  },
  {
    prop: 'recharge_item',
    label: '充值项'
  },
  {
    prop: 'book_id',
    label: '书籍ID',
  },
  {
    prop: 'book_name',
    label: '书籍名称'
  },
  {
    prop: 'chapter_id',
    label: '章节ID'
  },
  {
    prop: 'chapter_code',
    label: '章节序号'
  },
  {
    prop: 'chapter_title',
    label: '章节标题'
  },
  {
    prop: 'author_name',
    label: '作者',
    placeholder: '作者姓名'
  },
  {
    prop: 'outsite',
    label: '版权渠道',
    placeholder:'小说版权渠道'
  },
  {
    prop: 'class_id',
    label: '分类',
    placeholder:'小说所属分类'
  },
  {
    prop: 'user_id',
    label: '用户ID'
  },
  {
    prop: 'entire_pv',
    label: '总pv',
    placeholder: '总pv的值'
  },
  {
    prop: 'entire_uv',
    label: '总uv',
    placeholder: '总uv的值'
  },
  {
    prop: 'entire_cost_user',
    label: '总订阅用户',
    isNum: true
  },
  {
    prop: 'entire_cost_total',
    label: '总消费',
    isNum: true
  },
  {
    prop: 'entire_bookshelf',
    label: '总收藏',
    isNum: true
  },
  {
    prop: 'pv',
    label: 'PV',
    placeholder: 'PV的值',
    isNum: true,
  },
  {
    prop: 'uv',
    label: 'UV',
    placeholder: 'UV的值',
    isNum: true
  },
  {
    prop: 'users',
    label: '阅读用户',
    placeholder: '本条数据的阅读用户',
    isNum: true
  },
  // {
  //   prop: 'vip_users',
  //   label: '消费数'
  // },
  {
    prop: 'cost_total',
    label: '订阅小说币+豆',
    isNum: true
  },
  {
    prop: 'cost_coin',
    label: '订阅小说币',
    isNum: true
  },
  {
    prop: 'cost_chapters',
    label: '消费章节数(币+豆)',
    isNum: true
  },
  {
    prop: 'cost_coin_chapters',
    label: '消费章节数(币)',
    isNum: true
  },
  {
    prop: 'cost_coin_user',
    label: '付费用户数(币)',
    isNum: true
  },
  {
    prop: 'new_read_users',
    label: '新增阅读用户',
    isNum: true
  },
  {
    prop: 'new_order_users',
    label: '新增充值用户',
    isNum: true
  },
  {
    prop: 'new_cost_users',
    label: '新增订阅用户',
    isNum: true
  },

  {
    prop: 'bookshelf',
    label: '收藏',
    isNum: true,
    placeholder: '加入书架数量'
  },
  {
    prop: 'recommend',
    label: '推荐',
    isNum: true,
    placeholder: '被推荐次数'
  },
  {
    prop: 'vote',
    label: '点赞',
    isNum: true,
    placeholder: '点赞数'
  },
  {
    prop: 'comment',
    label: '评论',
    isNum: true,
    placeholder: '评论数'
  },
  {
    prop: 'share',
    label: '分享',
    isNum: true,
    placeholder: '分享数'
  },
  {
    prop: 'reward',
    label: '打赏次数',
    isNum: true
  },
  {
    prop: 'activity',
    label: '活动次数',
    isNum: true
  },
  {
    prop: 'order_num',
    label: '下单次数',
    isNum: true
  },
  {
    prop: 'pay_money',
    label: '充值金额',
    isNum: true
  },
  {
    prop: 'user_num',
    label: '充值用户数',
    isNum: true
  },
  {
    prop: 'pay_num',
    label: '充值次数',
    isNum: true
  },
  {
    prop: 'daa_cost',
    label: '花费金额',
    isNum: true,
  },
  {
    prop: 'daa_show_users',
    label: '覆盖人数',
    isNum: true,
  },
  {
    prop: 'daa_show_times',
    label: '展示次数',
    isNum: true,
  },
  {
    prop: 'daa_hits',
    label: '点击量',
    isNum: true,
  },
  {
    prop: 'daa_install_users',
    label: '安装人数',
    isNum: true,
  },
  {
    prop: 'uninstalled',
    label: '安装单价',
    isNum: true
  },
  {
    prop: 'new_user',
    label: '新注册人数',
    isNum: true
  },
  {
    prop: 'reg_date',
    label: '注册日期',
    isNum: true,
  },
  {
    prop: 'order_user',
    label: '新增充值用户数',
    isNum: true,
  },
  {
    prop: 'total_order_money',
    label: '新增充值金额',
    isNum: true,
  },
  {
    prop: 'order_money',
    label: '新增充值金额',
    isNum: true,
  },
  {
    prop: 'reg_days',
    label: '回本周期/预计回本周期',
    isNum: true,
  },
  {
    prop: 'live_user',
    label: '日活',
    isNum: true
  },
  // {
  //   prop: 'daily_live_user',
  //   label: '日活',
  //   isNum: true
  // },
  {
    prop: 'pay_daily_user',
    label: '付费日活',
    isNum: true
  },
  {
    prop: 'monthly_live_user',
    label: '月活',
    isNum: true
  },
  {
    prop: 'monthly_pay_user',
    label: '付费月活',
    isNum: true
  },
  {
    prop: 'daa_pay_users',
    label: '总充值人数',
    isNum: true,
  },
  {
    prop: 'daa_pay_times',
    label: '总充值次数',
    isNum: true,
  },
  {
    prop: 'daa_pay',
    label: '总充值金额',
    isNum: true,
  },
  // {
  //   prop: 'plan_reg_days',
  //   label: '预计回本天数',
  //   isNum: true,
  // },  
  {
    prop: 'order_date',
    label: '充值日期',
    isNum: true,
  },
  {
    prop: 'fuel_money',
    label: '月卡金额',
    isNum: true
  },
  {
    prop: 'fuel_user',
    label: '月卡人数',
    isNum: true
  },
  {
    prop: 'year_money',
    label: '包年金额',
    isNum: true
  },
  {
    prop: 'year_user',
    label: '包年人数',
    isNum: true
  },
  {
    prop: 'discount_money',
    label: '打折卡金额',
    isNum: true
  },
  {
    prop: 'discount_user',
    label: '打折卡人数',
    isNum: true
  },
  {
    prop: 'diamand_money',
    label: '钻石会员金额',
    isNum: true
  },
  {
    prop: 'diamand_user',
    label: '钻石会员人数',
    isNum: true
  },
  {
    prop: 'pay_channel',
    label: '充值渠道'
  },
  {
    prop: 'pay_channel_tag',
    label: '充值渠道财务标识'
  },
  {
    prop: 'currency',
    label: '货币单位',
    placeholder: '充值渠道货币'
  },
  {
    prop: 'chapters_total',
    label: '消费章节数(币+豆)',
    isNum: true
  },
  {
    prop: 'coin_chapters',
    label: '币订阅的章节数',
    isNum: true
  },

  {
    prop: 'install_num',
    label: '安装数量',
    isNum: true
  },
  {
    prop: 'install_univalence',
    label: '安装单价',
    isNum: true
  },
  {
    prop: 'recharge_money',
    label: '充值金额',
    isNum: true
  },
  {
    prop: 'recharge_user',
    label: '充值人数',
    isNum: true
  },
  {
    prop: 'start_time',
    label: '开始时间'
  },
  {
    prop: 'end_time',
    label: '结束时间'
  },
  {
    prop: 'fc',
    label: '推广数',
    isNum: true
  },
  {
    prop: 'event_type',
    label: '推广'
  },
  {
    prop: 'start_uv',
    label: '起始日期UV',
    isNum: true
  },
  {
    prop: 'uv_incr',
    label: 'uv增量',
    isNum: true
  },
  {
    prop: 'app_channel',
    label: '发送渠道'
  },
  {
    prop: 'status',
    label: '推送状态'
  },
  {
    prop: 'add_time',
    label: '添加任务时间',
    width: '100px'
  },
  {
    prop: 'complete_time',
    label: '执行任务时间',
    width: '100px'
  },
  {
    prop: 'send_time',
    label: '发送时间',
    width: '100px'
  },
  {
    prop: 'send_type',
    label: '发送类型'
  },
  {
    prop: 'send_model',
    label: '发送模式'
  },
  {
    prop: 'site_code',
    label: '站点'
  },
  {
    prop: 'topic',
    label: '推送对象'
  },
  {
    prop: 'book_prev_five_const',
    label: '推送前五天书籍消费魔币',
    isNum: true
  },
  {
    prop: 'book_prev_five_premium',
    label: '推送前五天书籍消费魔豆',
    isNum: true
  },
  {
    prop: 'book_prev_five_num',
    label: '推送前五天书籍订阅人数',
    isNum: true
  },
  {
    prop: 'book_next_five_const',
    label: '推送后五天书籍消费魔币',
    isNum: true
  },
  {
    prop: 'book_next_five_premium',
    label: '推送后五天书籍消费魔豆',
    isNum: true
  },
  {
    prop: 'book_next_five_num',
    label: '推送后五天书籍订阅人数',
    isNum: true
  },
  {
    prop: 'book_prev_five_pv',
    label: '推送前五天pv',
    isNum: true
  },
  {
    prop: 'book_prev_five_uv',
    label: '推送前五天uv',
    isNum: true
  },
  {
    prop: 'book_next_five_pv',
    label: '推送后五天pv',
    isNum: true
  },
  {
    prop: 'book_next_five_uv',
    label: '推送后五天uv',
    isNum: true
  },

  {
    prop: 'event_id',
    label: '活动ID'
  },
  {
    prop: 'event_name',
    label: '活动名称'
  },
  {
    prop: 'event_status',
    label: '活动状态'
  },
  {
    prop: 'active_time',
    label: '活动开始时间'
  },
  {
    prop: 'magic_bean_num',
    label: '魔豆领取数量',
    isNum: true
  },
  {
    prop: 'receive_num',
    label: '领取数量',
    isNum: true
  },
  {
    prop: 'usage_num',
    label: '使用数量',
    isNum: true
  },
  {
    prop: 'run_out_num',
    label: '用完数量',
    isNum: true
  },
  {
    prop: 'sub_cost_coin_sum',
    label: '订阅魔币总数',
    isNum: true
  },
  {
    prop: 'usage_rate',
    label: '使用率'
  },
  {
    prop: 'run_out_rate',
    label: '用完率'
  },
  {
    prop: 'conversion_rates',
    label: '订阅率'
  },
  {
    prop: 'fee_sum',
    label: '充值金额',
    isNum: true
  },
  {
    prop: 'coin_sum',
    label: '充值币数量',
    isNum: true
  },
  {
    prop: 'topup_num',
    label: '充值次数',
    isNum: true
  },
  {
    prop: 'proportion',
    label: '充值项金额占比'
  },  
  {
    prop: 'keyword',
    label: '关键词名称'
  },  
  {
    prop: 'searches_number',
    label: '关键词搜索次数',
    isNum: true
  },  
  {
    prop: 'average_cost_user',
    label: '当日均订用户数量',
    isNum: true
  },
  {
    prop: 'all_cost_user',
    label: '当日全订用户数量',
    isNum: true
  },  
  {
    prop: 'high_cost_user',
    label: '当日高订用户数量',
    isNum: true
  },
  {
    prop: 'daa_channel',
    label: '渠道',
  },
  {
    prop: 'daa_account_name',
    label: '账号',
  },
  {
    prop: 'daa_series',
    label: '广告',
  },
  {
    prop: 'click_an_rate',
    label: '点击率%',
  },
  {
    prop: 'InconsistentReturn',
    label: '回报%',
  },
  {
    prop: 'daa_editor',
    label: '推广人',
  },
  {
    prop: 'cost_user',
    label: '订阅用户',
    isNum: true
  },

  {
    prop: 'free_follow_rate',
    label: '免费跟读率',
  },
  {
    prop: 'vip_rate',
    label: '付费转化',
  },
  {
    prop: 'hundred_follow_rate',
    label: '100章跟读',
  },
  {
    prop: 'two_hundred_follow_rate',
    label: '200章跟读',
  },
  {
    prop: 'five_hundred_follow_rate',
    label: '500章跟读',
  },
  {
    prop: 'end_follow_rate',
    label: '末章跟读',
  },
  {
    prop: 'user_id_count',
    label: '用户人数',
    isNum: true
  },
  {
    prop: 'book_id_count',
    label: '作品数',
    placeholder: '本条数据的作品数',
    isNum: true
  },
  {
    prop: 'ltv',
    label: 'LTV'
  }
]
