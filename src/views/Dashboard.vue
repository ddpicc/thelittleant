<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
          height="386px"
        >
          <v-img
            class="white--text align-end"
            height="266px"
            src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?cs=srgb&dl=pexels-chanaka-906494.jpg&fm=jpg"
          >
          </v-img>
          <v-card-title>北美免税仓</v-card-title>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
          height="386px"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">个人信息</div>
              <v-list-item-title class="headline mb-1">
                {{userName}}                
              </v-list-item-title>
              <v-divider
                class="mx-4"
              ></v-divider>
              <br>
              <br>
              <div v-if="roles == 'default'" class="mx-2">普通用户<!-- <v-chip dark class="ml-3" @click="jumpToAccountUpgrade">升级</v-chip> --></div>
              <div v-if="roles == 'premium'" class="mx-2">高级用户<!-- <v-chip dark class="ml-3" @click="jumpToAccountUpgrade">更改</v-chip> --></div>
              <div v-if="roles == 'admin'" class="mx-2">管理员</div>
              <br>
              <div class="mx-2">用户识别码： {{storeNm}}</div>
              <div class="mx-2">手机号码：{{phoneNm}}</div>
              <div class="mx-2">账户余额： {{balance}} 元 &nbsp;&nbsp; <span v-if="this.$store.state.user.balance < 3" style="color: red">余额不足，请尽快充值</span></div>
              <br>
              <br>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-btn text @click="jumpToDeposit">充值</v-btn>
            <v-btn text @click="jumpToRecipientsList">收件人管理</v-btn>
            <v-btn text @click="jumpToInvoiceList">交易记录</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
          height="386px"
        >
          <v-list rounded>
            <v-subheader>美国代收地址</v-subheader>

              <v-list-item
                v-for="warehouse in warehouseList"
                :key="warehouse.id"
              >
                <v-list-item-content>
                  <v-list-item-title class="clickList" @click="showAddress(warehouse)">{{ warehouse.alias }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

          </v-list>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
          height="386px"
        >
          <v-card-text class="text--primary">
            <h3>新闻资讯</h3>
            <v-divider></v-divider>
            <v-list three-line dense>
              <v-list-item
                v-for="item in infos"
                :key="item.id"
              >
                <v-list-item-content>
                  <v-list-item-title><h3>{{item.title}}</h3></v-list-item-title>
                  <v-list-item-subtitle><a @click="viewPage(item)" style='color:blue;text-decoration:underline'>{{item.summary}} </a></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>            
          </v-card-text>
          <v-card-actions class="justify-center">
              <v-pagination
                v-model="page"
                :length="6"
                :total-visible="5"
              ></v-pagination>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="blogDialog"
      width="1200"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{title}}
        </v-card-title>

        <v-card-text v-html="content" class="mt-8">
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="blogDialog = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addressDialog"
      width="500"
    >
      <v-card class="pa-5">
        <div class="title">{{ theWarehouse.alias }}</div>
        <div>First Name：{{ theWarehouse.first_name }} Last Name：{{ theWarehouse.last_name }}</div>
        <div>城市：{{ theWarehouse.city }} 州/省：{{ theWarehouse.state }}</div>
        <div>地址：{{ theWarehouse.address }}</div>
        <div>门牌号：{{ theWarehouse.door_number }} (必填）</div>
        <div>邮编：{{ theWarehouse.zip }} 电话：{{ theWarehouse.phone }}</div>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="addressDialog = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      top
      dark
    >
      <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      {{notification}}
      <v-btn
        icon
        @click="snackbar = false"
      >
        <v-icon>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        userName: this.$store.state.user.name,
        storeNm: this.$store.state.user.storage_number,
        balance: this.$store.state.user.balance,
        roles: this.$store.state.user.roles,
        phoneNm: '',
        snackbar: false,
        snackbarColor: '',
        notification: '',
        infos: [],
        page: 1,
        blogDialog: false,
        addressDialog: false,
        title: '',
        content: '',
        warehouseList: [],
        theWarehouse: {},
      }
    },

    methods: {
      focus(event) {
        event.currentTarget.select();
      },

      jumpToRecipientsList: function(){
        //alert(this.$store.state.user.name);
        this.$router.push({ path: '/recipients' });
      },

      jumpToInvoiceList: function(){
        this.$router.push({ path: '/invoice' });
      },

      jumpToDeposit: function(){
        this.$router.push({ path: '/deposit' });
      },

      jumpToAccountUpgrade: function(){        
        this.$router.push({ path: '/account/upgrade' });
      },

      showAddress: function(item){
        
        this.addressDialog = true
        this.theWarehouse = item
        //Object.assign(this.theWarehouse,item)
        
      },

      viewPage: function(item){
        this.blogDialog = true;
        this.title = item.title;
        this.content = item.content;
      },


      getAll: function() {
        this.$http.get('/api/getUserInfoById',{
          params: {
						userId : this.$store.state.user.user_id,
					}
        }).then( (res) => {
          this.phoneNm = res.data[0].user_phone;
        }),

        this.$http.get('/api/news/getAllNews').then( (res) => {
          this.infos = res.data;
        });

        this.$http.get('/api/getWarehouseAddress').then( (res) => {
          this.warehouseList = res.data
        })
      },

    },

    mounted: function() {
      this.getAll();
		}
  }
</script>
<style scoped>
  .clickList{
    cursor: pointer;
  }
</style>

