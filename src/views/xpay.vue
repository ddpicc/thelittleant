<template>
  <div class="pay" v-loading="loading">
    <v-card class="pa-5">
      <v-img height="200" width="200" :src="qrUrl"/>
      <v-btn @click="checkPay">充值完成</v-btn>
    </v-card>
  </div>
</template>
<script>
import QRCode from 'qrcode'
export default {
  data(){
    return {
      loading: true,
      qrUrl: '',
      theOrderId: null,
    }
  },
  mounted(){
    this.theOrderId = 'xorPay' + new Date().getTime()
    this.$http.post('/api/handlexpay',{   
      price : this.$route.params.amount,
      order_id : this.theOrderId,
      name : '用户充值',
      more : this.$route.params.storageNm,
    }).then( (res) => {
      console.log(res.data.info['qr'])
      QRCode.toDataURL(res.data.info['qr'])
      .then(url => {
        console.log(url)
        this.qrUrl = url
      })
      .catch(err => {
        console.error(err)
      })
    })
  },
  methods:{
    checkPay: function(){
      return new Promise (( resolve, reject) => {
        this.$http.get('/api/existTheInvoice',{
          params: {
            theOrderId: this.theOrderId,
          }
        }).then( (res) => {
          if(res.data.length === 0){
            alert('没有检查到充值记录，如果您确定已支付，请联系管理员')
            resolve(0);
          }else{
            resolve(this.theOrderId);
            this.$router.push({ path: '/deposit' });
          }
        }).catch(function (error) {
          console.log(error);
          reject(error);
        });
      })
    }
  },
}
</script>
 