<style lang="less">
    @import './mytest.less';
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="22">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        服务分类信息维护
                    </p>
                    <Row class="area-linkage-page-row3">
                        <pt-Selector ref="levelselect"
                                v-on:input_from_select="input_from_select"
                                v-on:show_from_background="show_from_background"
                                v-model="resDefault"
                                level='1'
                        />
                    </Row>
                    <Row class="margin-top-10" v-if="show(1)">
                        <div class="edittable-table-height-con">
                            <pt-Canedittable ref="table_level1"
                                             v-on:on-change="mychange"
                                             v-on:on-delete="mydelete"
                                             v-model="AppLogical_Array"
                                             :columns-list="columns_def_new"
                                             userflag='service_type'
                            >
                            </pt-Canedittable>
                        </div>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Alert class="margin-top-10" v-if="showMessage(1)" :type="MessageType" show-icon>
            A success
            <span slot="desc"> {{ BackgroundMessage }} </span>
        </Alert>
    </div>
</template>

<script>

    import Vue from 'vue';
    import ptComponents from './pt-components';
    import util from './util/index';
    import axios from 'axios';

    Vue.use(ptComponents);

    export default {

        data () {
            return {
                res1: [],
                //resDefault: { 'OBJ_NAME':'system', 'USER_NAME':'none' } ,
                resDefault: [ 'service_level', '2' ] ,
                //resDefault: ['', '', '', ''],
                showRes: [],
                showFlag:false,
                listCol:[],
                listDetail:[],

                AppLogical_Array:[],
                columns_def_new:[],

                showMsgFlag:false,
                BackgroundMessage:'',
                MessageType : '',

                ButtonFlag:false,

                TestKey: '',

                myCount: '',
                myTimer: null,
            };
        },
        methods: {
            CreateNewSerType(){

            },

            getCode(){

                const TIME_COUNT = 2;
                if (!this.myTimer) {
                    this.myCount = TIME_COUNT;
                    this.showMsgFlag = true;
                    this.myTimer = setInterval(() => {
                        if (this.myCount > 0 && this.myCount <= TIME_COUNT) {
                            this.myCount--;
                        } else {
                            this.showMsgFlag = false;
                            clearInterval(this.myTimer);
                            this.myTimer = null;
                        }
                    }, 1000)
                }
            },

            renderFormat (label) {
                return label.join(' => ');
            },

            show(var1){
                return this.showFlag;
            },

            showMessage(var2){
                return this.showMsgFlag;
            },

            show_from_background(vMsgType, vMsg){
                this.BackgroundMessage = '后台操作，失败！ ' + vMsg ;
                this.MessageType = vMsgType;
                this.getCode();
            },

            print() {
                console.log(this.showRes);
            },

            input_from_select( BackObj ){

                this.AppLogical_Array = BackObj;
                this.columns_def_new = util.columns_format_5;

                this.showFlag = true;
            },

            mydelete( BackObj , idx ){
                let ip_addr = document.location.hostname;

                if ( ip_addr == '192.168.58.11' ){
                    var httpinstance = axios.create({
                        baseURL: 'http://192.168.58.11:5000'
                    });
                }else{
                    var httpinstance = axios.create({
                        baseURL: 'http://192.168.232.11:5000'
                    });
                }

                let config_axios =  {
                    method: 'post',
                    url: '',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: [],
                };

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000009');       //你要传给后台的参数值 key/value
                task_params['obj_id'] = idx;

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let vBackData = res.data;

                            if( vBackData['Code'] == 'redisplay'){
                                this.AppLogical_Array = vBackData['RowsArray'];
                            }

                            // this.$refs.levelselect.FirstLevel_Array.push(this.AppLogical_Array[0]);
                            // this.$refs.levelselect.UpdateFirstLevel(this.AppLogical_Array);
                            //this.$refs.levelselect.UpdateFirstLevel('aaa');
                            this.$refs.levelselect.init();

                            this.BackgroundMessage = '数据库更新操作，成功完成！';
                            this.MessageType = 'success';
                            this.getCode();
                        }
                    })
                    .catch(function(err) {
                        this.BackgroundMessage = '数据库更新操作，失败！';
                        this.MessageType = 'error';
                        this.getCode();
                    });

            },

            mychange( BackObj , idx){

                let ip_addr = document.location.hostname;

                if ( ip_addr == '192.168.58.11' ){
                    var httpinstance = axios.create({
                        baseURL: 'http://192.168.58.11:5000'
                    });
                }else{
                    var httpinstance = axios.create({
                        baseURL: 'http://192.168.232.11:5000'
                    });
                }

                let config_axios =  {
                    method: 'post',
                    url: '',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: [],
                };

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000008');       //你要传给后台的参数值 key/value
                task_params = BackObj[idx];

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let vBackData = res.data;

                            if( vBackData['Code'] == 'redisplay'){
                                this.AppLogical_Array = vBackData['RowsArray']
                            }

                            this.$refs.levelselect.init();
                            
                            this.BackgroundMessage = '数据库更新操作，成功完成！';
                            this.MessageType = 'success';
                            this.getCode();
                        }
                    })
                    .catch(function(err) {
                        this.BackgroundMessage = '数据库更新操作，失败！';
                        this.MessageType = 'error';
                        this.getCode();
                    });
            }
        },
        watch: {
            res1 (val) {
                this.showRes = val;
            },
            resDefault (val) {

                // this.AppLogical_Array = val;
                // this.columns_def_new = util.columns_format_3;
                //
                // this.showFlag = true;

                // this.showRes = val;
                //
                // this.listDetail = [];
                // this.listCol = [];
                //
                // for( var index in this.showRes){
                //
                //     if( index%2 ){
                //         this.listDetail.push(this.showRes[index]);
                //     }else{
                //         this.listCol.push(this.showRes[index]);
                //     }
                //
                // }
            }
        }
    };
</script>