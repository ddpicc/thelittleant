<template>
<div id="app">
  <v-app>
    <v-app-bar
      app
      color="white"
      height="50"
    >
      <v-avatar
        class="mr-3"
        color="grey lighten-5"
        size="50"
      >
        <v-img
          contain
          max-height="100%"
          src="../assets/logo1.png"
        ></v-img>
      </v-avatar>
      <v-spacer />

      <v-toolbar-items>
        <v-row
          align="center"
        >
          <v-btn
            text
            @click="toTrack"
          >
            运单查询
          </v-btn>
          <v-menu open-on-hover top offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-bind="attrs"
                v-on="on"
              >
                {{changeLgTitle}}
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="localeToEn">
                <v-list-item-title> English </v-list-item-title>
              </v-list-item>
              <v-list-item @click="localeToCn">
                <v-list-item-title> 中文 </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            text
            to="/login"
          >
            {{ $t('lang.login_menu')}}
          </v-btn>
        </v-row>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <section id="hero">
        <v-row no-gutters>
          <v-img
            :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
            src="https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?cs=srgb&dl=pexels-pixabay-262353.jpg&fm=jpg"
          >
            <v-theme-provider dark>
              <v-container fill-height>
                <v-row
                  align="center"
                  class="white--text mx-auto"
                  justify="center"
                >
                  <v-col
                    class="white--text text-"
                    cols="12"
                    tag="h1"
                  >
                    <span
                      class="font-weight-light"
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                    >
                      WELCOME TO
                    </span>

                    <br>

                    <span
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                      class="font-weight-black"
                    >
                      {{ $t('lang.home')}}
                    </span>

                  </v-col>

                  <v-btn
                    class="align-self-end"
                    fab
                    outlined
                    @click="$vuetify.goTo('#track')"
                  >
                    <v-icon>mdi-chevron-double-down</v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-theme-provider>
          </v-img>
        </v-row>
      </section>

      <section id="track">
        <div class="py-12"></div>

        <v-container>
          <h2 class="display-2 font-weight-bold mb-3 text-uppercase text-center">运单追踪</h2>

          <v-responsive
            class="mx-auto mb-12"
            width="26"
          >
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col>
              <v-text-field
                solo-inverted
                flat
                hide-details
                label="请输入运单号进行查询"
                prepend-inner-icon="mdi-magnify"
                v-model="queryPackageNm"
                @click:prepend-inner="packageTrack"
                @keyup.enter.native="packageTrack"
              ></v-text-field>
              <div v-if="displayTackingInfo" class="trackingSection">
                <h2
                  class="font-weight-black mt-4 mb-4 text-center"
                  v-text="trackingInfo.title"
                ></h2>

                <div v-for="historyLine in trackingInfo.statusList"
                  :key="historyLine.key"
                  class="title font-weight-light mb-5 text-center"
                  v-html="historyLine"
                ></div>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section
        id="features"
        class="grey lighten-3"
      >
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">我们的功能</h2>

          <v-responsive
            class="mx-auto mb-12"
            width="26"
          >
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              v-for="({ icon, title, text }, i) in features"
              :key="i"
              cols="12"
              md="4"
            >
              <v-card
                class="py-12 px-4"
                color="grey lighten-5"
                flat
              >
                <v-theme-provider dark>
                  <div>
                    <v-avatar
                      color="primary"
                      size="88"
                    >
                      <v-icon
                        large
                        v-text="icon"
                      ></v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  v-text="title"
                ></v-card-title>

                <v-card-text
                  class="subtitle-1"
                  v-text="text"
                >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section id="stats">
        <v-parallax
          :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
          src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=401&q=80"
        >
          <v-container fill-height>
            <v-row class="mx-auto">
              <v-col
                v-for="[value, title] of stats"
                :key="title"
                cols="12"
                md="3"
              >
                <div class="text-center">
                  <div
                    class="display-3 font-weight-black mb-4"
                    v-text="value"
                  ></div>

                  <div
                    class="title font-weight-regular text-uppercase"
                    v-text="title"
                  ></div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-parallax>
      </section>

      <section
        id="about us"
        class="grey lighten-3"
      >
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">关于我们</h2>

          <v-responsive
            class="mx-auto mb-12"
            width="26"
          >
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>
          <v-row justify="center">
            <v-col cols="8">
              <div class="title font-weight-light mb-5 text-left">
                抱抱转运公司致力于从事中美之间的物流运输、国际快递、仓库存储及跨境电子商务等业务。通过整合美国境内仓储、国际航空货运与中国入境快件口岸资源，
                为广大的国内个人、海外微商、淘宝卖家，亚马逊跨境电商等，提供购货、仓储、快递到手的一条龙全站式服务。 通过完备的线上系统
                为广大客户提供高效、快捷的全自助服务，以方便简易的方式帮客户解决货物管理，订单管理等问题，真正实现货物的仓储，物流全过程透明化追踪。
              </div>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>

      <section id="blog">
        <div class="py-12"></div>

        <v-container>
          <h2 class="display-2 font-weight-bold mb-3 text-uppercase text-center">相关文章</h2>

          <v-responsive
            class="mx-auto mb-12"
            width="26"
          >
            <v-divider class="mb-1"></v-divider>

            <v-divider></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-img
                src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                class="mb-4"
                height="275"
                max-width="100%"
              ></v-img>

              <h3
                class="font-weight-black mb-4 text-uppercase"
              >联系我们</h3>

              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="title font-weight-light mb-5">
                    公司地址： 800 Plant St, Wilmington, DE, 19801
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-avatar
                  tile
                  size="100"
                  color="grey"
                ><v-img src="../assets/wechatcode.jpg"></v-img></v-list-item-avatar>
              </v-list-item>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-img
                src="https://images.unsplash.com/photo-1416339442236-8ceb164046f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1892&q=80"
                class="mb-4"
                height="275"
                max-width="100%"
              ></v-img>

              <h3
                class="font-weight-black mb-4 text-uppercase"
              >新手攻略</h3>

              <div class="title font-weight-light mb-5">
                国际转运（到中国）
                <ol>
                  <li>在您需要购物的网站上下订单，订单的收件地址请填写我们公司的仓库地址</li>
                  <li>在官网登陆您的账户，填写您需要我们帮您转运到达的收件地址，以及包裹信息和中国</li>
                </ol>                  
              </div>

              <v-btn
                class=" font-weight-black"
                text
                outlined
              >
                继续阅读
              </v-btn>
            </v-col>
            <v-col class="d-inline-flex justify-center">
              <v-btn
                class="font-weight-black"
                text
                x-large
                outlined
                @click="toBlogPage"
              >
                查看更多
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>
    </v-content>
    <v-footer
      color="#292929"
      padless
    >
      <v-row
        no-gutters
        justify-center
      >
        <v-col cols="6">
          <v-btn
            color="white"
            text
            rounded
            class="my-2"
            v-for="link in links" 
            :key="link"
          >
            {{link}}
          </v-btn>
        </v-col>
        <v-col
          class="white--text mt-3"
          cols="5"
          align="right"
        >
          <p>&copy; 2019 - {{ (new Date()).getFullYear() }}  抱抱转运</p>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
 </div>
