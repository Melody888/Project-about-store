<template>
  <bm-layout v-if="personVo">
    <div slot="header">
      <bm-header>{{title}}</bm-header>
    </div>
    <div class="f15-c333 line-1" slot="header">{{personVo.userId}}-{{personVo.userName}}</div>
    <div>
      <div class="f-between-ali-center f15-c333 line-1 mt10 mb10">
        <div><span>有效时间<i class="orange">*</i></span></div>
        <div class="time f15 color-333">
          <span v-if="isEdit<0 && !isChange" :class="{'no-time': !personVo.startDate}">{{personVo.startDate | datetime('YYYY/MM/DD')}}</span>
          <span v-else @click="openStartDatePicker" class="no-time">{{personVo.startDate | datetime('YYYY/MM/DD') || '开始时间'}}</span> -
          <span @click="openEndDatePicker" class="no-time">{{personVo.endDate | datetime('YYYY/MM/DD')  || (type === 'add' ? '结束时间' : '9999/12/31')}}</span>
        </div>
      </div>
      <div class="from">
        <div class="item" v-for="item in personVo.fieldList">
          <div class="line-2 f-between-ali-center">
            <div>{{item.fieldDesc}}</div>
            <div class="f-between-ali-center">
              <label class="f-between-ali-center mr5" v-for="list in item.radioFieldList" @click="selectValue(list, item)">
                <span class="icon-radio" :class="{'icon-radio-selected': item.selectCode === list.fieldCode}"></span>
                <span class="flex">{{list.fieldDesc}}</span>
              </label>
            </div>
          </div>
          <div class="line-2">
            <textarea class="text-con" maxlength="50" placeholder="请输入说明，非必填，上限50字" v-model="item.fieldContent"></textarea>
          </div>
        </div>
        <div class="item">
          <div class="line-2">
            <div class="f-between-ali-center">
              <div>能力评估</div>
              <div class="stars">
                <input type="radio" :value="1" v-model="personVo.levelNum" :class="{'active': personVo.levelNum > 0}">
                <input type="radio" :value="2" v-model="personVo.levelNum" :class="{'active': personVo.levelNum > 1}">
                <input type="radio" :value="3" v-model="personVo.levelNum" :class="{'active': personVo.levelNum > 2}">
                <input type="radio" :value="4" v-model="personVo.levelNum" :class="{'active': personVo.levelNum > 3}">
                <input type="radio" :value="5" v-model="personVo.levelNum" :class="{'active': personVo.levelNum > 4}">
              </div>
            </div>
          </div>
          <div class="line-2">
            <textarea class="text-con"  maxlength="50" placeholder="请输入能力评估说明，非必填，上限50字" v-model="personVo.levelContent"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" slot="footer" @click="confirmPerson(personVo)">
      确  定
    </div>
    <div slot="bottom">
      <!-- 开始日期 -->
      <mt-datetime-picker
        ref="startDate"
        :start-date="limitStartDateBegin"
        type="date"
        v-model="defaultStartDate"
        @confirm="confirmStartDate">
      </mt-datetime-picker>
      <!-- 结束日期 -->
      <mt-datetime-picker
        ref="endDate"
        :start-date="limitEndDateBegin"
        type="date"
        v-model="defaultEndDate"
        @confirm="confirmEndDate">
      </mt-datetime-picker>
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  import { Toast, Indicator } from 'mint-ui'
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  const oneDay = 1 * 24 * 60 * 60 * 1000

  export default {
    data () {
      return {
        personVo: null,
        originDefaultStartDate: new Date(),
        routeLeave: true,
        title: '添加人员',
        defaultStartDate: new Date(),
        defaultEndDate: new Date(),
        type: 'add',
        playload: {},
        isChange: false
      }
    },
    computed: {
      ...mapGetters({
        storeOrgVo: 'study/storeOrgVo'
      }),
      limitStartDateBegin () { // 限制选择时间范围
        if (this.type === 'edit') {
          return new Date(this.originDefaultStartDate.getTime() - oneDay)
        } else {
          return
        }
      },
      limitEndDateBegin () { // 限制选择时间范围
        return new Date(this.originDefaultStartDate.getTime() - oneDay)
      },
      isEdit () { // 是否禁止编辑开始时间
        if (this.type === 'edit') {
          const s = this.personVo.startDate
          const t = this.originDefaultStartDate.getTime()
          const d = (this.zeroTs(s) - this.zeroTs(t)) / oneDay
          return d
        } else if (this.type === 'add') {
          return true
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if ((this.type === 'add' && this.personVo.startDate > 0 || this.type === 'edit') && this.routeLeave) {
        this.$messagebox.confirm('确定离开当前编辑页面？', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          cancelButtonClass: 'cancel-confirm-btn'
        }).then(() => {
          next()
        }, () => {
          this.$router.go(1)
        })
      } else {
        next()
      }
    },
    methods: {
      zeroTs (date) {
        return (new Date(moment(date).format('YYYY-MM-DD'))).getTime()
      },
      datetime (time, pattern) {
        if (!time) return ''
        let value = moment(time)
        let tempPattern = 'YYYY-MM-DD HH:mm:ss'

        if (!pattern) {
          return value.format(tempPattern)
        }

        switch (pattern) {
          case 'date':
            tempPattern = 'YYYY-MM-DD'
            break
          case 'time':
            tempPattern = 'HH:mm:ss'
            break
          case 'dateym':
            tempPattern = 'YYYY-MM'
            break
          default:
            tempPattern = pattern
            break
        }
        return value.format(tempPattern)
      },
      returnBack () { // 返回上一页
        if (this.type === 'add' && this.personVo.startDate > 0 || this.type === 'edit') {
          this.$messagebox.confirm('确定离开当前编辑页面？', {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            cancelButtonClass: 'cancel-confirm-btn'
          }).then(() => {
            this.$router.go(-1)
          }, () => {})
        } else {
          this.$router.go(-1)
        }
      },
      selectValue (list, item) {  // 判断选择是否完成，已选的清空，未选的做出选择
        if (list.fieldCode === item.selectCode) {
          item.selectCode = ''
          item.selectDesc = ''
        } else {
          item.selectCode = list.fieldCode
          item['radioFieldList'].forEach((i, index) => {
            if (i.fieldCode === list.fieldCode) {
              item.selectDesc = i.fieldDesc
            }
          })
        }
      },
      existStoreOrgVo () { // 从projectList 找到对应 人员信息
        this.storeOrgVo.projectList.forEach((item, index) => {
          if (item.fieldCode === this.playload.fieldCode) {
            const pstring = JSON.stringify(item['personList'][this.playload.index])

            const pObject = JSON.parse(pstring)
            this.personVo = pObject
          }
        })
      },
      openStartDatePicker () {  // 选择开始日期
        this.$refs.startDate.open()
      },
      openEndDatePicker () {  // 选择结束日期
        this.$refs.endDate.open()
      },
      confirmStartDate (val) {  // 确定开始日期
        this.isChange = true
        this.personVo.startDate = val.getTime()
      },
      confirmEndDate (val) {  // 确定结束日期
        if (this.personVo.startDate > val.getTime()) {
          Toast('开始时间大于结束时间')
        } else {
          this.personVo.endDate = val.getTime()
        }
      },
      getPersonInfoByParams () { // 根据参数人员配置信息
        Indicator.open()
        return api.study.getPersonInfoByParams({
          data: {
            fieldCode: this.playload.fieldCode,
            storeId: this.playload.storeId,
            token: simpleLocalDb.getItem('token'),
            userId: this.playload.userId
          }
        }).then(res => {
          Indicator.close()
          if (res.responseCode === 0) {
            this.personVo = res.personVo
          } else {
            Toast(res.responseMsg)
          }
        })
      },
      confirmPerson (personVo) {
        if (!this.personVo.startDate) {
          Toast('请填写有效时间')
          return
        }
        let isEmpty = false
        let letter = ''
        personVo['fieldList'].forEach(item => {
          if (item.fieldContent && !item.selectCode) {
            isEmpty = true
            letter = item.fieldDesc
          }
        })
        if (isEmpty) {
          Toast('请勾选' + letter + '情况')
          return
        }
        const data = JSON.stringify(this.storeOrgVo)
        const Obj = {}
        Obj.fieldCode = this.playload.fieldCode
        Obj.userId = this.playload.userId
        Obj.personVo = personVo
        Obj.type = this.playload.type
        Obj.index = this.playload.index
        if (data !== '{}') {
          this.$store.commit('study/refreshPersonListVo', Obj)
          this.routeLeave = false
          this.$router.go(-1)
        }
      }
    },
    created () {
      this.playload = this.$route.query
      this.type = this.playload.type
      if (this.playload.type === 'add') {
        this.title = '添加人员'
        this.getPersonInfoByParams()
      } else {
        this.title = '编辑人员'
        this.existStoreOrgVo()
      }
    }
  }
</script>

<style lang="less" scoped>
  .f15-c333 {
    font-size: 0.15rem;
    color: #333333;
    overflow: hidden;
    word-break: break-all;//强制超出换行
  }

  .f14-c333 {
    font-size: 0.14rem;
    color: #333333;
  }

  .mb10 {
    margin-bottom: 0.1rem;
  }
  .mt10 {
    margin-top: 0.1rem;
  }
  .mr10 {
    margin-right: 0.1rem;
  }
  .mr5{
    margin-right: 0.05rem;
  }
  .f-between-ali-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .b-bot {
    border-bottom: 1px solid #d7d7d7;
  }

  .footer {
    background: #FF6C47;
    width: 100%;
    height: 0.5rem;
    color: white;
    text-align: center;
    line-height: 0.5rem;
    font-size: 0.15rem;
    &-disable {
      background: #D7D7D7;
    }
  }

  .icon {
    &-radio {
      width:0.3rem;
      height:0.3rem;
      background: url('../../assets/storeAuthorized/radio_normal@2x.png') no-repeat center center / cover;
      &-selected{
        background: url('../../assets/storeAuthorized/radio_selected@2x.png') no-repeat center center / cover;
      }
    }
    &-start {
      width: 0.17rem;
      height: 0.17rem;
      background: url('../../assets/storeAuthorized/ic_star17_yellow.png') no-repeat center center;
      background-size: 100%;
      margin-left: 0.05rem;
    }
    &-unstart{
      width: 0.17rem;
      height: 0.17rem;
      background: url('../../assets/storeAuthorized/ic_star17_grey.png') no-repeat center center;
      background-size: 100%;
      margin-left: 0.05rem;
    }
  }
  .stars{
    display: flex;
    align-items: center;
    justify-content: center;
    &>input[type=radio]{
      appearance: none;
      width: .17rem;
      height: .17rem;
      margin-left: 0.1rem;
      border: 0;
      background: url('../../assets/storeAuthorized/ic_star17_grey.png') no-repeat center center/contain;
      background-color: #fff;
      &.active{
        background: url('../../assets/storeAuthorized/ic_star17_yellow.png') no-repeat center center/contain;
      }
    }
  }
  .line-1{
    background-color:white;
    padding:0.15rem 0.1rem 0.15rem 0.1rem;
    border:1px solid #e5e5e5;
  }
  .time{
    .no-time{
      color:#0a85cc;
      text-decoration-color: #0a85cc;
      text-decoration: underline;
    }
  }
  .line-2{
    background-color:white;
    padding:0.13rem 0.1rem 0rem 0.1rem;
    font-size: 0.15rem;
    color:#333333;
  }
  .text-con{
    font-size: 0.14rem;
    width:100%;
    height: 0.6rem;
    border-radius: 4px;
    resize: none;
    padding:0.07rem 0.1rem;
    box-sizing: border-box;
    border:1px solid #D7D7D7;
    background-color: #FBFBFB;
  }
  .orange{
    color:#FF6C47;
  }
  .from{
    padding-bottom:0.1rem;
    background-color:white;
    border:1px solid #e5e5e5;
  }
</style>



