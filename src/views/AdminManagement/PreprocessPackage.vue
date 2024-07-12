<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
          <v-toolbar
						color="blue"
						dark
						flat
					>
						<v-btn @click="scanDialog = true" text outlined>扫描入库</v-btn>

						<template v-slot:extension>
							<v-tabs
								v-model="tab"
								fixed-tabs
							>
								<v-tabs-slider color="black"></v-tabs-slider>

								<v-tab>
									已预报但还未入库的包裹
								</v-tab>
							</v-tabs>
						</template>
					</v-toolbar>

					<v-tabs-items v-model="tab">
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="forcastInfoList"
										dense
										item-key="id"
										:items-per-page="15"
										:search="searchStr"
										:custom-filter="filterText"
									>
										<template v-slot:top>
											<v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
										</template>
										<template v-slot:item.action="{ item }">
											<v-icon
												small
												@click="deleteForcastInfo(item.id)"
											>
												mdi-close
											</v-icon>
										</template>
          				</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</material-card>
			</v-col>
		</v-row>
		<v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="5000"
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
		<v-dialog
			max-width="800"
			persistent
			v-model="scanDialog"
		>
			<template v-slot:default="dialog">
				<v-card>
					<v-toolbar
						dark
						color="blue"
						dense
					>
						<v-toolbar-title>
							扫描入库
						</v-toolbar-title>

					</v-toolbar>
					<v-card-text>
						<v-text-field
							v-model="scaned_tracking"
							label="Tracking# (扫描包裹Trackig)"
							ref="mark2"
							@keyup.enter.native="scanFinish"
						></v-text-field>

						<div v-if="!findPackage" class="text-center title text-uppercase mt-6 red">
							没有匹配到预报信息
						</div>
						<div v-if="findPackage" class="text-center title text-uppercase mt-6 green">
							匹配到预报信息
						</div>

						<div><svg id="barcode"></svg></div>
						<v-card v-if="finishScan && findPackage">
							<v-card-text>

									<div>
										TRACKING: {{scaned_tracking}}<br>
										备注： {{comment}}<br>
										仓位号： {{storage_number}} &nbsp;&nbsp;&nbsp;&nbsp; {{service_type}}<br>
										是否拍照: {{ need_photo }}<br>
										是否拆箱合箱: {{ need_split }}
									</div>
									

								
								<v-divider
									class="mt-6 mb-6"
								></v-divider>
								<v-text-field
									v-model="weight"
									label="包裹重量"
									suffix="磅"
								></v-text-field>
								<v-select
									outlined
									v-model="packageType"
									:items="itemTypeList"
									label="包裹类型"
								></v-select>
								<v-text-field
									v-model="storage_area"
									label="包裹放置区域"
								></v-text-field>
								<v-text-field
									v-model="inner_count"
									label="内件数量"
								></v-text-field>
							</v-card-text>
						</v-card>
						<v-card v-if="finishScan && !findPackage">
							<v-card-text>
								<div>
									<div class="title">无主入库</div>
									TRACKING: {{scaned_tracking}}<br>
									仓位号： {{storage_number}}
								</div>
								<v-divider
									class="mt-6 mb-6"
								></v-divider>
								<v-text-field
									v-model="weight"
									label="包裹重量"
									suffix="磅"
								></v-text-field>
								<v-select
									outlined
									v-model="itemType"
									:items="itemTypeList"
									label="包裹类型"
								></v-select>
								<v-text-field
									v-model="storage_area"
									label="包裹放置区域"
								></v-text-field>
								<v-text-field
									v-model="inner_count"
									label="内件数量"
								></v-text-field>
								<v-textarea
									v-model="comment"
									label="留言"
								></v-textarea>
							</v-card-text>
						</v-card>
						<v-card v-if="checkItem">
							<v-card-text>
								<div class="overline mb-4 d-inline-flex">
									内件
									<v-chip
										class="ml-12"
										@click="addItemClick"
									>
										<v-icon left>
											mdi-image-filter-center-focus-strong
										</v-icon>
										扫描添加
									</v-chip>
								</div>
								<v-divider
									class="mt-6 mb-6"
								></v-divider>
								<v-data-table
									:headers="userItemHeader"
									:items="userItemList"
									hide-default-footer
									show-expand
									single-expand
									:expanded.sync="expanded"
								>
									<template v-slot:expanded-item="{ item }">
										<td :colspan="8">
											<v-simple-table>
												<template v-slot:default>
													<tbody>
														<tr >
															<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="70"></v-img></td>
															<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="70"></v-img></td>
															<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="70"></v-img></td>
														</tr>
													</tbody>
												</template>
											</v-simple-table>
										</td>
									</template>
									<template v-slot:item.action="{ item }">
										<v-btn
											text
											@click="openUploadDialog(item)"
										>
											上传照片
										</v-btn>
										<v-btn
											class="ml-4"
											text
											@click="deleteItem(item)"
										>
											删除
										</v-btn>
									</template>
								</v-data-table>
							</v-card-text>
						</v-card>
					</v-card-text>
					<v-card-actions class="justify-end">
						<v-btn
						v-if="!checkItem"
							text
							id="checkBtn"
							@click="createThirdpartyPackage()"
						>确认</v-btn>
						<v-btn
							v-if="checkItem"
							text
							id="checkBtn"
							@click="createThirdpartyPackageAndItem()"
						>确认</v-btn>
						<v-btn
							text
							@click="closeScanDialog"
						>关闭</v-btn>
					</v-card-actions>
				</v-card>

			</template>
		</v-dialog>

		<!-- 扫描匹配内件信息 -->
		<v-dialog
			max-width="800"
			persistent
			v-model="scanAddItemDialog"
		>
			<template v-slot:default="dialog">
				<v-card>
					<v-toolbar
						color="blue"
						dark
					>扫描物品条形码</v-toolbar>
					<v-card-text>
						<v-text-field
							v-model="scaned_itemUPC"
							label="Barcode# (扫描物品UPC)"
							class='mt-4'
							@keyup.enter.native="scanItemFinish"
						></v-text-field>

						<div v-if="!findItem" class="text-center title text-uppercase mt-6 red">
							没有匹配到物品信息
						</div>
						<div v-if="findItem" class="text-center title text-uppercase mt-6 green">
							匹配到物品信息
						</div>
						<v-row>
							<v-col
								cols="6"
								md="2"
							>
								<v-select
									v-model="itemType"
									:items="itemTypeList"
									label="类别"
								></v-select>
							</v-col>
							<v-col
								cols="6"
								md="3"
							>
								<v-text-field
									v-model="itemName"
									label="物品描述"
								></v-text-field>
							</v-col>
							<v-col
								cols="6"
								md="3"
							>
								<v-text-field
									v-model="itemBrand"
									label="品牌"
								></v-text-field>
							</v-col>
							<v-col
								cols="6"
								md="2"
							>
								<v-text-field
									v-model="itemPrice"
									label="申报单价(USD)"
								></v-text-field>
							</v-col>                
							<v-col
								cols="6"
								md="2"
							>
								<v-text-field
									v-model="itemCount"
									:counter="5"
									label="数量"
									ref="mark3"
									@keyup.enter.native="addItem"
								></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions class="justify-end">
						<v-btn
							text
							@click="addItem"
						>添加</v-btn>
						<v-btn
							text
							@click="closeScanAddItemDialog"
						>关闭</v-btn>
					</v-card-actions>
				</v-card>
			</template>
		</v-dialog>
		<v-dialog
      v-model="uploadDialog"
      width="510px"
    >
      <material-card>
        <VueUploadImgs 
          multiple
          compress
          :before-read="beforeRead"
          :after-read="afterRead"
          :before-remove="beforeRemove"
          :limit="limit"
          :type="type"
          @preview="preview"
          @exceed="exceed"
          @oversize="oversize"
          v-model="files"
        >
        </VueUploadImgs>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="uploadDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="uploadImg"
          >
            确认
          </v-btn>
        </v-card-actions>
      </material-card>
    </v-dialog>
    <v-dialog
      v-model="savingDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="green"
        dark
      >
        <v-card-text>
          <strong>{{progressMsg}}</strong>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="savingDialog = false"
          >
            确认
          </v-btn>
        </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
		<v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
	</v-container>
