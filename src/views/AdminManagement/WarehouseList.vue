<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row>
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-spacer></v-spacer>

            <v-btn text @click.stop="addWarehouse">新增</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col
        v-for="warehouse in warehouseList"
        :key="warehouse.id"
        cols="12"
        sm="6"
      >
        <v-card class="pa-5">
          <div class="title">{{ warehouse.alias }}</div>
          <div>First Name：{{ warehouse.first_name }} Last Name：{{ warehouse.last_name }}</div>
          <div>城市：{{ warehouse.city }} 州/省：{{ warehouse.state }}</div>
          <div>地址：{{ warehouse.address }}</div>
          <div>门牌号：{{ warehouse.door_number }} (必填）</div>
          <div>邮编：{{ warehouse.zip }} 电话：{{ warehouse.phone }}</div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="editWarehouse(warehouse)">编辑</v-btn>
            <v-btn text @click="deleteWarehouse(warehouse.id)">删除</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
			max-width="800"
			persistent
			v-model="addDialog"
		>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Alias" v-model="alias" :rules="requiredRule"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="First Name" v-model="first_name" :rules="requiredRule"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Last Name" v-model="last_name" :rules="requiredRule"></v-text-field>
              </v-col>		
              <v-col cols="12" sm="4" md="4">
                <v-text-field label="City" v-model="city" :rules="requiredRule"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field label="State" v-model="state" :rules="requiredRule"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field label="Zip Code" v-model="zip" :rules="requiredRule"></v-text-field>
              </v-col>	
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Address" v-model="address" :rules="requiredRule"></v-text-field>
              </v-col>	
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Door Number" v-model="door_number" :rules="requiredRule"></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-text-field label="Phone" v-model="phone" :rules="requiredRule"></v-text-field>
              </v-col>				
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">取消</v-btn>
          <v-btn color="blue darken-1" text @click="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      warehouseList: [],
      addDialog: false,
      alias: '',
      first_name: '',
      last_name: '',
      city: '',
      state: '',
      zip: '',
      address: '',
      door_number: '',
      phone: '',
      requiredRule: [
          v => !!v || 'Item is required',
      ],
      theWarehouse: null,
    }),

    methods: {
      getAll: function() {
        this.$http.get('/api/getWarehouseAddress').then( (res) => {
          this.warehouseList = res.data
        })
      },

      addWarehouse: function(){
        this.addDialog = true
      },

      editWarehouse: function(item){
        this.addDialog = true
        this.theWarehouse = item
        this.alias = item.alias
        this.first_name = item.first_name
        this.last_name = item.last_name
        this.city = item.city
        this.state = item.state
        this.address = item.address
        this.door_number = item.door_number
        this.zip = item.zip
        this.phone = item.phone
      },

      deleteRecipient(warehouseId){
        this.$http.delete('/api/deleteWarehousebyId',{
          params: {
						id : warehouseId
					}
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.getAll();
        })
      },

      cancel: function(){
        this.addDialog = false
        this.theWarehouse = null
        this.alias = ''
        this.first_name = ''
        this.last_name = ''
        this.city = ''
        this.state = ''
        this.address = ''
        this.door_number = ''
        this.zip = ''
        this.phone = ''
      },

      save: function(){
        if(this.theWarehouse){
          this.$http.post('/api/updateWarehousebyId',{   
              alias : this.alias,
              first_name : this.first_name,
              last_name : this.last_name,
              city : this.city,
              state : this.state,
              door_number : this.door_number,
              address : this.address,
              zip : this.zip,
              phone : this.phone,
              id: this.theWarehouse.id        
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '修改成功';
            this.snackbarColor = 'green';
          })
        }else{
          this.$http.post('/api/saveWarehouseAddress',{
            alias : this.alias,
            first_name : this.first_name,
            last_name : this.last_name,
            city : this.city,
            state : this.state,
            door_number : this.door_number,
            address : this.address,
            zip : this.zip,
            phone : this.phone,
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '增加成功';
            this.snackbarColor = 'green';
          })
        }
        this.addDialog = false
        this.theWarehouse = null
        this.alias = ''
        this.first_name = ''
        this.last_name = ''
        this.city = ''
        this.state = ''
        this.address = ''
        this.door_number = ''
        this.zip = ''
        this.phone = ''
        this.getAll()
      }
    },

    mounted: function() {
			this.getAll();
		}
        
  }
</script>
