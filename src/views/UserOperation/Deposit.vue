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
        <v-card class="mx-auto">
					<v-col>
						充值时遇到问题或不成功请及时联系客服
					</v-col>
					<v-row>
						<v-col cols="3">
							<v-subheader>充值账户</v-subheader>
						</v-col>
						<v-col cols="8">
							<v-text-field
								label="名称"
								:value="accountStr()"
								readonly
							></v-text-field>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="3">
							<v-subheader>自定义金额$</v-subheader>
						</v-col>
						<v-col cols="8">
							<v-text-field
								label="金额"
								v-model="depositAmount"
								suffix="人民币"
								@focus="focus($event)"
							></v-text-field>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="3">
							<v-subheader>支付方式</v-subheader>
						</v-col>
						<v-col cols="8">
							<v-select v-model="paymentMethod" 
								:items="paymentMethodList"
							></v-select>
						</v-col>
					</v-row>
					<v-card-actions>
						<v-btn block color="blue" @click.stop="deposit()">点击充值</v-btn>
					</v-card-actions>
        </v-card>
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
	import QRCode from 'qrcode'
  export default {
    data: () => ({
			paymentMethodList: ['微信支付', '支付宝'],
			paymentMethod: '微信支付',
			depositAmount: 0,
			snackbar: false,
			snackbarColor: '',
			notification: '',			
		}),

		methods:{
			focus(event) {
        event.currentTarget.select();
			},

			accountStr: function(){
				return this.$store.state.user.name + '  (' + this.$store.state.user.storage_number + ')';
			},

			checkIsNumber: function(val) {
				if (parseFloat(val).toString() == "NaN") {
					return false;
				} else {
					return true;
				}
			},

			deposit: function(){
				if(this.checkIsNumber(this.depositAmount)){
					this.$router.push({ name: 'xPay', params: 
						{
							amount: this.depositAmount,
							method: this.paymentMethod,
							storageNm: this.$store.state.user.storage_number,
						}
					});
				}else{
					alert('请输入有效数字');
				}
			}
		},
		mounted() {
			if(this.$route.query.status === 'success'){
				this.snackbar = true;
				this.notification = '充值成功';
				this.snackbarColor = 'green';
			}
		}
	}
</script>