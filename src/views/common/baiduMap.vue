<template>
  <bm-layout>
    <bm-header>门店地图</bm-header>
    <div id="allmap"></div>
  </bm-layout>
</template>
<style lang="less" scoped>
  #allmap {
    width: 100%;
    height: 568px;
    background: #f2f2f2;
  }
</style>
<script>
  export default {
    data () {
      return {
        map: {},
        timer: null,
        timerCount: 0,
        point: null,
        gpsLongitude: 0,
        gpsLatitude: 0
      }
    },
    mounted () {
      if (this.$route.query.gpsLatitude) {
        this.gpsLatitude = this.$route.query.gpsLatitude
      }
      if (this.$route.query.gpsLongitude) {
        this.gpsLongitude = this.$route.query.gpsLongitude
      }
      if (window.BMap) {
        this.map = new BMap.Map('allmap')
        this.point = new BMap.Point(this.gpsLongitude, this.gpsLatitude)
        this.map.centerAndZoom(this.point, 11)
        this.map.enableScrollWheelZoom(true)
        var marker = new BMap.Marker(this.point)  // 创建标注
        this.map.addOverlay(marker)             // 将标注添加到地图中
        this.map.panTo(this.point)
      }
    }
  }
</script>