</template>

<script>
	import jsbarcode from 'jsbarcode'
	export default {
    data: () => ({
			tab: null,
			forcastInfoList: [],
			searchStr: '',
			searchStr2: '',
      headers: [
        {
          sortable: false,
          text: '包裹tracking',
          value: 'forcast_tracking'
        },
				{
					sortable: false,
          text: '预报地址',
          value: 'alias'
				},
        {
          sortable: false,
          text: '备注',
          value: 'comment'
        },
        {
          sortable: false,
          text: '仓位号',
          value: 'storage_number'
        },
        {
          sortable: false,
          text: '预计到达时间',
          value: 'arrive_at'
        },        
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],

			scanDialog: false,
			scaned_tracking: '',
			findPackage: false,
			finishScan: false,
			forcastInfoId: '',
			storage_number: '',
			comment: '',
			service_type: '',
			need_photo: '',
			need_split: '',
			weight: '',

			snackbar: false,
      snackbarColor: '',
      notification: '',

			
			uncheckedThirdpartyPackageList: [],
			newCreatedPackageId: '',

			userItemHeader: [
				{
          sortable: false,
          text: '类别',
					width: "20%",
          value: 'type'
        },
        {
          sortable: false,
          text: '物品描述',
					width: "20%",
          value: 'item_name'
        },
        {
          sortable: false,
          text: '单价',
					width: "10%",
          value: 'price',
        },
        {
          sortable: false,
          text: '数量',
					width: "10%",
          value: 'item_count'
        },
        {
          sortable: true,
          text: '品牌',
					width: "20%",
          value: 'brand',
        },
        {
          sortable: false,
          text: '操作',
					width: "20%",
          value: 'action',
        }
      ],
			expanded: [],
			userItemList: [],
			packageType: '',
			itemType: '',
      itemTypeList: ['鞋类','奶粉','保健品','零食','日用品','衣服','玩具','化妆品','箱包','电子产品','手表'],
      itemName: '',
      itemPrice: '',
      itemCount: '',
      itemBrand: '',


			scanAddItemDialog: false,
			scaned_itemUPC: '',
			findItem: false,
			findItemTemplateId: '',

			checkItem: false,

			limit: 3,
      type: 0,
      domain: 'https://upload-na0.qiniup.com',
      uploadDialog: false,
      files: [],
      currentItem: 0,
      currentImgNm: 0,
      savingDialog: false,
      progressMsg: '',
      processStatus: 0,
      overlay: false,

			storage_area: '',
			inner_count: '',
			adminComment: '',

		}),

		methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

			getForcastInfo: function(){
        this.$http.get('/api/package/getForcastInfo').then( (res) => {
          this.forcastInfoList = res.data;
					for(let item of this.forcastInfoList){
            item.arrive_at = new Date(item.arrive_at).toLocaleString()
          }
        })
      },

			deleteForcastInfo: function(id){
        this.$http.delete('/api/package/deleteForcastInfo',{
          params: {
						id : id
					}
        }).then( (res) => {
          this.getForcastInfo();
        })
      },

/* 			getTodayandUncheckedThirdPartyPackage: function(){
				var today = dateToString(new Date());
        var tomorrow = dateToString(new Date(new Date().setDate(new Date().getDate()+1)));
        this.$http.get('/api/package/getTodayandUncheckedThirdPartyPackage', {
					params: {
						startDate: today,
						endDate: tomorrow,
					}
				}).then( (res) => {
          this.uncheckedThirdpartyPackageList = res.data;
        })
      }, */
			
			scanFinish: function(){
				if(this.scaned_tracking == ''){
          this.findPackage = false;
          return;
        }
				jsbarcode(
					'#barcode',
					this.scaned_tracking.trim(),
					{
						displayValue: true // 是否在条形码下方显示文字
					}
				)
        this.$http.get('/api/package/existForcastPackage',{
          params: {
            forcast_tracking: this.scaned_tracking.trim(),
          }
        }).then( (res) => {
					this.finishScan = true
          if(res.data.length === 0){
						this.findPackage = false;
						this.storage_number = 'AAAAA'
					}else{
						this.findPackage = true;
						this.storage_number = res.data[0].storage_number;
						this.comment = res.data[0].comment;
						this.service_type = res.data[0].service_type;
						this.forcastInfoId = res.data[0].id;
						this.need_photo = res.data[0].need_photo != 1? '否' : '是'
						this.need_split = res.data[0].need_split != 1? '否' : '是'
						if(res.data[0].need_photo || res.data[0].need_split){
							this.checkItem = true
						}
					}
				})
			},

			createThirdpartyPackage: function(){
				if(this.storage_number == ''){
          return;
        }
				this.$http.post('/api/package/insertThirdPartyPackage',{
					storage_number : this.storage_number,
					tracking : this.scaned_tracking,          
					comment : this.comment,
					weight : this.weight,
					status : '已清点',
					inner_count: this.inner_count,
					storage_area: this.storage_area,
					instore_date : new Date().getTime(),
				}).then( (res) => {
					this.deleteForcastInfo(this.forcastInfoId);
					this.$http.post('/api/item/insertPackageItem',{
						packageId : res.data.insertId,
						itemCount : 1,
						itemTemplate_Id: 1,
					})
					
					this.snackbar = true;
          this.notification = '入库成功';
          this.snackbarColor = 'green';
					this.scaned_tracking = '';
					this.findPackage = false;
					this.storage_area = ''
					this.inner_count = ''
					this.finishScan = false
					this.$refs.mark2.$el.querySelector('input').focus();
				})
			},

			addItemClick: function(){
				this.$http.post('/api/package/insertThirdPartyPackage',{
					storage_number : this.storage_number,
					tracking : this.scaned_tracking,
					comment : this.comment,
					weight : this.weight,
					status : '已清点',
					inner_count: this.inner_count,
					storage_area: this.storage_area,
					instore_date : new Date().getTime(),
				}).then( (res) => {
					this.deleteForcastInfo(this.forcastInfoId)
					//设置包裹id
					this.scanAddItemDialog = true
					this.newCreatedPackageId = res.data.insertId
				})
			},

			createThirdpartyPackageAndItem: function(){
				if(this.userItemList == []){
					alert('需要录入内件信息')
					return
				}
				this.checkItem = false
				this.scaned_tracking = '';
				this.findPackage = false;
				this.storage_area = ''
				this.inner_count = ''
				this.finishScan = false
				this.$refs.mark2.$el.querySelector('input').focus();
				/* this.$http.post('/api/package/insertThirdPartyPackage',{
					storage_number : this.storage_number,
					tracking : this.scaned_tracking,
					comment : this.comment,
					status : '已清点',
					inner_count: this.inner_count,
					storage_area: this.storage_area,
					instore_date : new Date().getTime(),
				}).then( (res) => {
					this.deleteForcastInfo(this.forcastInfoId)
					this.checkItem = true
				})
				this.checkItem = true */
			},


			closeScanDialog: function(){
				this.scaned_tracking = '';
				this.findPackage = false;
				this.finishScan = false
				this.scanDialog = false;
			},

			closeScanAddItemDialog: function(){
				this.scanAddItemDialog = false;
				this.itemType = '';
        this.itemName = '';
        this.itemPrice = '';
        this.itemCount = '';
        this.itemBrand = '';
				this.findItemTemplateId = '';
			},

			scanItemFinish: function(){
				if(this.scaned_itemUPC == ''){
          this.findItem = false;
          return;
        }
        this.$http.get('/api/item/existItemByUPC',{
          params: {
            upcBarcode: this.scaned_itemUPC.trim(),
          }
        }).then( (res) => {
          if(res.data.length === 0){
						this.findItem = false;
					}else{
						this.findItem = true;
						this.findItemTemplateId = res.data[0].id;
						this.itemType = res.data[0].type;
        		this.itemName = res.data[0].item_name;
        		this.itemPrice = res.data[0].price;
        		this.itemBrand = res.data[0].brand;
						this.$refs.mark3.$el.querySelector('input').focus();
					}
				})
			},

			getItemsInPackage: function(packageId){
				this.$http.get('/api/item/getItemsByThirdPartyPackageId',{
					params: {
						packageId : packageId,
					}
				}).then( (resSec) => {
					this.userItemList = resSec.data;
				})
			},

			addItem: function(){
				//check有效性
				if(this.scaned_itemUPC == ''){
          alert('请输入物品upc code');
					return;
        }
				if(this.itemType == '' || this.itemName == '' || this.itemPrice == '' || this.itemBrand == ''){
          alert('请补充完整物品信息');
					return;
        }

				if(this.findItemTemplateId){
					this.$http.post('/api/item/insertPackageItem',{
						packageId : this.newCreatedPackageId,
						itemCount : this.itemCount,
						itemTemplate_Id: this.findItemTemplateId,
					}).then( (res) => {
						this.getItemsInPackage(this.newCreatedPackageId);
						//clear 
						this.itemType = '';
						this.itemName = '';
						this.itemPrice = '';
						this.itemCount = '';
						this.itemBrand = '';
						this.scaned_itemUPC = '';
					})
				}else{
					this.$http.post('/api/item/insertItemTemplate',{
						barcode : this.scaned_itemUPC,
						itemType : this.itemType,
						itemName : this.itemName,
						itemPrice : parseFloat(this.itemPrice),
						itemBrand : this.itemBrand,
					}).then( (res) => {
						this.$http.post('/api/item/insertPackageItem',{
							packageId : this.newCreatedPackageId,
							itemCount : this.itemCount,
							itemTemplate_Id: res.data.insertId,
						}).then( (res) => {
							this.getItemsInPackage(this.newCreatedPackageId);
							//clear 
							this.itemType = '';
							this.itemName = '';
							this.itemPrice = '';
							this.itemCount = '';
							this.itemBrand = '';
							this.scaned_itemUPC = '';						
						})
					})
				}
			},

			deleteItem: function(item){
				this.$http.delete('/api/item/deletePackageItem',{
					params: {
						itemId : item.id
					}
				}).then( (res) => {
					this.getItemsInPackage(this.newCreatedPackageId);
				})
			},


			cancelCheckItem: function(){
				//删掉所有前面创建的item
				this.checkDialog = false;
			},

			//upload image
			openUploadDialog: function(item){
        this.currentItem = item;
        this.currentImgNm = 0;
        if(item.pic1_url)
          this.currentImgNm = this.currentImgNm + 1;
        if(item.pic2_url)
          this.currentImgNm = this.currentImgNm + 1;
        if(item.pic3_url)
          this.currentImgNm = this.currentImgNm + 1;
        this.limit = 3 - this.currentImgNm;
        this.files = [];
        this.uploadDialog = true;
      },

      uploadImg: function(){
        //alert(this.currentItemId);
        this.uploadDialog = false;
        this.savingDialog = true;
        this.progressMsg = '正在上传图片';
        for(let i=0; i<this.files.length; i++){
          let pic = this.files[i].url.replace(/^.*?base64,/, '')
          this.$http.get('/api/qiniuToken').then(res => {
            this.$http.post(this.domain + '/putb64/-1/', pic, {
              headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': 'UpToken ' + res.data,
              }
            }).then(res => {
              let col_pic = 'pic' + (i+1).toString() +'_url';
              let url_pic = res.data.key;
              let namecol_pic = 'pic' + (i+1).toString() + '_name';
              let name_pic = this.files[i].name;
              this.$set(this.currentItem,namecol_pic,name_pic);
              this.$set(this.currentItem,col_pic,url_pic);
              this.progressMsg = '第' + (i+1) + '张上传完成';
            })
          })
        }        
      },

      deleteImg: function(img_url){
        alert(img_url);
      },


      exceed() {
        alert(`只能上传${this.limit}张图片`)
      },

      beforeRead(files) {
        console.log('before-read')
        for (let i = 0, len = files.length; i < len; i++) {
            const file = files[i]
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
                alert('只能上传jpg和png格式的图片')
                return false
            }
        }
        return true
      },

      afterRead(file) {
      },

      beforeRemove(index, file) {
        return true
      },

      preview(index, file) {
        this.$hevueImgPreview(file.url);
      },

      oversize() {},
    },

    mounted: function() {
      this.getForcastInfo();
			//this.getTodayandUncheckedThirdPartyPackage();
    },
	}
</script>