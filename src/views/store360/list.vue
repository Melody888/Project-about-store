<template>
  <bm-layout ref="layout" :isScrollTouch='false'>
    <bm-header slot="header">
      门店360°
    </bm-header>
    <!--
      <div class="store360__list__nav" slot="right" to="/store360/storeList">我的门店</div> -->
    <div slot="header" class="p10 bg-fff flex items-center store360__list__search">
      <p :class="['flex-auto', 'truncate', 'input', {'small': isResult && store.storeName.length > 16 ? true : false, 'store-font': isResult}]" @click="selectStore">{{isResult ? store.storeName : '请选择门店'}}</p>
      <i class="clear" v-show="isResult" @click="clearSearch"></i>
    </div>
    <div class="scrollAuto">
      <!--
      <div class="store360__list__store fixed-top-element">
        <div class="store360__sort__left" @click="preStore" v-show="activeStoreIndex && !isResult"><i class="store360__pre"></i></div>
        {{store.storeName || ''}}
        <div class="store360__sort__right" @click="nextStore" v-show="(activeStoreIndex < (storeList.length - 1)) && !isResult"><i class="store360__next"></i></div>
      </div> -->
      <section class="store360__list__column">
        <div class="column__title">
          <p class="icon"></p>
          <p class="name truncate">{{store && store.storeName ? store.storeName : '门店基本信息'}}</p>
          <router-link class="attach" v-if="store" to="/store360/storeInfo">基本信息</router-link>
        </div>
        <ul class="store360__capacity">
          <li class="item"><p class="label">成交单数/月</p><p>{{capacityVo && capacityVo.billNum ? capacityVo.billNum.toLocaleString() : '无' | formatDefault(store)}}</p></li>
          <li class="item"><p class="label">客单价(元)</p><p>{{capacityVo && capacityVo.averagePrice ? (+(capacityVo.averagePrice/100).toFixed(2)).toLocaleString() : '无' | formatDefault(store)}}</p></li>
          <li class="item"><p class="label">总营业额(万元)</p><p>{{capacityVo && capacityVo.sumPrice ? (+(capacityVo.sumPrice/1000000).toFixed(2)).toLocaleString() : '无' | formatDefault(store)}}</p></li>
        </ul>
      </section>
      <section class="store360__list__column">
        <div class="column__title">
          <p class="icon storeSale"></p>
          <p class="name">本周销量提报</p>
          <router-link class="attach" v-if="store" to="/store360/saleDetail">详情</router-link>
        </div>
        <ul class="store360__table">
          <li class="row label">
            <div class="item"></div>
            <div class="item" v-for="item in saleList">{{item.planDate | datetime('dd')}}<p>{{item.planDate | datetime('DD')}}</p></div>
          </li>
          <li class="row">
            <div class="item flex justify-center items-center"><p>销售额<br>(万元)</p></div>
            <p class="item" v-for="item in saleList">{{!store ? '' : item.actuSumprice ? (item.actuSumprice/1000000).toFixed(2) : (item.planDate>currentDate?'':0)}}</p>
          </li>
          <li class="row">
            <div class="item flex justify-center items-center"><p>至尊<br>(套)</p></div>
            <p class="item" v-for="item in saleList">{{!store ? '' : item.actuNum ? item.actuNum : (item.planDate>currentDate?'':0)}}</p>
          </li>
          <li class="row">
            <div class="item flex justify-center items-center"><p>出勤<br>人数</p></div>
            <p :class="['item', {'click-font': item.personNum, 'popupFocus': currentPopup === 'sale' + index}]" v-for="(item, index) in saleList" @click.stop="togglePopup(true, 'sale' + index, item, $event)">{{!store ? '' : item.personNum ? item.personNum : (item.planDate>currentDate?'':0)}}</p>
            <div class="popupModal" ref="pop" v-show="isShowPop">
              <div class="flex justify-between items-center line-wrap header"><p>出勤人员</p><p>至尊(套)</p></div>
              <template v-if="currentPopup">
                <ul class="person-list">
                  <li class="flex justify-between items-center" v-for="person in currentPersonList"><p class="flex-auto">{{person.userName}}</p><p class="key">{{person.actuNum | formatNumber}}</p></li>
                </ul>
              </template>
            </div>
          </li>
        </ul>
      </section>
      <section class="store360__list__column" :class="{'nothing': !store || !orderVo}">
        <div class="column__title">
          <p class="icon storeOrder"></p>
          <p class="name">门店订单</p>
          <router-link class="attach" v-if="store && orderVo" :to="{path: '/storeOrder/lite'+(orderVo && orderVo.pageState=='history'?'?historyDate='+orderVo.createTimestamp:''), query: {'storeId': store && store.storeId, 'tab': (orderVo && orderVo.pageState=='history'?'HISTORY':'STORE')}}">详情</router-link>
        </div>
        <div class="store360__order" v-if="store && orderVo">
          <div class="flex items-center">
            <p class="title flex-auto">{{orderVo.orderCode}}</p>
            <p class="color-999">{{orderVo.createTimestamp | datetime('YYYY/MM/DD')}} {{orderVo.createByName}}</p>
          </div>
          <div class="info">
            <div class="flex items-center">
              <p class="flex-auto" v-if="orderVo.rDate">收货日期：{{orderVo.rDate | datetime('YYYY/MM/DD')}}</p>
              <p class="flex-auto" v-if="orderVo.expectedReceiveDate && !orderVo.rDate">预计收货日期：{{orderVo.expectedReceiveDate | datetime('YYYY/MM/DD')}}</p>
              <p class="state">{{orderVo.orderStatusDesc}}</p>
            </div>
            <p>订单金额：&yen;{{(orderVo.orderTotalAmount/100).toFixed(2)}}</p>
          </div>
          <div class="detail line">
            <div class="detail__item flex">
              <div>
                <p class="label">订单支数</p>
                <p>{{orderVo.orderTotalNum}} ({{orderVo.orderTotalCase}}箱)</p>
                <p>至尊(盒)：{{orderVo.orderZzTotalNum}}</p>
              </div>
            </div>
            <div class="detail__item flex">
              <div>
                <p class="label">已收支数</p>
                <p>{{orderVo.rTotalNum}} ({{orderVo.rTotalCase}}箱)</p>
                <p>至尊(盒)：{{orderVo.rZzTotalNum}}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="store360__list__column" :class="{'nothing': !store || !storePKVo}">
        <div class="column__title">
          <p class="icon storeCheck"></p>
          <p class="name">库存盘点</p>
          <router-link class="attach" v-if="store && storePKVo" :to="{path: storePKVo && storePKVo.pageState=='history'?'/store360/storeCheckHistory':'/store360/storeCheck', query: {'storeId': store && store.storeId}}">详情</router-link>
        </div>
        <div class="store360__order" v-if="store && storePKVo">
          <div class="flex items-center">
            <p class="title flex-auto">{{storePKVo.orderNo}}</p>
            <p class="color-999">{{storePKVo.createTimestamp | datetime('YYYY/MM/DD')}} {{storePKVo.createByName}}</p>
          </div>
          <div class="detail">
            <div class="detail__item flex">
              <div>
                <p class="label">品种数</p>
                <p class="f16">{{storePKVo.prdNum.toLocaleString()}}</p>
              </div>
            </div>
            <div class="detail__item flex">
              <div>
                <p class="label">总支数</p>
                <p class="f16">{{storePKVo.sumNum.toLocaleString()}}</p>
              </div>
            </div>
            <div class="detail__item flex">
              <div>
                <p class="label">至尊</p>
                <p class="f16">{{storePKVo.newNum.toLocaleString()}}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="store360__list__column" :class="{'nothing': !store || !inspectVo}">
        <div class="column__title">
          <p class="icon storeDisplay"></p>
          <p class="name">陈列巡检</p>
          <router-link class="attach" v-if="store && inspectVo" :to="{path: '/showcasePatrol/lite', query: {'storeId': store && store.storeId}}">详情</router-link>
        </div>
        <div class="store360__order" v-if="store && inspectVo">
          <div class="flex items-center">
            <p class="title flex-auto">{{inspectVo.orderNo}}</p>
            <p class="color-999">{{inspectVo.createTimestamp | datetime('YYYY/MM/DD')}} {{inspectVo.createByName}}</p>
          </div>
          <div class="detail line">
            <div class="detail__item flex">
              <div>
                <p class="label">陈列数</p>
                <p class="f16">{{inspectVo.inspectTotalNum}}</p>
              </div>
            </div>
            <div class="detail__item flex">
              <div>
                <p class="label">总排面(m²)</p>
                <p class="f16">{{inspectVo.inspectArea}}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="store360__list__column" :class="{'nothing': !store || !marketPollingVo}">
        <div class="column__title">
          <p class="icon storeDistribution"></p>
          <p class="name">分销巡检</p>
          <router-link class="attach" v-if="store && marketPollingVo" :to="{path: '/storeDistribution/list', query: {'storeId': store && store.storeId}}">详情</router-link>
        </div>
        <div class="store360__order" v-if="store && marketPollingVo">
          <div class="flex items-center">
            <p class="title flex-auto">{{marketPollingVo.orderNo}}</p>
            <p class="color-999">{{marketPollingVo.createTimestamp | datetime('YYYY/MM/DD')}} {{marketPollingVo.createByName}}</p>
          </div>
          <div class="info">
            <p  class="mt5">分销品种数：{{marketPollingVo.marketNum}}</p>
          </div>
        </div>
      </section>
      <section class="store360__list__column" :class="{'nothing': !store || !activityVo}">
        <div class="column__title">
          <p class="icon storeActivity"></p>
          <p class="name">活动执行</p>
          <router-link class="attach" v-if="store && activityVo" :to="{path: activityVo && activityVo.pageState=='history'?'/activityManagement/tszHistory':'/activityManagement/tszIndex', query: {'storeId': store && store.storeId}}">详情</router-link>
        </div>
        <div class="store360__order" v-if="store && activityVo">
          <div class="flex items-center">
            <p class="title flex-auto">{{activityVo.activityCode}}</p>
            <p class="color-999">{{activityVo.createTimestamp | datetime('YYYY/MM/DD')}} {{activityVo.createByName}}</p>
          </div>
          <div class="info">
            <div class="flex items-start">
              <p class="flex-auto mr20">活动名称：{{activityVo.activityTopic}}</p>
              <p class="state">{{activityVo.activityStateDesc}}</p>
            </div>
            <p class="mt5">活动日期：{{activityVo.startDate | datetime('YYYY/MM/DD')}}-{{activityVo.endDate | datetime('YYYY/MM/DD')}}</p>
            <p class="mt5">门店资源总数：{{activityVo.totalResource}}，参与活动品种数：{{activityVo.totalMateriel}}</p>
          </div>
        </div>
      </section>
      <section class="store360__list__column">
        <div class="column__title">
          <p class="icon storePos"></p>
          <p class="name">本周POS机零售额</p>
          <router-link class="attach" v-if="store" :to="{path: '/store360/pos', query: {'storeId': store && store.storeId}}">详情</router-link>
        </div>
        <ul class="store360__table">
          <li class="row label">
            <div class="item"></div>
            <div class="item" v-for="item in posList">{{item.planDate | datetime('dd')}}<p>{{item.planDate | datetime('DD')}}</p></div>
          </li>
          <li class="row">
            <div class="item flex justify-center items-center"><p>总支数</p></div>
            <p class="item" v-for="item in posList">{{!store ? '' : item.sumNum ? item.sumNum : (item.planDate>currentDate?'':0)}}</p>
          </li>
          <li class="row">
            <div class="item flex justify-center items-center"><p>总金额<br>(万元)</p></div>
            <p class="item" v-for="item in posList">{{!store ? '' : item.sumPrice ? (item.sumPrice/1000000).toFixed(2) : (item.planDate>currentDate?'':0)}}</p>
          </li>
        </ul>
      </section>
      <section class="store360__list__column">
        <div class="column__title">
          <p class="icon organization"></p>
          <p class="name">门店编制</p>
          <router-link class="attach" v-if="store && storeOrgVo" :to="{path: '/storeAuthorized/s360AuDetail', query: {'storeId': store && store.storeId}}">详情</router-link>
        </div>
        <div class="store360__authorized">
          <div class="flex">
            <div class="flex-auto">
              <p class="label">总编制(人)</p>
              <p>{{storeOrgVo && storeOrgVo.sumPerNum ? storeOrgVo.sumPerNum : '无' | formatDefault(store)}}</p>
            </div>
            <div class="flex-auto">
              <p class="label">已到位(人)</p>
              <p>{{storeOrgVo && storeOrgVo.readyPerNum ? storeOrgVo.readyPerNum : '无' | formatDefault(store)}}</p>
            </div>
          </div>
        </div>
      </section>
      <section class="store360__list__column">
        <div class="column__title">
          <p class="icon storeCharge"></p>
          <p class="name">负责人</p>
          <p class="attach" @click="()=>{ this.store && responsibleVo && responsibleVo.proPerNum && this.$router.push('/store360/memberDetail')}">项目成员：
            <span :class="[{'member': store ? true : false, 'disabled': responsibleVo && !responsibleVo.proPerNum }]">{{responsibleVo && responsibleVo.proPerNum ? responsibleVo.proPerNum + '人' : 0 + '人' | formatDefault(store)}}</span>
          </p>
        </div>
        <div class="flex store360__charge">
          <div class="side-wrap">
            <p class="mb10-360">项目经理</p>
            <p :class="['call', {'icon': store && responsibleVo && responsibleVo.managerName ? true : false}]" @click="phone(responsibleVo.managerTel)">{{responsibleVo && responsibleVo.managerName ? responsibleVo.managerName : '无' | formatDefault(store)}}</p>
            <p class="mb10-360">项目总监：{{responsibleVo && responsibleVo.inspectorGeneralName ? responsibleVo.inspectorGeneralName : '无' | formatDefault(store)}}</p>
            <p>项目总经理：{{responsibleVo && responsibleVo.generalManagerName ? responsibleVo.generalManagerName : '无' | formatDefault(store)}}</p>
          </div>
          <div class="side-wrap">
            <p class="mb10-360">业务代表</p>
            <p :class="['call', {'icon': store && responsibleVo && responsibleVo.ywDbName ? true : false}]" @click="phone(responsibleVo.ywDbTel)">{{responsibleVo && responsibleVo.ywDbName ? responsibleVo.ywDbName : '无' | formatDefault(store)}}</p>
            <p class="mb10-360">业务主任：{{responsibleVo && responsibleVo.ywZrName ? responsibleVo.ywZrName : '无' | formatDefault(store)}}</p>
            <p>业务经理：{{responsibleVo && responsibleVo.ywJlName ? responsibleVo.ywJlName : '无' | formatDefault(store)}}</p>
          </div>
          <!--
          <div class="flex">
            <p class="flex-auto">项目总监：{{responsibleVo && responsibleVo.inspectorGeneralName ? responsibleVo.inspectorGeneralName : '无' }}</p>
            <p>项目总经理：{{responsibleVo && responsibleVo.generalManagerName ? responsibleVo.generalManagerName : '无' }}</p>
          </div>
          <div class="flex items-center">
            <p class="person flex-auto">项目经理：{{responsibleVo && responsibleVo.managerName ? responsibleVo.managerName : '无' }}</p>
            <p class="phone" v-if="responsibleVo && responsibleVo.managerTel" @click="phone(responsibleVo.managerTel)">{{responsibleVo.managerTel}}</p>
          </div>
          <div class="flex">
            <p class="flex-auto">项目成员总数：{{responsibleVo && responsibleVo.proPerNum ? responsibleVo.proPerNum : 0}}</p>
            <div class="color-0a85cc underline" to="/store360/memberDetail" v-if="responsibleVo && responsibleVo.proPerNum">查看所有成员</div>
          </div> -->
        </div>
      </section>
      <section class="store360__list__column">
        <div class="column__title">
          <p class="icon storeOther"></p>
          <p class="name">经销商</p>
        </div>
        <div class="store360__charge">
          <div class="flex">
            <p>经销商：</p>
            <p class="flex-auto">{{dlearVo && dlearVo.dlearName ? dlearVo.dlearName : '无' | formatDefault(store)}}</p>
          </div>
          <div class="flex mt13">
            <p class="flex-auto">客服：{{customerServiceVo && customerServiceVo.userName ? customerServiceVo.userCode+'-'+customerServiceVo.userName : '无' | formatDefault(store)}}</p>
            <p class="phone" v-if="store && customerServiceVo && customerServiceVo.tel" @click="phone(customerServiceVo.tel)"></p>
          </div>
        </div>
      </section>
    </div>
  </bm-layout>
