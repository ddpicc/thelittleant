<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row>
      <v-col cols="12">
        <v-item-group mandatory active-class="primary" v-model="targetWarehouse">
          <v-row>
            <v-col v-for="warehouse in warehouseList"
              :key="warehouse.id"
              cols="12"
              md="4"
            >
              <v-item v-slot="{ active, toggle }">
                <v-card
                  class="pa-3"
                  height="180"
                  @click="toggle"
                >
                  <div class="title">{{ warehouse.alias }}</div>
                  <div>First Name：{{ warehouse.first_name }} Last Name：{{ warehouse.last_name }}</div>
                  <div>城市：{{ warehouse.city }} 州/省：{{ warehouse.state }}</div>
                  <div>地址：{{ warehouse.address }}</div>
                  <div>门牌号：{{ warehouse.door_number }} (必填）</div>
                  <div>邮编：{{ warehouse.zip }} 电话：{{ warehouse.phone }}</div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-col>
      <v-col cols="12">
        <material-card>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              v-model="trackingNo"
              :rules="requiredRules"
              label="美国境内运单号"
              required
            ></v-text-field>

            <v-text-field
              v-model="carrier"
              :rules="requiredRules"
              label="快递配送服务"
              required
            ></v-text-field>

            <v-text-field
              v-model="forcastWeight"
              label="物品预估重量（磅LB）"
            ></v-text-field>
            
            <v-text-field
              v-model="forcastArriveTime"
              label="预计到达时间"
            ></v-text-field>
            
            <v-checkbox
              v-model="needPhoto"
              label="是否需要拍照(需要拍照请点击勾选方框)"
            ></v-checkbox>


            <v-checkbox
              v-model="needSplit"
              label="是否需要分箱合箱操作"
            ></v-checkbox>

            <v-textarea
              v-model="comment"
              label="留言"
            ></v-textarea>

            <v-btn
              color="success"
              class="mr-4"
              @click="validate"
            >
              提交包裹
            </v-btn>

          </v-form>
          
				</material-card>
			</v-col>
		</v-row>
    
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
    data: () => ({
      valid: true,
      targetWarehouse: '',
      trackingNo: '',
      carrier: '',
      requiredRules: [
        v => !!v || '必填',
      ],
      forcastWeight: '',
      forcastArriveTime: '',
      needPhoto: false,
      needSplit: false,
      comment: '',

      warehouseList: [],

      snackbar: false,
      snackbarColor: '',
      notification: '',
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
        this.$http.post('/api/package/createForcastInfo',{
          forcast_tracking : this.trackingNo,
          carrier : this.carrier,
          target_warehouse: this.targetWarehouse,
          forcast_weight : this.forcastWeight,
          arrive_at : new Date().getTime(),
          need_photo: this.needPhoto,
          need_split: this.needSplit,
          comment : this.comment,
          storage_number: this.$store.state.user.storage_number,
          service_type: '国际转运',
        }).then( (res) => {
          this.snackbar = true;
					this.notification = '预报成功';
					this.snackbarColor = 'green';
          this.$refs.form.reset()
        })
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },

      getAll: function() {
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