</template>

<script>
  export default {
    data () {
      return {
        features: [
          {
            icon: 'mdi-account-group-outline',
            title: '快捷高效',
            text: '快速报关，让您更快收到你的物品',
          },
          {
            icon: 'mdi-update',
            title: '人性服务',
            text: '人工客服，全心全意为您排忧解难',
          },
          {
            icon: 'mdi-shield-outline',
            title: '安全保障',
            text: '全程追踪，让您了解你包裹的一举一动',
          },
        ],
        stats: [
          ['500+', '客户'],
          ['5000/月', '包裹'],
          ['3000平', '仓库'],
          ['30+', '路线'],
        ],
        links: [
          /* '关于我们',
          '联系我们',
          '新手攻略', */
        ],
        changeLgTitle: this.$i18n.locale == 'zh'? '中文' : 'English',
        queryPackageNm: '',
        displayTackingInfo: false,
        trackingInfo: {
          title: '运单信息',
          statusList: []
        }
      }
    },
    methods: {
      localeToEn: function(){
        this.$i18n.locale = 'en';
        this.changeLgTitle = 'English';
      },

      localeToCn: function(){
        this.$i18n.locale = 'zh';
        this.changeLgTitle = '中文';
      },

      toTrack: function(){
        document.querySelector("#track").scrollIntoView(true);
      },

      toBlogPage: function(){
        this.$router.push({ path: '/blogPage' });
      },

      packageTrack: async function(){
        this.displayTackingInfo = true;
        this.trackingInfo.statusList = [];
        if(!this.queryPackageNm){
          return;
        }

        this.$http.get('/api/existUserPackageByLittleAntTracking',{
          params: {
            littleant_tracking: this.queryPackageNm,
          }
        }).then( (res) => {
          if(res.data.length === 0){
            this.trackingInfo.statusList.push('运单不存在');
          }else{
            let lta_id = '';
            //运单存在，先获取运单所在的batch
            this.trackingInfo.statusList.push('运单已创建，等待库房处理');
            if(res.data[0].finishprocess_time != null){
              this.trackingInfo.statusList.push('库房正在处理 (' + new Date(res.data[0].finishprocess_time).toLocaleString() + ')');
              this.trackingInfo.statusList.push('库房打包完成 (' + new Date(res.data[0].finishprocess_time).toLocaleString() + ')');
            }
            if(res.data[0].to_country_code == 'USA +1'){
              lta_id = res.data[0].id;
              this.$http.get('/api/getVendorTracking',{
                params: {
                  package_id : lta_id,
                }
              }).then( (res) => {
                this.trackingInfo.statusList.push('包裹已交付' + res.data[0].vendor + ' (' + res.data[0].vendor_tracking_number + ')');
              })
            }else{
              this.$http.get('/api/getMailBagStatusByLtaTracking',{
                params: {
                  lta_tracking : this.queryPackageNm,
                }
              }).then( (res) => {
                lta_id = res.data[0].id;
                if(res.data[0].sendOut_at != null){
                  this.trackingInfo.statusList.push('包裹处理完毕 (' + new Date(res.data[0].sendOut_at).toLocaleString() + ')');
                }
                let startPush = false
                this.$http.get('/getTracking/index',{
                  params: {
                    search: res.data[0].vendor_tracking_number,
                  }
                }).then( (res) => {
                  if(res.data.code == 200){
                    let qqArry = res.data.data.h0_trace
                    console.log(qqArry)
                    for(let i=0; i<qqArry.length; i++){
                      if(qqArry[i].trace_name.indexOf('已安排批次') != -1){
                        startPush = true
                      }
                      if(startPush){
                        this.trackingInfo.statusList.push(qqArry[i].trace_name + '(' + qqArry[i].trace_time + ')')
                      }
                    }
                  }
                })
              })
            }
          }
        })
      }
    }
  }
</script>

<style>

</style>