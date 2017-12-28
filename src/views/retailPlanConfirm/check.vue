<template>
  <bm-layout>
    <header class="m_header" slot="header" ref="header">
      <!-- header -->
      <bm-header>
        <span>计划详情</span>
        <template v-if="beyond">
          <template v-if="editing">
            <button class="btn" slot="right" v-if="!edited && (status === 'confirmed' || status === 'reconfirmed')" @click="doCancelConfirm">取消重新确认</button>
            <button class="btn" slot="right" v-if="!edited && status === 'unconfirmed'" @click="doCancelConfirm">取消确认</button>
          </template>
          <template v-else>
            <button class="btn" slot="right" v-if="(status === 'confirmed' || status === 'reconfirmed')" @click="editing = true">重新确认</button>
            <button class="btn" slot="right" v-if="status === 'unconfirmed'" @click="editing = true">确认计划</button>
          </template>
        </template>
      </bm-header>
      <!-- 第一行！ -->
      <div class="c_block overview">
        <div class="first" v-if="editing ? !!user : !!status">
          <p class="c_line-left name">{{ user }}</p>
          <p class="status" v-if="!editing">{{ status ? getStatusName(status) || '' : '' }}</p>
        </div>
        <div class="second">
          <div class="c_line-left">
            <template v-if="!editing && type === 'VALID_PLAN'">{{ date | datetime('YYYY / MM / DD ddd') }}，上班</template>
            <template v-else-if="!editing && type === 'TODAY_REST'">{{ date | datetime('YYYY / MM / DD ddd') }}，休息</template>
            <template v-else>{{ date | datetime('YYYY / MM / DD ddd') }}</template>
          </div>
          <div v-if="editing">
            <button class="type" :class="{ 'type-actived': type === 'VALID_PLAN' }" @click="doSwitchType('VALID_PLAN')">上班</button>
            <button class="type" :class="{ 'type-actived': type === 'TODAY_REST' }" @click="doSwitchType('TODAY_REST')">休息</button>
          </div>
        </div>
      </div>
      <!-- 计划tabs们 -->
      <div class="c_block plans" v-show="plans.length > 0 && type === 'VALID_PLAN'">
        <button class="tab" :class="{ 'active': activedIndex === index - 1 }" v-for="index in plans.length" @click="doChangeIndex(index - 1)">
          <span class="tab-text"><span>计划{{ index }}</span><i class="del" @click.stop="doDelPlan" v-if="plansDeletable && activedIndex === index - 1 && (activedPlan.id ? plansHaveTwoMoreId : true)"></i></span>
        </button>
        <button class="tab" v-if="editing" @click="doNewPlan"><span class="tab-text">+新增</span></button>
      </div>
    </header>
    <section class="m_main" ref="scroller">
      <!-- 有计划 -->
      <div class="m_plans-wrap" v-if="type === 'VALID_PLAN'">
        <div class="m_plans" v-for="(plan, index) of plans" v-show="index === activedIndex">
          <!-- 编辑状态 -->
          <div key="key_edit" v-if="editing">
            <!-- 计划tab下的第一个大块 -->
            <div class="c_block m_plans-overview">
              <div class="c_line2 c_line-with-select">
                <span class="c_line-left">上班点类型</span>
                <span>
                  <!-- <label class="c_select-btn type" v-for="item of dutyTypeSortedDict">
                    <input class="c_select-btn-ctrl" type="radio" :value="item.code" v-model="plan.dutyType">
                    <span class="c_select-btn-text">{{ item.name }}</span>
                  </label> -->
                  <button class="c_btn" @click="doSwitchDutyType(item.code)" :class="{ 'c_btn-actived': plan.dutyType === item.code }" v-for="item of dutyTypeSortedDict">{{ item.name }}</button>
                </span>
              </div>
              <div class="c_line2 store" v-if="plan.dutyType === 'L001'">
                <span class="c_line-left">门店</span>
                <button class="c_right strong" @click="doSelectStore">{{ plan.dutyStore || '请选择' }}</button>
              </div>
              <div class="shifts" v-if="plan.dutyType === 'L001'">
                <label class="c_select-btn shift" v-for="item of dutyStoreShiftSortedDict">
                  <input class="c_select-btn-ctrl" :value="item.code" v-model="plan.dutyStoreShift" type="radio">
                  <span class="c_select-btn-text">{{ item.name }}</span>
                </label>
              </div>
              <div class="c_line2" v-if="plan.dutyType === 'L011'">
                <span class="c_line-left">办公点</span>
                <button class="c_right strong" @click="doSelectOffice">{{ plan.dutyOffice || '请选择' }}</button>
              </div>
              <div class="c_line2" v-if="plan.dutyType === 'L099'">
                <span class="c_line-left">上班省市区</span>
                <button class="c_right loc strong" @click="openRegion(plan)">{{ getOtherLoc(plan) || '请选择' }}</button>
              </div>
              <div class="c_line2 addr" v-if="plan.dutyType === 'L099'">
                <span class="c_line-left">详细地址</span>
                <div class="c_textarea">
                  <textarea class="c_textarea-ctrl" placeholder="请输入" v-model="plan.dutyOtherAddr"></textarea>
                  <div class="c_textarea-placeholder">{{ plan.dutyOtherAddr || '&emsp;&emsp;&emsp;' }}</div>
                </div>
              </div>
              <div class="c_line2" :class="{ 'times-with-shifts': plan.dutyType === 'L001' }">
                <span class="c_line-left">时间</span>
                <div class="c_right strong time-box">
                  <div class="time-label">
                    <button class="time" @click="doOpenPicker('Start')">{{ getHrAndMin((plan.dutyStart || plan.dutyStart === 0) ? plan.dutyStart : '开始') }}</button>
                    <span>-</span>
                    <button class="time" @click="doOpenPicker('End')">{{ getHrAndMin((plan.dutyEnd || plan.dutyEnd === 0) ? plan.dutyEnd : '结束') }}</button>
                  </div>
                  <div class="time-label" v-if="plan.dutyStoreShift === 'Z005'">
                    <button class="time" @click="doOpenPicker('Start2')">{{ getHrAndMin((plan.dutyStart2 || plan.dutyStart2 === 0) ? plan.dutyStart2 : '开始') }}</button>
                    <span>-</span>
                    <button class="time" @click="doOpenPicker('End2')">{{ getHrAndMin((plan.dutyEnd2 || plan.dutyEnd2 === 0) ? plan.dutyEnd2 : '结束') }}</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 第二个大块：工作任务 -->
            <div class="c_block m_plans-mission" v-if="plan.dutyType">
              <div class="c_line1 line">
                <p class="c_line-left title">工作任务</p>
                <div class="labels">
                  <label class="c_select-btn" v-for="item of dutyTypeWithMissionsDict[plan.dutyType] || []">
                    <input class="c_select-btn-ctrl" type="checkbox" :value="item.code" v-model="plan.dutyMission">
                    <span class="c_select-btn-text">{{ item.name }}</span>
                  </label>
                </div>
              </div>
            </div>
            <!-- 第三个大块：门店产品 -->
            <div class="c_block m_plans-store-detail" v-if="plan.dutyType === 'L001'">
              <!-- <div class="c_line1 overview" v-if="index === activedIndex" v-fixed="{ scroller: $refs.scroller, target: $refs.header, id: `editing_fixed_${index}` }"> -->
              <div class="c_line1 overview" v-if="index === activedIndex">
                <div class="info-wrap">
                  <p>总金额：¥{{ getStoreTotal(plan) | money }}</p>
                  <p>总支数：{{ +getStoreAmounts(plan) || 0 }}</p>
                </div>
                <span>品种数：{{ plan.dutyStoreProducts.length + plan.dutyStoreProductsDefault.length }}</span>
              </div>
              <div class="c_line1 products" v-if="plan.dutyStoreProducts.length || plan.dutyStoreProductsDefault.length">
                <div class="c_line2 item" v-for="item of plan.dutyStoreProductsDefault">
                  <h3 class="title">{{ item.name }}</h3>
                  <div class="count">
                    <div class="ctrl">
                      <span>支数：</span>
                      <div class="ctrl-main">
                        <button class="btn" @click="doChangeProductCount(item, item.count - 1)">-</button>
                        <input class="input" type="tel" v-model.lazy="item.count" @change="doChangeProductCount(item, item.count)">
                        <button class="btn" @click="doChangeProductCount(item, item.count + 1)">+</button>
                      </div>
                    </div>
                    <span>￥{{ item.price * item.count | money }}</span>
                  </div>
                </div>
                <div class="c_line2 item" v-for="item of plan.dutyStoreProducts">
                  <h3 class="title">{{ item.name }}</h3>
                  <div class="count">
                    <div class="ctrl">
                      <span>支数：</span>
                      <div class="ctrl-main">
                        <button class="btn" @click="doChangeProductCount(item, item.count - 1)">-</button>
                        <input class="input" type="tel" v-model="item.count" @change="doChangeProductCount(item, item.count)">
                        <button class="btn" @click="doChangeProductCount(item, item.count + 1)">+</button>
                      </div>
                    </div>
                    <span>￥{{ item.price * item.count | money }}</span>
                  </div>
                </div>
              </div>
              <div class="c_line1 add" :class="{ 'add-empty': !plan.dutyStoreProducts.length && !plan.dutyStoreProductsDefault.length }">
                <button class="add-btn" @click="doAddProduct">添加产品</button>
              </div>
            </div>
            <!-- 第三个大块：计划输出成果 -->
            <div class="c_block m_plans-output" v-if="plan.dutyType && plan.dutyType !== 'L001'">
              <p class="title">计划输出成果</p>
              <textarea class="textarea" v-model="plan.output" maxlength="500" placeholder="请输入，最多500字。"></textarea>
            </div>
          </div>
          <!-- 预览状态 -->
          <div key="key_preview" v-else>
            <div class="c_block m_detail-overview">
              <div class="c_line2 line store">{{ plan.dutyStore || plan.dutyOffice }}</div>
              <div class="c_line2 line time">
                <template v-if="plan.dutyStoreShift">
                  <!-- 只有早晚班的情况才有两段时间 -->
                  <template v-if="typeof plan.dutyStart2 === 'number' || typeof plan.dutyEnd2 === 'number'">{{ getStoreShift(plan) }}：{{ plan.dutyStart | datetime('HH:mm') }}-{{ plan.dutyEnd | datetime('HH:mm') }}{{ plan.dutyStart2 | datetime('HH:mm') }}-{{ plan.dutyEnd2 | datetime('HH:mm') }}</template>
                  <template v-else>{{ getStoreShift(plan) }}：{{ plan.dutyStart | datetime('HH:mm') }}-{{ plan.dutyEnd | datetime('HH:mm') }}</template>
                </template>
                <template v-else>{{ plan.dutyStart | datetime('HH:mm') }}-{{ plan.dutyEnd | datetime('HH:mm') }}</template>
              </div>
              <div class="c_line2 line mission">工作任务：<template v-for="(mission, index) of plan.dutyMission">{{ dutyMissionDict[mission] ? (index !== 0 ? '、' : '') + dutyMissionDict[mission] : '' }}</template></div>
            </div>
            <div class="c_block m_detail-product" v-if="plan.dutyType === 'L001'">
              <!-- <div class="c_line1 overview" v-if="index === activedIndex" v-fixed="{ scroller: $refs.scroller, target: $refs.header, id: `fixed_${index}` }"> -->
              <div class="c_line1 overview" v-if="index === activedIndex">
                <div class="info-wrap">
                  <p>总金额：¥{{ getStoreTotal(plan) | money }}</p>
                  <p>总支数：{{ +getStoreAmounts(plan) || 0 }}</p>
                </div>
                <span>品种数：{{ plan.dutyStoreProducts.length + plan.dutyStoreProductsDefault.length }}</span>
              </div>
              <div class="items">
                <div class="c_line2 item" v-for="item of plan.dutyStoreProducts">
                  <h3 class="name">{{ item.name }}</h3>
                  <div class="data">
                    <span>支数：{{ item.count }}</span>
                    <span>￥{{ item.price * item.count | money }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="c_block m_detail-output" v-if="plan.output">
              <h3 class="title">计划输出成果</h3>
              <p class="opinion">{{ plan.output }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 休息 -->
      <div class="m_rest" v-if="type === 'TODAY_REST' && editing">
        <span class="empty">安排休息了</span>
      </div>
      <!-- 提交意见 -->
      <div class="c_block m_opinion" v-if="!editing && noteOld">
        <h3 class="title">意见说明</h3>
        <p class="opinion">{{ noteOld }}</p>
      </div>
      <div class="c_block m_opinions" v-if="!editing && noteOldList && noteOldList.length">
        <ul>
          <li class="item" v-for="item of noteOldList">
            <span>{{ item.date | datetime('YYYY/MM/DD HH:mm:ss') }} {{ getStatusName(item.status) }}</span>
            <span>{{ item.op }}</span>
          </li>
        </ul>
      </div>
    </section>
    <!-- 底部意见说明提交 -->
    <form class="m_confirm" v-if="editing" slot="bottom" @submit.prevent="doSubmit">
      <div class="input">
        <div class="c_textarea">
          <textarea class="c_textarea-ctrl" v-model="note" placeholder="意见说明填写，字数≤100字" maxlength="100"></textarea>
          <div class="c_textarea-placeholder">{{ note }}</div>
        </div>
      </div>
      <button class="submit" type="submit">提交</button>
    </form>
    <!-- 其他组件，没办法基于bmlayout，只能这么搞 -->
    <div slot="left">
      <mt-datetime-picker ref="picker" type="time" v-model="picker" @confirm="doConfirmPicker" />
      <bm-region ref="region" @outputRegion="doConfirmRegion" />
    </div>
  </bm-layout>
</template>

<script>
  import { getDictObj as ApiGetDict } from '@/api/base'
  import { sfa as Api } from '@/utils/baseRequest'
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import CompSelectStore from '@/views/common/selectStore'
  import CompSelectProduct from '@/views/common/selectProduct'
  import CompSelectOffice from '@/views/common/selectOffice'

  class Plan {
    constructor (res = {}) {
      this.id = res['planId'] || ''
      this.dutyType = res['workPointCode'] || ''
      this.dutyStore = res['workPointCode'] === 'L001' ? res['storeName'] || '' : ''
      this.dutyStoreCode = res['workPointCode'] === 'L001' ? res['storeId'] || '' : ''
      this.dutyStoreShift = res['classId'] || ''
      this.dutyStoreProducts = (function () {
        let arr = []
        for (let item of res['prdList'] || []) {
          arr.push(new Product({
            id: item['prdId'],
            code: item['customerPrd'],
            name: item['prdName'],
            price: item['price'] / 100,
            count: item['prdNum'],
            api_isNew: item['isNew']
          }))
        }
        return arr
      })()
      this.dutyStoreProductsDefault = res.dutyStoreProductsDefault || []
      this.dutyOffice = res['workPointCode'] !== 'L001' ? res['storeName'] || '' : ''
      this.dutyOfficeCode = res['workPointCode'] !== 'L001' ? res['storeId'] || '' : ''
      this.dutyOtherProvince = res['provinceDesc'] || ''
      this.dutyOtherProvinceCode = res['provinceCode'] || ''
      this.dutyOtherCity = res['cityDesc'] || ''
      this.dutyOtherCityCode = res['cityCode'] || ''
      this.dutyOtherCounty = res['countyDesc'] || ''
      this.dutyOtherCountyCode = res['countyCode'] || ''
      this.dutyOtherAddr = res['address'] || ''
      this.dutyStart = (res['planTime'] && res['planTime'][0]) ? res['planTime'][0]['enterTime'] || null : null
      this.dutyStart2 = (res['planTime'] && res['planTime'][1]) ? res['planTime'][1]['enterTime'] || null : null
      this.dutyEnd = (res['planTime'] && res['planTime'][0]) ? res['planTime'][0]['leaveTime'] || null : null
      this.dutyEnd2 = (res['planTime'] && res['planTime'][1]) ? res['planTime'][1]['leaveTime'] || null : null
      this.dutyMission = (function () {
        let arr = []
        for (let item of res['taskList'] || []) {
          arr.push(item['taskId'])
        }
        return arr
      })()
      this.output = res['planResults'] || ''
      this.confirm = res['confirmExplain'] || ''
      this.confirmList = (function () {
        let arr = []
        for (let item of res['confirmLogList'] || []) {
          arr.push(new Confirm({
            date: item['createTime'],
            status: item['planStatus'],
            op: item['createByName']
          }))
        }
        return arr
      })()
    }
  }
  class Product {
    constructor (config = {}) {
      this.id = config.id || ''
      this.code = config.code || ''
      this.name = config.name || ''
      this.price = config.price || 0
      this.count = config.count || 0
      this.api_isNew = config.api_isNew || 0
    }
  }
  class Confirm {
    constructor (config = {}) {
      this.date = config.date || null
      this.status = config.status || ''
      this.op = config.op || ''
    }
  }

  // const TYPE_DICT = {
  //   'NOT_ENTER_STORE': '今日不进店',
  //   'TODAY_REST': '今日休息',
  //   'VALID_PLAN': '有效计划',
  //   'INVALID_PLAN': '无效计划',
  //   'NO_PLAN': '无计划'
  // }
  const STATUS_DICT = {
    'unconfirmed': '待确认',
    'confirmed': '已确认',
    'reconfirmed': '已重新确认'
  }

  export default {
    data () {
      return {
        date: null,
        user: '',
        userCode: '',
        type: '', // TYPE_DICT
        status: '', // STATUS_DICT
        plans: [],
        planCacheJSON: '',
        editing: false, // 编辑页面的关键变量，确认与查看就在一布尔之差
        edited: false,
        activedIndex: null,
        note: '',
        noteOld: '',
        noteOldList: [],
        picker: '',
        pickerTarget: '',
        dutyTypeDict: {},
        dutyTypeSortedDict: [],
        dutyTypeWithMissionsDict: {},
        dutyStoreShiftSortedDict: [],
        dutyMissionDict: {}
      }
    },
    computed: {
      activedPlan () {
        return this.plans[this.activedIndex] || null
      },
      beyond () {
        let today = new Date().setHours(0, 0, 0, 0)
        return this.date >= today
      },
      plansDeletable () {
        return this.editing && this.plans.length > 1
      },
      plansHaveTwoMoreId () {
        let flag = false
        let count = 0
        for (let plan of this.plans || []) {
          if (plan.id) count++
          if (count > 1) {
            flag = true
            break
          }
        }
        return flag
      }
    },
    watch: {
      activedPlan (v) {
        this.setPlanCacheJSON()
        this.doMainScrollToTop()
      },
      editing () {
        this.doMainScrollToTop()
      }
    },
    filters: {
      money (v) {
        let calc = (Math.round(+v * 100) / 100)
        return calc ? calc.toFixed(2) : '0.00'
      }
    },
    directives: {
      fixed: (function () {
        // 方便unbind找回滚动方法并取消绑定，适合于多id的情况
        const FIXED_LIST = {}
        return {
          inserted (el, binding) {
            const SCROLLER = binding.value.scroller
            const ID = binding.value.id
            SCROLLER.style.webkitOverflowScrolling = 'auto'
            FIXED_LIST[ID] = (function () {
              const TARGET = binding.value.target
              const PARENT = el.parentNode
              const BEFORE_WHO = el.nextSibling
              let refer = el
              let hanging = false
              function checker () {
                let top = refer.getBoundingClientRect()['top']
                let targetBottom = TARGET.getBoundingClientRect()['bottom']
                top < targetBottom ? hanger() : backer()
              }
              function hanger () {
                if (!hanging) {
                  hanging = true
                  refer = el.cloneNode(true)
                  let targetDimension = TARGET.getBoundingClientRect()
                  let selfDimension = el.getBoundingClientRect()
                  el.style.top = (+targetDimension.bottom || 0) + 'px'
                  el.style.left = (+selfDimension['left'] || 0) + 'px'
                  el.style.right = (+selfDimension['right'] - selfDimension['width'] || 0) + 'px'
                  PARENT.insertBefore(refer, BEFORE_WHO)
                  el.style.position = 'fixed'
                }
              }
              function backer () {
                if (hanging) {
                  hanging = false
                  PARENT.removeChild(refer)
                  refer = el
                  el.style.position = 'static'
                }
              }
              return { checker, hanger, backer }
            })()
            FIXED_LIST[ID].checker()
            SCROLLER.addEventListener('scroll', FIXED_LIST[ID].checker)
          },
          unbind (el, binding) {
            const SCROLLER = binding.value.scroller
            SCROLLER.style.webkitOverflowScrolling = 'inherit'
            const ID = binding.value.id
            FIXED_LIST[ID].backer()
            SCROLLER.removeEventListener('scroll', FIXED_LIST[ID].checker)
            FIXED_LIST[ID] = null
          }
        }
      })()
    },
    methods: {
      async getFatalParams () {
        // this.date = +(this.$route.query.date || Date.now())
        this.userCode = this.$route.query.code
        this.date = +(new Date(+(this.$route.query.date || Date.now())).setHours(0, 0, 0, 0))
        this.editing = !!this.$route.query.editing
        let dutyTypeDict = {}
        let planTypeDict = await ApiGetDict('workPoint', true)
        let dutyTypeWithMissionsDict = {}
        let shiftTypeDict = await ApiGetDict('CLASS', true)
        let dutyMissionDict = {}
        for (let item of planTypeDict) {
          dutyTypeDict[item.code] = item.name
          dutyTypeWithMissionsDict[item.code] = await ApiGetDict(item.code === 'L001' ? 'task' : item.code, true)
          Object.assign(dutyMissionDict, await ApiGetDict(item.code === 'L001' ? 'task' : item.code))
        }
        this.dutyTypeDict = dutyTypeDict
        this.dutyTypeSortedDict = planTypeDict
        this.dutyTypeWithMissionsDict = dutyTypeWithMissionsDict
        this.dutyStoreShiftSortedDict = shiftTypeDict
        this.dutyMissionDict = dutyMissionDict
        return true
      },
      async doInit () {
        // 检查是否特殊日期人员不能进店或制定计划
        // await Api.post('/plan/isLimitDate', {
        //   'pageFlag': 'PLAN',
        //   'planDate': this.date,
        //   'token': simpleLocalDb.getItem('token')
        // }, {
        //   '_NEED_CODE_0': true,
        //   '_INDICATOR': true
        // })
        // 重复调用时先清掉原来的缓存 GO!
        this.user = ''
        this.type = ''
        this.status = ''
        this.note = ''
        this.noteOld = ''
        this.noteOldList = []
        this.plans = []
        this.activedIndex = null
        // 取详情 GO!
        let { 'validFlag': type, 'itemList': list, 'planStatus': status, 'userName': user } = await Api.post('/planConfirm/getPlanDetailByUser', {
          'planDate': this.date,
          'userCode': this.userCode,
          'token': simpleLocalDb.getItem('token')
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        })
        this.user = user
        this.type = type
        // this.status = status || 'unconfirmed' // 妈的，怎么有时候又不反呢？不反我就认为待确认了啊！！！
        this.status = status || '' // 不给的话，比较有可能的是这是个没计划的详情啊我擦（如果为休息待确认的话这里会传空，后台有bug哈哈哈！）
        // 组装noteOld与noteOldList GO!
        this.noteOld = ''
        this.noteOldList = []
        if (list && list.length) {
          this.noteOld = list[0]['confirmExplain'] || ''
          for (let note of list[0]['confirmLogList'] || []) {
            this.noteOldList.push({
              date: note['createTime'],
              status: note['planStatus'],
              op: note['createByName']
            })
          }
        }
        this.note = this.noteOld || ''
        // 组装plans GO!
        this.plans = []
        for (let item of list || []) {
          this.plans.push(new Plan(item))
        }
        // 如果需要一进入就进入编辑装填，可能要考虑没计划得情况
        if (this.editing && !this.plans.length) this.doNewPlan()
        // 激活第一项计划 GO!
        if (this.plans.length) this.activedIndex = 0
      },
      async doCancelConfirm () {
        this.editing = false
        return await this.doInit()
      },
      setPlanCacheJSON () {
        if (this.activedPlan) {
          try {
            this.planCacheJSON = JSON.stringify(this.activedPlan)
          } catch (error) {}
        }
      },
      doCheckPlanSameAsCache () {
        let now
        try {
          now = JSON.stringify(this.activedPlan)
        } catch (error) {}
        return now === this.planCacheJSON
      },
      getStatusName (status) {
        return STATUS_DICT[status] || ''
      },
      doMainScrollToTop () {
        this.$nextTick(function () {
          let main = this.$refs.scroller
          if (main) main.scrollTop = 0
        }.bind(this))
      },
      async doSwitchType (type) {
        if (type !== this.type) {
          if (type === 'TODAY_REST') {
            await this.$messagebox.confirm('调整为休息将会删除计划信息，确定调整么？')
          }
          // await Api.post('/plan/updatePlanValidFlagByDate', {
          //   'date': this.date,
          //   'pageFlag': 'PLAN',
          //   'token': simpleLocalDb.getItem('token'),
          //   'validFlag': type
          // }, {
          //   '_INDICATOR': true,
          //   '_NEED_CODE_0': true
          // })
          // this.plans.splice(0)
          if (type === 'VALID_PLAN' && !this.plans.length) this.doNewPlan()
          if (!this.plans[0].dutyType) this.doSwitchDutyType('L001', true)
          this.type = type
          return type
        }
      },
      doChangeIndex (index) {
        if (this.activedIndex !== index) {
          this.activedIndex = index
        }
      },
      doNewPlan () {
        this.plans.push(new Plan())
        this.activedIndex = this.plans.length - 1
        this.doSwitchDutyType('L001', true)
        this.setPlanCacheJSON()
      },
      async doSwitchDutyType (code = '', force = false) {
        let plan = this.activedPlan
        if (plan.dutyType === code) return
        let different = await new Promise(function (resolve, reject) {
          if (plan.dutyStore) resolve(true)
          if (plan.dutyStoreCode) resolve(true)
          if (plan.dutyStoreShift) resolve(true)
          if (plan.dutyStoreProducts.length) resolve(true)
          if (plan.dutyStoreProductsDefault.length) resolve(true)
          if (plan.dutyOffice) resolve(true)
          if (plan.dutyOfficeCode) resolve(true)
          if (plan.dutyOtherProvince) resolve(true)
          if (plan.dutyOtherProvinceCode) resolve(true)
          if (plan.dutyOtherCity) resolve(true)
          if (plan.dutyOtherCityCode) resolve(true)
          if (plan.dutyOtherCounty) resolve(true)
          if (plan.dutyOtherCountyCode) resolve(true)
          if (plan.dutyOtherAddr) resolve(true)
          if (plan.dutyStart) resolve(true)
          if (plan.dutyStart2) resolve(true)
          if (plan.dutyEnd) resolve(true)
          if (plan.dutyEnd2) resolve(true)
          if (plan.dutyMission.length) resolve(true)
          if (plan.output) resolve(true)
          resolve(false)
        })
        if (different && !force && plan.dutyType) await this.$messagebox.confirm('切换上班点类型已填写的信息将被删除，确认切换吗？')
        plan.dutyType = code
        plan.dutyStore = ''
        plan.dutyStoreCode = ''
        plan.dutyStoreShift = ''
        plan.dutyStoreProducts = []
        plan.dutyStoreProductsDefault = []
        plan.dutyOffice = ''
        plan.dutyOfficeCode = ''
        plan.dutyOtherProvince = ''
        plan.dutyOtherProvinceCode = ''
        plan.dutyOtherCity = ''
        plan.dutyOtherCityCode = ''
        plan.dutyOtherCounty = ''
        plan.dutyOtherCountyCode = ''
        plan.dutyOtherAddr = ''
        plan.dutyStart = null
        plan.dutyStart2 = null
        plan.dutyEnd = null
        plan.dutyEnd2 = null
        plan.dutyMission = []
        plan.output = ''
        return code
      },
      async doSelectStore () {
        let plan = this.activedPlan || {}
        let store = await BmSelectPage({ component: CompSelectStore })
        plan.dutyStore = store.storeName
        plan.dutyStoreCode = store.storeId
        let { 'itemList': defaultList } = await Api.post('/plan/getPrdInfoByIdOrName', {
          'pageFlag': 'makePlan',
          'planDate': this.date,
          'prdIdOrName': '',
          'storeId': store.storeId
        }, {
          '_INDICATOR': true,
          '_NEED_CODE_0': true
        })
        plan.dutyStoreProducts = []
        plan.dutyStoreProductsDefault = []
        for (let item of defaultList || []) {
          plan.dutyStoreProductsDefault.push(new Product({
            id: item['prdId'],
            code: item['customerPrd'],
            name: item['prdName'],
            price: item['price'] / 100,
            api_isNew: item['isNew']
          }))
        }
      },
      async doSelectOffice () {
        let plan = this.activedPlan || {}
        let office = await BmSelectPage({ component: CompSelectOffice })
        plan.dutyOffice = office.name
        plan.dutyOfficeCode = office.code
        return office
      },
      getOtherLoc (plan) {
        return `${plan.dutyOtherProvince}${plan.dutyOtherCity}${plan.dutyOtherCounty}` || ''
      },
      doSelectRegion () {
        this.$refs.region.reset()
        this.$refs.region.open()
      },
      doConfirmRegion (res) {
        let p = this.activedPlan
        if (p) {
          p.dutyOtherProvince = res['province']['data']['dname']
          p.dutyOtherProvinceCode = res['province']['data']['dcode']
          p.dutyOtherCity = res['city']['data']['dname']
          p.dutyOtherCityCode = res['city']['data']['dcode']
          p.dutyOtherCounty = res['county']['data']['dname']
          p.dutyOtherCountyCode = res['county']['data']['dcode']
        }
        return res
      },
      getHrAndMin (date) {
        if (date && +date || date === 0) {
          let d = new Date(+date || 0)
          let h = d.getHours()
          let m = d.getMinutes()
          return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m)
        } else {
          return date
        }
      },
      doOpenPicker (target = 'Start') {
        let p = this.activedPlan
        if (p) {
          this.pickerTarget = target
          let dateObj
          let date = this.activedPlan[`duty${target}`]
          if (date && +date || date === 0) {
            dateObj = new Date(+date)
          }
          let h = dateObj ? dateObj.getHours() : null
          let m = dateObj ? dateObj.getMinutes() : null
          this.picker = (date || date === 0) ? (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) : '00:00'
          this.$refs.picker.open()
        }
      },
      doConfirmPicker (res) {
        let target = this.pickerTarget
        let arr = res.split(':')
        let h = +arr[0]
        let m = +arr[1]
        let date = new Date(this.date)
        date.setHours(h)
        date.setMinutes(m)
        if (this.activedPlan) this.activedPlan[`duty${target}`] = +date
        this.picker = ''
        this.pickerTarget = ''
        return res
      },
      getStoreShift (plan) {
        let res = this.dutyStoreShiftSortedDict.find(function (v) { return v.code === plan.dutyStoreShift })
        return res ? res.name : ''
      },
      getStoreTotal (plan) {
        let res = 0
        for (let item of plan.dutyStoreProducts) {
          res += item.price * item.count
        }
        for (let item of plan.dutyStoreProductsDefault) {
          res += item.price * item.count
        }
        return res
      },
      getStoreAmounts (plan) {
        let res = 0
        for (let item of plan.dutyStoreProducts) {
          res += +item.count
        }
        for (let item of plan.dutyStoreProductsDefault) {
          res += +item.count
        }
        return +res
      },
      doChangeProductCount (item, count = 0) {
        if (count > 99999) {
          item.count = 99999
        } else if (count < 0) {
          item.count = 0
        } else {
          item.count = +count || 0
        }
      },
      async doAddProduct () {
        let plan = this.activedPlan || {}
        let res = await BmSelectPage({
          component: CompSelectProduct,
          options: {
            disabledList: (function () {
              let arr = []
              for (let item of [...plan.dutyStoreProducts || [], ...plan.dutyStoreProductsDefault || []]) arr.push(item.code)
              return arr
            })()
          }
        })
        for (let item of res) {
          let id = item['prdId']
          let existed = plan.dutyStoreProducts.find(function (v) {
            return v.id === id
          })
          if (existed) {
            existed.count++
            continue
          }
          let existedInDefault = plan.dutyStoreProducts.find(function (v) {
            return v.id === id
          })
          if (existedInDefault) {
            existedInDefault.count++
            continue
          }
          plan.dutyStoreProducts.push(new Product({
            id: item['prdId'],
            code: item['customerPrd'],
            name: item['prdName'],
            price: item['price'] / 100,
            api_isNew: item['isNew']
          }))
        }
        return res
      },
      async doDelPlan () {
        let plan = this.activedPlan || {}
        await this.$messagebox.confirm('确定要删除本计划吗？')
        if (plan.id) {
          await Api.post('/actuality/updatePlanValidFlagByPlanId', {
            'pageFlag': 'planConfirm',
            'planId': plan.id,
            'token': simpleLocalDb.getItem('token'),
            'validFlag': 'INVALID_PLAN'
          }, {
            '_NEED_CODE_0': true,
            '_INDICATOR': true
          })
          this.edited = true
          this.$store.commit('retailPlanConfirm/indexResetState')
        }
        let i = this.plans.findIndex(function (v) {
          return v === plan
        })
        if (i !== -1) this.plans.splice(i, 1)
        if (this.activedIndex >= this.plans.length) this.activedIndex = this.plans.length - 1
        return plan
      },
      async doCheckBeforeSubmit () {
        // 检查时间，因为后台不好搞这个，变成前端去判断有没有填好上下班时间
        if (this.type === 'TODAY_REST') return
        for (let [index, plan] of Object.entries(this.plans)) {
          if (plan.dutyStoreShift === 'Z005') {
            // 两头班
            if (plan.dutyStart || plan.dutyEnd === 0) {
              if (plan.dutyEnd || plan.dutyEnd === 0) {
                if (plan.dutyStart2 || plan.dutyEnd2 === 0) {
                  if (plan.dutyEnd2 || plan.dutyEnd2 === 0) {
                    continue
                  }
                }
              }
            }
            this.$toast(`请输入计划${+index + 1}的两头班时间`)
            return Promise.reject()
          } else {
            // 非两头班
            if (plan.dutyStart || plan.dutyEnd === 0) {
              if (plan.dutyEnd || plan.dutyEnd === 0) {
                continue
              }
            }
            this.$toast(`请输入计划${+index + 1}的时间`)
            return Promise.reject()
          }
        }
      },
      async doSubmit () {
        await this.doCheckBeforeSubmit()
        let req = {
          'confirmExplain': this.note,
          'confirmFlag': (this.status === 'reconfirmed' || this.status === 'confirmed') ? 'reconfirmed' : 'confirmed',
          'isChecked': '', // 新加参数，如果填'checked'的话，这个提交将无视user是否与门店有绑定关系，不进行校验
          'planDate': this.date,
          'planList': [],
          'token': simpleLocalDb.getItem('token'),
          'userCode': this.userCode
        }
        let requester = async function (toast = true) {
          let res = await Api.post('/planConfirm/savePlanInfo', req, {
            '_NEED_CODE_0': toast,
            '_INDICATOR': true
          })
          if (!toast && res['responseCode'] !== 0) return Promise.reject(res)
          return res
        }
        if (this.type === 'VALID_PLAN') {
          for (let plan of this.plans) {
            let planObj = ({
              'address': '', // 详细地址 string
              'cityCode': '', // 城市编码 string
              'classId': '', // 班次编码 string
              'countyCode': '', // 区县编码 string
              'planId': plan.id || 0, // 计划编号 number 有视为修改 没有或为空则新增
              'planResults': '', // 计划输出结果 string
              'planTime': [{ 'enterTime': plan.dutyStart, 'leaveTime': plan.dutyEnd }], // 出勤时间 array<object>
              'prdList': [], // 产品列表 array<object>
              'provinceCode': '', // 省份编码 string
              'storeId': '', // 门店ID，办公点编码... string
              'taskList': [], // 工作任务列表 array<object>
              'validFlag': 'VALID_PLAN', // 有效标记字典 string （NOT_ENTER_STORE-今日不进店 ；TODAY_REST-今日休息； VALID_PLAN-有效计划 ；INVALID_PLAN-无效计划 ；NO_PLAN-无计划）
              'workPointCode': plan.dutyType // 上班点类型编码 string
            })
            // 组装'taskList'
            let targetMissionDict = this.dutyTypeWithMissionsDict[plan.dutyType]
            if (targetMissionDict && targetMissionDict.length) {
              for (let mission of plan.dutyMission) {
                let target = targetMissionDict.find(function (v) { return v.code === mission })
                if (target) planObj['taskList'].push({ 'taskId': mission })
              }
            }
            if (plan.dutyType === 'L001') {
              planObj['classId'] = plan.dutyStoreShift
              if ((plan.dutyStart2 || plan.dutyStart2 === 0) && (plan.dutyEnd2 || plan.dutyEnd2 === 0)) {
                planObj['planTime'].push({
                  'enterTime': plan.dutyStart2 || 0,
                  'leaveTime': plan.dutyEnd2 || 0
                })
              }
              for (let item of plan.dutyStoreProductsDefault) {
                if (item.count) {
                  planObj['prdList'].push({
                    'customerPrd': item.code,
                    'isNew': item.api_isNew,
                    'prdNum': item.count
                  })
                }
              }
              for (let item of plan.dutyStoreProducts) {
                if (item.count) {
                  planObj['prdList'].push({
                    'customerPrd': item.code,
                    'isNew': item.api_isNew,
                    'prdNum': item.count
                  })
                }
              }
              planObj['storeId'] = plan.dutyStoreCode
            } else if (plan.dutyType === 'L011') {
              planObj['planResults'] = plan.output
              planObj['storeId'] = plan.dutyOfficeCode
            } else if (plan.dutyType === 'L099') {
              planObj['address'] = plan.dutyOtherAddr
              planObj['cityCode'] = plan.dutyOtherCityCode
              planObj['countyCode'] = plan.dutyOtherCountyCode
              planObj['planResults'] = plan.output
              planObj['provinceCode'] = plan.dutyOtherProvinceCode
            }
            req['planList'].push(planObj)
          }
        } else if (this.type === 'TODAY_REST') {
          req['planList'].push({
            'address': '', // 详细地址 string
            'cityCode': '', // 城市编码 string
            'classId': '', // 班次编码 string
            'countyCode': '', // 区县编码 string
            'planId': 0, // 计划编号 number 有视为修改 没有或为空则新增
            'planResults': '', // 计划输出结果 string
            'planTime': [], // 出勤时间 array<object>
            'prdList': [], // 产品列表 array<object>
            'provinceCode': '', // 省份编码 string
            'storeId': '', // 门店ID，办公点编码... string
            'taskList': [], // 工作任务列表 array<object>
            'validFlag': 'TODAY_REST', // 有效标记字典 string （NOT_ENTER_STORE-今日不进店 ；TODAY_REST-今日休息； VALID_PLAN-有效计划 ；INVALID_PLAN-无效计划 ；NO_PLAN-无计划）
            'workPointCode': '' // 上班点类型编码 string
          })
        }
        let res = await requester(false).catch(function (err = {}) {
          if (err['responseCode'] === 4139) {
            return err
          } else {
            if (err['responseMsg']) this.$toast(err['responseMsg'])
            throw err
          }
        }.bind(this))
        if (res['responseCode'] === 4139) {
          await this.$messagebox.confirm(res['responseMsg'])
          req['isChecked'] = 'checked'
          res = await requester()
        }
        this.$toast(res['responseMsg'] === '请求成功' ? '保存成功' : res['responseMsg'])
        this.edited = true
        this.$store.commit('retailPlanConfirm/indexResetState')
        this.$router.back()
        return res
      },
      openRegion (plan) {
        let tmp = [{
          type: 'province',
          dname: plan.dutyOtherProvince,
          dcode: plan.dutyOtherProvinceCode
        }, {
          type: 'city',
          dname: plan.dutyOtherCity,
          dcode: plan.dutyOtherCityCode
        }, {
          type: 'county',
          dname: plan.dutyOtherCounty,
          dcode: plan.dutyOtherCountyCode
        }]
        if (plan.dutyOtherProvinceCode && plan.dutyOtherCityCode && plan.dutyOtherCountyCode) {
          return this.$refs.region.open(tmp)
        } else {
          return this.$refs.region.open([])
        }
      }
    },
    created () {
      this.getFatalParams().catch(function (err) {
        this.$toast('获取配置参数失败，请稍后重试')
        throw err
      }.bind(this))
      this.doInit()
    }
  }
</script>

<style lang="less" scoped>
  @color1: #1FB8FF;
  @color2: #FFC924;
  @color3: #FF6C47;
  @color_b1: #D7D7D7;
  @color_b2: #E5E5E5;
  @color_t1: #333;
  @color_t2: #666;
  @color_t3: #999;
  @color_bg1: #FBFBFB;

  @offset0: 0.05rem;
  @offset1: 0.1rem;
  @offset2: 0.15rem;
  @offset3: 0.2rem;

  @size01: 0.10rem;
  @size0: 0.12rem;
  @size1: 0.13rem;
  @size2: 0.14rem;
  @size3: 0.15rem;
  @size4: 0.17rem;

  input, button, textarea {
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }

  .fc() {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bgp(@url) {
    background: url(@url) center no-repeat;
    background-size: contain;
  }
  .pam() {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .pam2() {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .pal() {
    position: absolute;
    top: 0;
    left: 0;
  }
  .par() {
    position: absolute;
    right: 0;
    top: 0;
  }

  .c_block {
    background-color: #fff;
    margin-top: @offset1;
    border-bottom: 1px solid @color_b1;
    &:first-child {
      margin-top: 0;
    }
  }
  .c_line1 {
    display: flex;
    width: 100%;
    min-height: 0.5rem;
    align-items: center;
    justify-content: space-between;
    padding: @offset2 @offset1;
    color: @color_t1;
    font-size: @size3;
    border-top: 1px solid @color_b1;
    &:first-child {
      border-top: none
    }
    .info-wrap>p:first-child { margin-bottom: .10rem; }
  }
  .c_line2 {
    display: flex;
    min-height: 0.5rem;
    align-items: center;
    justify-content: space-between;
    margin-left: @offset1;
    border-top: 1px solid @color_b1;
    padding: @offset2 @offset1 @offset2 0;
    color: @color_t1;
    font-size: @size3;
    &:first-child {
      border-top: none;
    }
  }
  .c_line-left {
    flex-shrink: 0;
    margin-right: 1em;
  }
  .c_select {
    display: inline-block;
    vertical-align: middle;
    width: 0.2rem;
    height: 0.2rem;
    background: url("~@/assets/retailPlanConfirm/checkbox.png") center no-repeat;
    background-size: contain;
    appearance: none;
    &:checked {
      background-image: url("~@/assets/retailPlanConfirm/checkbox-active.png");
    }
  }
  .c_line-with-select {
    padding-top: @offset1 * 0.2;
    padding-bottom: @offset1 * 0.2;
  }
  .c_select-btn {
    position: relative;
    display: inline-block;
    margin: @offset1 * 0.5;
    &-ctrl {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
    &-text {
      text-align: center;
      display: inline-block;
      min-width: 0.54rem;
      font-size: @size2;
      color: @color_t2;
      padding: @offset1 * 0.75 @offset0;
      border: 1px solid @color_b1;
      border-radius: 4px;
    }
    &-ctrl:checked + &-text {
      color: @color3;
      border-color: @color3;
    }
  }
  .c_btn {
    display: inline-block;
    margin: @offset1 * 0.5;
    text-align: center;
    min-width: 0.54rem;
    font-size: @size2;
    color: @color_t2;
    padding: @offset1 * 0.75 @offset0;
    border: 1px solid @color_b1;
    border-radius: 4px;
    &-actived {
      color: @color3;
      border-color: @color3;
    }
  }
  .c_right {
    padding-right: 0.12rem;
    background: url("~@/assets/retailPlanConfirm/link.png") right no-repeat;
    background-size: 0.075rem;
  }
  .c_textarea {
    display: block;
    position: relative;
    line-height: 1.15;
    &-ctrl {
      line-height: inherit;
      border: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      appearance: none;
      overflow: visible;
      word-wrap: break-word;
    }
    &-placeholder {
      line-height: inherit;
      word-break: break-word;
      opacity: 0;
      white-space: pre-wrap;
      min-height: 1.15em;
      padding-left: 3px;
      padding-right: 3px;
    }
  }

  .m_header {
    font-size: @size3;
    color: @color_t1;
    .btn {
      font-size: @size2;
      padding-left: @offset1;
      padding-right: @offset1;
      text-decoration: underline;
      white-space: nowrap;
      /* 你试试不写flex-shrink为0，搞死你 */
      flex-shrink: 0;
    }
    .overview {
      border-top: none;
      margin-top: 0;
      display: block;
      padding: @offset1;
    }
    .first, .second {
      .fc();
    }
    .second {
      /* margin-top: @offset1; */
      &:first-child {
        margin-top: 0;
      }
    }
    .name {
      font-weight: bold;
    }
    .status {
      font-weight: bold;
      color: @color1;
    }
    .type {
      padding-left: 0.25rem;
      height: 0.2rem;
      background: url("~@/assets/retailPlanConfirm/checkbox.png") left no-repeat;
      background-size: contain;
      margin-left: @offset2;
      &:first-child {
        margin-left: 0;
      }
    }
    .type-actived {
      background-image: url("~@/assets/retailPlanConfirm/checkbox-active.png");
    }
    .strong {
      color: @color1;
      font-weight: bold;
    }
    .plans {
      height: 0.45rem;
      margin-top: @offset1;
      background-color: #fff;
      border-bottom: 1px solid @color_b1;
      display: flex;
      overflow: hidden;
      overflow-x: auto;
    }
    .del {
      .bgp("~@/assets/retailPlanConfirm/del.png");
      background-size: 70%;
      display: inline-block;
      vertical-align: middle;
      width: 0.2rem;
      height: 0.2rem;
      margin-left: 0.5em;
    }
    .tab {
      height: 100%;
      font-size: @size3;
      color: @color_t3;
      position: relative;
      flex-shrink: 0;
    }
    .active {
      color: @color1;
      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: @color1;
      }
    }
    .tab-text {
      .fc();
      padding: 2px 0.5em;
      border-right: 1px solid @color_b2;
    }
  }
  .m_main {
    .pam();
    overflow-y: auto;
    padding-bottom: @offset1;
  }
  .m_plans-overview {
    .strong {
      color: @color3;
    }
    .type {
      margin-left: @offset1;
    }
    .store {
      border-bottom: 1px solid @color_b1;
    }
    .shifts {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      text-align: center;
    }
    .shift {
      margin: 0;
      width: 25%;
      padding: @offset1 @offset0;
    }
    .addr {
      align-items: baseline;
    }
    .time-box {
      display: flex;
    }
    .time-label {
      margin-left: @offset2;
    }
    .times-with-shifts {
      border-top: none;
    }
    .time {
      text-decoration: underline;
    }
  }
  .m_plans-mission {
    .line {
      display: block;
    }
    .labels {
      margin: -@offset0;
      margin-top: @offset1 - @offset0;
    }
  }
  .m_plans-store-detail {
    color: @color_t1;
    font-size: @size2;
    .overview {
      font-size: @size3;
      font-weight: bold;
      align-items: flex-end;
      background-color: #fff;
      border-bottom: 1px solid @color_b1;
      width: auto;
    }
    .products {
      display: block;
      border-top: none;
      padding: 0;
    }
    .item {
      display: block;
    }
    .title {
      font-weight: inherit;
    }
    .count {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ctrl {
      display: flex;
      align-items: center;
      margin-top: @offset1;
    }
    .ctrl-main {
      display: flex;
      align-items: stretch;
      width: 1.1rem;
      height: 0.3rem;
      overflow: hidden;
      border: 1px solid @color_b1;
      border-radius: 2px;
    }
    .btn {
      width: 0.3rem;
      flex-shrink: 0;
      background-color: @color_b2;
      color: @color_t2;
      font-size: @size3 * 1.3;
    }
    .input {
      text-align: center;
      flex-shrink: 1;
      min-width: 0;
    }
    .add {
      padding: 0;
    }
    .add-empty {
      border-top: none;
    }
    .add-btn {
      width: 100%;
      height: 0.45rem;
      color: @color1;
      text-decoration: underline;
      font-size: @size3;
    }
  }
  .m_plans-output {
    padding: @offset1;
    display: block;
    .title {
      font-size: @size3;
    }
    .textarea {
      margin-top: @offset1;
      padding: @offset1;
      display: block;
      height: 0.6rem;
      width: 100%;
      background-color: #FBFBFB;
      border: 1px solid @color_b1;
      border-radius: 4px;
      font-size: @size2;
    }
  }
  .m_plans-submits {
    padding: @offset1;
    display: flex;
    .del {
      width: 50%;
      flex-grow: 1;
      background: #fff;
      border: 1px solid @color3;
      border-radius: 4px;
      color: @color3;
      height: 0.4rem;
    }
    .gap {
      width: @offset1;
      flex-shrink: 0;
    }
    .submit {
      width: 50%;
      flex-grow: 1;
      background: @color3;
      border-radius: 4px;
      color: #fff;
      height: 0.4rem;
    }
  }
  .m_detail-overview {
    font-size: @size3;
    color: @color_t1;
    .line {
      padding-left: 0.25rem;
      background-position: left;
      background-size: 0.14rem;
      background-repeat: no-repeat;
    }
    .store {
      background-image: url("~@/assets/retailPlanConfirm/store.png");
    }
    .time {
      background-image: url("~@/assets/retailPlanConfirm/time.png");
    }
    .mission {
      background-image: url("~@/assets/retailPlanConfirm/office.png");
    }
  }
  .m_detail-product {
    .overview {
      font-size: @size3;
      font-weight: bold;
      align-items: flex-end;
      background-color: #fff;
      width: auto;
      border-bottom: 1px solid @color_b1;
    }
    .items {
      display: block;
      padding: 0;
    }
    .item {
      display: block;
      font-size: @size2;
      color: @color_t1;
    }
    .data {
      .fc();
      margin-top: @offset1;
    }
    .name {
      color: @color_t2;
      font-weight: inherit;
    }
  }
  .m_detail-output {
    padding: @offset1;
    .title {
      font-weight: normal;
      color: @color_t1;
      font-size: @size3;
    }
    .opinion {
      font-size: @size0;
      color: @color_t3;
      margin-top: @offset1;
    }
  }
  .m_opinion {
    padding: @offset1;
    &:first-child {
      margin-top: @offset1;
    }
    .title {
      font-weight: normal;
      color: @color_t1;
      font-size: @size3;
    }
    .opinion {
      font-size: @size0;
      color: @color_t3;
      margin-top: @offset1;
    }
  }
  .m_opinions {
    padding: @offset1;
    color: @color_t3;
    font-size: @size0;
    .item {
      .fc();
      margin-top: @offset1;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .m_rest {
    .pam();
    .block {
      padding: @offset1;
    }
    .title {
      font-weight: normal;
      color: @color_t1;
      font-size: @size3;
    }
    .content {
      font-size: @size0;
      color: @color_t3;
      margin-top: @offset1;
    }
    .item {
      .fc();
      font-size: @size0;
      color: @color_t3;
      margin-top: @offset1;
      &:first-child {
        margin-top: 0;
      }
    }
    .empty {
      .bgp("~@/assets/retailPlanConfirm/icon_rest.png");
      background-size: 1.4rem;
      background-position: top;
      display: block;
      width: 100%;
      padding-top: 1.6rem;
      text-align: center;
      color: @color_t3;
      font-size: @size3;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .m_confirm {
    flex-shrink: 0;
    display: flex;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 0 20px @color_b1;
    font-size: @size3;
    align-items: stretch;
    z-index: 1;
    .input {
      align-self: center;
      overflow: hidden;
      flex-grow: 1;
      padding: @offset1;
      min-height: 1em;
    }
    .submit {
      display: block;
      width: 0.86rem;
      background-color: @color3;
      /* height: 100%; */
      min-height: 0.45rem;
      color: #fff;
      flex-shrink: 0;
    }
  }
</style>