</template>
<style lang="less" scoped>
  @iconHeight: .24rem;
  @tableLabelHeight: .42rem;
  @tableContentHeight: .3rem;
  .scrollAuto { -webkit-overflow-scrolling: auto; padding-top: .10rem; }
  .color-0a85cc { color: #0a85cc; }
  .mt5 { margin-top: .05rem; }
  .mt20 { margin-top: .2rem; }
  .mt13 { margin-top: .13rem; }
  .mr20 { margin-right: .2rem; }
  .p10 { padding: .1rem; }
  .f16 { font-size: .16rem; }
  .bg-fff { background-color: #fff; }
  .click-font {
    color: #1fb8ff;
    text-decoration: underline;
  }
  .popupFocus {
    &:after {
      content: '';
      display: block;
      margin: -0.15rem auto 0;
      width: 0;
      height: 0;
      border: .10rem solid transparent;
      border-bottom: .10rem solid #1fb8ff;
      position: relative;
      z-index: 2;
    }
  }
  .popupModal {
    position: absolute;
    margin-top: .32rem;
    width: 1.7rem;
    border-radius: 4px;
    box-shadow: 0 0 15px #999;
    background-color: #fff;
    overflow: hidden;
    .person-list { max-height: 1.8rem; overflow: hidden; overflow-y: auto; }
    li, .line-wrap { height: .30rem; padding: 0 .10rem; text-align: left; }
    .header { background-color: #1fb8ff; color: #fff; }
    .key { flex-shrink: 0; }
  }
  .store360__list__nav {
    padding-right: .1rem;
    font-size: .14rem;
    text-decoration: underline;
    color: #fff;
  }
  .store360__list__search {
    padding: 0 .08rem 0 .24rem;
    background: #fff url('~@/assets/common/search_gray@3x.png') no-repeat .05rem center / .22rem .22rem;
    color: #999;
    font-size: .15rem;
    line-height: 1em;
    height: .50rem;
    border-bottom: 1px solid #d7d7d7;
    .input {
      font-size: .15rem;
      margin-left: .05rem;
      line-height: .16rem;
    }
    .clear {
      width: .24rem;
      height: .24rem;
      display: block;
      background: url('~@/assets/common/close_gray@2x.png') no-repeat center / .24rem .24rem;
    }
    .small { font-size: .12rem; }
    .store-font { color: #333; }
  }
  .store360__list__store {
    position: relative;
    width: 100%;
    margin-bottom: .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    font-size: .15rem;
    color: #333;
    text-align: center;
    line-height: .44rem;
    .store360__sort__left, .store360__sort__right {
      position: absolute;
      top: 0;
      bottom: 0;
      width: .24rem;
    }
    .store360__sort__right {
      right: .1rem;
    }
    .store360__sort__left {
      left: .1rem;
    }
    .store360__pre, .store360__next {
      width: 0;
      height: 0;
      margin: auto .1rem;
      display: inline-block;
      border-top: .05rem solid transparent;
      border-bottom: .05rem solid transparent;
    }
    .store360__pre {
      border-right: .05rem solid rgba(0, 0, 0, .54);
    }
    .store360__next {
      border-left: .05rem solid rgba(0, 0, 0, .54);
    }
  }
  .store360__list__column {
    margin-bottom: .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    &.nothing::after {
      display: block;
      padding: .2rem 0;
      content: '暂无数据';
      color: #999;
      font-size: .16rem;
      text-align: center;
    }
    .column__title {
      display: flex;
      margin: 0 .1rem;
      padding: .1rem 0;
      border-bottom: solid 1px #e5e5e5;
      line-height: @iconHeight;
      .icon {
        width: @iconHeight;
        height: @iconHeight;
        border-radius: 2px;
        background: url('~@/assets/store360/ic_storeCapacity.png') no-repeat center / 66%;
        &.storeSale {
          background-image: url('~@/assets/store360/ic_storeSale.png')
        }
        &.storeOrder {
          background-image: url('~@/assets/store360/ic_storeOrder.png')
        }
        &.storeCheck {
          background-image: url('~@/assets/store360/ic_storeCheck.png')
        }
        &.storeDisplay {
          background-image: url('~@/assets/store360/ic_display.png')
        }
        &.storeDistribution {
          background-image: url('~@/assets/store360/ic_storeDistribution.png')
        }
        &.storeActivity {
          background-image: url('~@/assets/store360/ic_storeActivity.png')
        }
        &.storePos {
          background-image: url('~@/assets/store360/ic_POS.png')
        }
        &.organization {
          background-image: url('~@/assets/store360/ic_organization.png')
        }
        &.storeCharge {
          background-image: url('~@/assets/store360/ic_chargePerson.png')
        }
        &.storeOther {
          background-image: url('~@/assets/store360/ic_storeOther.png')
        }
      }
      .name {
        flex: 1;
        padding: 0 .1rem;
        font-size: .14rem;
        color: #666;
      }
      .attach {
        font-size: .12rem;
        color: #999;
        .member { color: #0a85cc; text-decoration: underline; }
        .disabled { color: #999; text-decoration: none; }
      }
    }
    &:nth-child(3n) {
      .icon {
        background-color: #F8B591;
      }
    }
    &:nth-child(3n-1) {
      .icon {
        background-color: #79D4FF;
      }
    }
    &:nth-child(3n-2) {
      .icon {
        background-color: #9DDA9F;
      }
    }
  }
  .store360__capacity {
    display: flex;
    padding: 0 .1rem;
    color: #333;
    .item {
      flex: 1;
      padding: .14rem 0 .15rem;
      text-align: center;
      font-size: .16rem;
    }
    .label {
      font-size: .12rem;
      color: #666;
    }
  }
  .store360__table {
    background: #fff;
    padding: .1rem 0 .1rem 0;
    .row {
      align-items: center;
      height: .30rem;
      margin: 0 .1rem;
      text-align: center;
      color: #333;
      &.label {
        height: @tableLabelHeight;
        color: #999;
        font-size: .14rem;
        .item { line-height: 1.5em; min-height: 1px; }
      }
      &:nth-child(even) {
        background: #F8F8F8;
      }
      .item {
        width: .36rem;
        height: .30rem;
        line-height: .30rem;
        font-size: .12rem;
        float: left;
        text-align: center;
        &:first-child {
          width: .44rem;
          height: .30rem;
          line-height: 1;
          box-sizing: border-box;
          color: #999;
          font-size: .1rem;
          text-align: center;
          .m_center { margin-top: .05rem; }
        }
      }
    }
  }
  .store360__order {
    padding: .1rem;
    .title {
      padding-left: .34rem;
      padding-right: .14rem;
      font-size: .16rem;
      color: #333;
    }
    .state {
      font-size: .12rem;
      color: #1fb8ff;
    }
    .info {
      padding: .05rem 0 0 .34rem;
      line-height: 1.5em;
      font-size: .12rem;
      color: #666;
    }
    .detail {
      display: flex;
      margin-top: .1rem;
      padding: .1rem;
      background: #f8f8f8;
      color: #666;
      font-size:  .12rem;
      .detail__item {
        flex: 1;
        padding-left: .26rem;
      }
      &.line {
        .detail__item {
          border-right: solid 1px #e5e5e5;
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
  .label {
    padding-bottom: .05rem;
    color: #999;
    font-size: .12rem;
  }
  .store360__authorized {
    padding: .15rem .1rem;
    color: #333;
    font-size: .16rem;
    text-align: center;
  }
  .store360__charge {
    padding: .15rem .1rem .15rem .44rem;
    font-size: .12rem;
    color: #666;
    position: relative;
    .side-wrap { flex: 1; }
    .call {
      display: inline-block;
      font-size: .16rem;
      height: .36rem;
      padding-right: .28rem;
      line-height: .18rem;
      &.icon {
        color: #1fb8ff;
        background: url('~@/assets/store360/callOut@2x.png') no-repeat right top / .18rem .18rem;
      }
    }
    .mb10-360 { margin-bottom: .10rem; }
    .person {
      margin: .16rem 0;
      font-size: .16rem;
      color: #333;
    }
    .phone {
      padding-right: .23rem;
      background: url('~@/assets/store360/callOut@2x.png') no-repeat right center / .18rem .18rem;
      color: #1fb8ff;
      background-size: contain;
      line-height: .18rem;
    }
  }
</style>
<script>
  import api from '@/api'
  import { mapGetters } from 'vuex'
  import { zeroTs } from '@/advanced/filters'
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectStore from '../common/selectStore'

  let initDay = function () {
    let now = new Date()
    let time = now.getTime()
    let day = now.getDay()
    let tmpArr = Array.from({ length: 7 }).map((e, i) => {
      let d = i === 0 ? 7 : i
      return {
        planDate: time + (d - day) * 24 * 60 * 60 * 1000
      }
    })
    return tmpArr.slice(1).concat(tmpArr[0])
  }

  export default {
    data () {
      return {
        capacityVo: null,    // 门店信息
        orderVo: null,       // 门店订单
        saleList: initDay(),        // 销售提报
        inspectVo: null,     // 陈列巡检
        marketPollingVo: null,   // 分销巡检
        storePKVo: null,     // 库存盘点
        activityVo: null,    // 活动执行
        posList: initDay(),         // POS机
        storeOrgVo: null,    // 门店编制
        customerServiceVo: null,  // 客服
        dlearVo: null,       // 经销商
        responsibleVo: null,  // 负责人
        currentDate: zeroTs(),
        currentPopup: '',     // 当前触发的popup
        isShowPop: false,
        currentPersonList: []
      }
    },
    filters: {
      formatDefault (value, store) {
        return store ? value : '--'
      },
      formatNumber (value) {
        let val = Number(value) || 0
        return val > 9999 ? '9999+' : val
      }
    },
    computed: {
      ...mapGetters({
        storeList: 'store360/storeList',
        store: 'store360/store',
        isResult: 'store360/isResult',
        activeStoreIndex: 'store360/activeStoreIndex'
      })
    },
    methods: {
      getStore360List1 (storeId) {
        api.store360.getStore360List1({
          data: {
            storeId: storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.capacityVo = res.capacityVo || null
            this.orderVo = res.orderVo || null
            this.saleList = res.saleList || null
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      getStore360List2 (storeId) {
        api.store360.getStore360List2({
          data: {
            storeId: storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.inspectVo = res.inspectVo || null
            this.marketPollingVo = res.marketPollingVo || null
            this.storePKVo = res.storePKVo || null
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      getStore360List3 (storeId) {
        api.store360.getStore360List3({
          data: {
            storeId: storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.activityVo = res.activityVo || null
            this.posList = res.posList || null
            this.storeOrgVo = res.storeOrgVo || null
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      getStore360List4 (storeId) {
        api.store360.getStore360List4({
          data: {
            storeId: storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.customerServiceVo = res.customerServiceVo || null
            this.dlearVo = res.dlearVo || null
            this.responsibleVo = res.responsibleVo || null
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      getAllInfo (storeId) {
        if (storeId) {
          this.getStore360List1(storeId)
          this.getStore360List2(storeId)
          this.getStore360List3(storeId)
          this.getStore360List4(storeId)
        }
      },
      nextStore () {
        if (this.activeStoreIndex < this.storeList.length - 1) {
          this.$store.commit('store360/activeStoreIndex', this.activeStoreIndex + 1)
        }
      },
      preStore () {
        if (this.activeStoreIndex > 0) {
          this.$store.commit('store360/activeStoreIndex', this.activeStoreIndex - 1)
        }
      },
      selectStore () {
        BmSelectPage({
          component: selectStore,
          optins: {}
        }).then(data => {
          this.$store.commit('store360/store', data)
          this.$store.commit('store360/isResult', true)
        }, () => {})
      },
      clearSearch () {
        // this.$store.commit('store360/store', this.storeList[this.activeStoreIndex])
        this.$store.commit('store360/store', null)
        this.$store.commit('store360/isResult', false)
        this.capacityVo = null
        this.orderVo = null
        this.saleList = initDay()
        this.inspectVo = null
        this.marketPollingVo = null
        this.storePKVo = null
        this.activityVo = null
        this.posList = initDay()
        this.storeOrgVo = null
        this.customerServiceVo = null
        this.dlearVo = null
        this.responsibleVo = null
        this.currentDate = zeroTs()
      },
      phone (phone) {
        if (!phone) { return }
        window.location.href = 'tel:' + phone
      },
      togglePopup: (function () {  // 显示/隐藏弹层
        let _popupWidth = 0
        let _widowsWidth = 0
        return function (status, strId, item, event) {
          if (item && !item.personNum) {
            return this.closePopup()
          }
          this.currentPopup = strId
          this.isShowPop = status
          if (status && event) {
            // 降序数组
            let personList = [].concat(this.saleList[strId.slice(4)].personList)
            personList.sort((a, b) => {
              return a.actuNum < b.actuNum
            })
            this.currentPersonList = personList
            let left = Number(event.target.offsetLeft)
            let pop = this.$refs.pop
            if (!_widowsWidth) {
              _widowsWidth = this.$refs.layout.$el.offsetWidth
            }
            if (!_popupWidth) {
              _popupWidth = _widowsWidth / 3.2 * 1.7
            }
            if (left + _popupWidth > _widowsWidth - 10) {
              left = _widowsWidth - _popupWidth - 10
            } else {
              left -= 10
            }
            pop.style.left = left + 'px'
          }
        }
      })(),
      closePopup () {
        this.togglePopup(false, '')
      }
    },
    watch: {
      // 切换门店时更新当前门店的信息
      store (value) {
        if (value && value.storeId) {
          this.getAllInfo(value.storeId) // 每次更换门店刷新数据
        }
      }
    },
    created () {
      // 当前门店无实体时，则重新获取门店列表，否则只刷新当前门店信息
      if (!this.store) {
        // this.$store.dispatch('store360/fetchStoreList').then(res => {
        //   if (this.store) this.getAllInfo(this.store.storeId)
        //   this.$nextTick(() => {
        //     this.$refs.layout.scrollToElementFixedTop()
        //   })
        // })
      } else {
        this.getAllInfo(this.store.storeId)
        this.$nextTick(() => {
          this.$refs.layout.scrollToElementFixedTop()
        })
      }
    },
    mounted () {
      let layout = this.$refs.layout.$el
      layout.addEventListener('click', this.closePopup)
    },
    beforeDestroy () {
      let layout = this.$refs.layout.$el
      layout.removeEventListener('click', this.closePopup)
    }
  }
</script>
