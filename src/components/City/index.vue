<template>
    <div class="city_body">
        <div class="city_list">
          <Loading v-if="isLoading"></Loading>
          <Scroller v-else ref="city_List">
            <div>
              <div class="city_hot">
                  <h2>热门城市</h2>
                  <ul class="clearfix">
                      <li v-for="item of hotList" :key="item.id" @tap="handleToCity(item.nm, item.id)">{{item.nm}}</li>
                  </ul>
              </div>
              <div class="city_sort" ref="city_sort">
                  <div v-for="item of cityList" :key="item.index">
                      <h2>{{item.index}}</h2>
                      <ul>
                          <li v-for="list of item.list" :key="list.id" @tap="handleToCity(list.nm, list.id)">{{list.nm}}</li>
                      </ul>
                  </div>
              </div>
            </div>
          </Scroller>
        </div>
        <div class="city_index">
            <ul>
                <li v-for="(item, index) of cityList" @touchstart="handleToIndex(index)" :key="item.index">{{item.index}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "City",
        data() {
          return {
              cityList: [],
              hotList: [],
              isLoading: true
          }
        },
        mounted() {
          let cityList = JSON.parse(localStorage.getItem('cityList'));
          let hotList = JSON.parse(localStorage.getItem('hotList'));

          if (cityList && hotList){   // 看下本地存储中有没有保存城市列表和热门城市
              this.cityList = cityList;
              this.hotList = hotList;
              this.isLoading = false;
          } else {                  // 本地存储中没有找到城市列表和热门城市
            this.axios.get('/api/cityList').then((res) => {
                var msg = res.data.msg;
                if (msg === 'ok') {
                    var cities = res.data.data.cities;
                    // 想要的数据格式
                    // [{index: 'A', list: [{nm: '阿城', id: '123'}]}]
                    // 获取到的数据需要格式化
                    var {cityList, hotList} = this.formatCityList(cities);
                    this.cityList = cityList;
                    this.hotList = hotList;
                    window.localStorage.setItem('cityList', JSON.stringify(cityList));
                    window.localStorage.setItem('hotList', JSON.stringify(hotList));
                    this.isLoading = false;
                }
            });
          }
        },
        methods: {
            // 把获取到的cities数组数据格式化为：[{index: 'A', list: [{nm: '阿城', id: '123'}]}]
            formatCityList(cities) {
                // 准备2个结果集来存放数据
                var cityList = [];
                var hotList = [];

                for (var i = 0; i < cities.length; i++) {
                    if (cities[i].isHot === 1) {
                        hotList.push({ id: cities[i].id, nm: cities[i].nm})
                    }
                }

                for (var i = 0; i < cities.length; i++) {
                    var firstLetter = cities[i].py.slice(0, 1).toUpperCase();   // 拼音首字母（大写）
                    if (toCom(firstLetter)) {   // 新添加index
                        cityList.push({index: firstLetter, list: [{nm: cities[i].nm, id: cities[i].id}]})
                    } else {        // 追加到已有index
                        for (var j = 0; j < cityList.length; j++) {
                            if (cityList[j].index === firstLetter) {
                                cityList[j].list.push({nm: cities[i].nm, id: cities[i].id})
                            }
                        }
                    }
                }

                // 添加到cityList中的数据按照index排序，数组排序
                cityList.sort((n1, n2) => {
                    if (n1.index < n2.index) {
                        return -1;
                    } else if (n1.index > n2.index) {
                        return 1;
                    } else {
                        return 0;
                    }
                })

                // 判断是新添加index，还是往已经存在的index中添加数据
                function toCom(firstLetter){
                    for (var i = 0; i < cityList.length; i++) {
                        if (cityList[i].index === firstLetter) {
                            return false;
                        }
                    }
                    return true;
                }
                // console.log( cityList );
                // console.log( hotList );
                return {cityList, hotList}
            },
            // 点击索引页面进行滚动
            handleToIndex(index) {
                // console.log(index);
                var h2 = this.$refs.city_sort.getElementsByTagName('h2');
                // 让city_list滚动到对应索引
                // this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;

                this.$refs.city_List.toScrollTop(-h2[index].offsetTop);
            },
            handleToCity(nm, id) {
              // 改变状态管理
              this.$store.commit('city/CITY_INFO', {nm, id});
              window.localStorage.setItem('nowNm', nm);
              window.localStorage.setItem('nowId', id);
              this.$router.push('movie/nowPlaying')
            }
        }
    }
</script>

<style scoped>
    #content .city_body{ margin-top: 45px; display: flex; width:100%; position: absolute; top: 0; bottom: 0;}
    .city_body .city_list{ flex:1; overflow: auto; background: #FFF5F0;}
    .city_body .city_list::-webkit-scrollbar{
        background-color:transparent;
        width:0;
    }
    .city_body .city_hot{ margin-top: 20px;}
    .city_body .city_hot h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
    .city_body .city_hot ul{}
    .city_body .city_hot ul li{ float: left; background: #fff; width: 29%; height: 33px; margin-top: 15px; margin-left: 3%; padding: 0 4px; border: 1px solid #e6e6e6; border-radius: 3px; line-height: 33px; text-align: center; box-sizing: border-box;}
    .city_body .city_sort{}
    .city_body .city_sort div{ margin-top: 20px;}
    .city_body .city_sort h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
    .city_body .city_sort ul{ padding-left: 10px; margin-top: 10px;}
    .city_body .city_sort ul li{ line-height: 30px; line-height: 30px;}
    .city_body .city_index{ width:20px; display: flex; flex-direction:column; justify-content:center; text-align: center; border-left:1px #e6e6e6 solid;}

</style>
