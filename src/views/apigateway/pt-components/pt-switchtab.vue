<template>
    <pt-Canedittable  v-model="Service_Array"  :columns-list="columns_def_new" v-on:on-change="mychange"></pt-Canedittable>
</template>

<script>

    import Vue from 'vue';
    // import ptComponents from './index';
    import ptCanedittable from './pt_canEditTable'
    import util from '../util/index';
    import axios from 'axios';

    let ip_addr = document.location.hostname;

    let httpinstance = axios.create({
        baseURL: 'http://192.168.58.11:5000'
    });

    if ( ip_addr === '192.168.58.11' ){
        httpinstance = axios.create({
            baseURL: 'http://192.168.58.11:5000'
        });
    }else{
        httpinstance = axios.create({
            baseURL: 'http://192.168.232.11:5000'
        });
    }

    let config_axios =  {
        method: 'post',
        url: '',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: []
    };

    Vue.use(ptCanedittable);

    export default {
        name: 'ptSwitchtab',

        data () {
            return {
                Service_Array:[],
                Service_Array_bk:[],
                columns_def_new : util.columns_format_7,

                BackgroundMessage:'',
                MessageType:'',

                myCount_total:0,
                myTimer:'',
                showMsgFlag:false

            };
        },

        props:{
            switchtabid:Number
        },

        methods:{
            getCode(){
            },

            getserviceinfo(){

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000005');       //你要传给后台的参数值 key/value
                task_params['service_type'] = String(this.switchtabid);

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let vBackData = res.data;

                            if( vBackData['Code'] === '0' ||  vBackData['error_code'] ){
                                this.BackgroundMessage = '数据库操作，失败！' +  vBackData['Message'] ;
                                this.MessageType = 'error';

                                this.Service_Array = this.Service_Array_bk;
                                this.Service_Array = this.Service_Array.filter( (item) => {
                                    return item;
                                });

                                this.$emit('childgetcode', this.BackgroundMessage, this.MessageType , 1);
                            }else{

                                let TempObj = vBackData;
                                this.Service_Array = TempObj['RowsArray'];

                                this.BackgroundMessage = '数据库更新操作，成功完成！';
                                this.MessageType = 'success';

                                this.$emit('childgetcode', this.BackgroundMessage, this.MessageType, 1 );
                            }

                        }
                    })
                    .catch(( err )=> {
                        this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                        this.MessageType = 'error';

                        this.Service_Array = this.Service_Array_bk;
                        this.Service_Array = this.Service_Array.filter( (item) => {
                            return item;
                        });

                        this.$emit('childgetcode', this.BackgroundMessage, this.MessageType, 1);
                    });
            },

            mychange( BackObj , idx, changeflag){

                this.Service_Array_bk = BackObj;
                this.Service_Array = BackObj;

                if (changeflag == true){
                    this.Service_Array[idx]['service_status'] = 2;
                }else{
                    this.Service_Array[idx]['service_status'] = 3;
                }


                this.Service_Array = this.Service_Array.filter( (item) => {
                    return item;
                });

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000006');       //你要传给后台的参数值 key/value
                task_params = BackObj[idx];

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let vBackData = res.data;

                            if( vBackData['Code'] === '0' ||  vBackData['error_code'] ){
                                this.BackgroundMessage = '数据库操作，失败！' +  vBackData['Message'] ;
                                this.MessageType = 'error';

                                this.Service_Array = this.Service_Array_bk;
                                this.Service_Array = this.Service_Array.filter( (item) => {
                                    return item;
                                });

                                this.$emit('childgetcode', this.BackgroundMessage, this.MessageType , 2);
                            }else{

                                this.BackgroundMessage = '数据库更新操作，成功完成！';
                                this.MessageType = 'success';

                                this.$emit('childgetcode', this.BackgroundMessage, this.MessageType , 2);

                            }

                        }
                    })
                    .catch(( err )=> {
                        this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                        this.MessageType = 'error';

                        this.Service_Array = this.Service_Array_bk;
                        this.Service_Array = this.Service_Array.filter( (item) => {
                            return item;
                        });

                        this.$emit('childgetcode', this.BackgroundMessage, this.MessageType, 2);
                    });

            }
        },


        mounted(){
            this.getserviceinfo();
        }



    }
</script>