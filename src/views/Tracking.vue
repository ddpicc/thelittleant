<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col
				cols="12"
				sm="8"
				md="8"
			>
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
        <v-card class="mx-auto">
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
        </v-card>
    	</v-col>
		</v-row>
	</v-container>
</template>

<script>
  export default {
    data () {
      return {
				queryPackageNm: '',
        displayTackingInfo: false,
        trackingInfo: {
          title: '运单信息',
          statusList: []
				}
			}
		},

		methods: {
			packageTrack: function(){
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
            if(res.data[0].to_country_code === 'USA +1'){
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
    },
  }
</script>
