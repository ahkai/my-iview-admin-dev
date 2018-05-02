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
                        API服务信息维护
                    </p>
                    <Row class="area-linkage-page-row3">
                        <pt-Selector v-on:input_from_select="input_from_select"
                                v-on:show_from_background="show_from_background"
                                v-model="resDefault"
                                level='2'
                        />
                    </Row>
                    <Row class="margin-top-10" v-if="show(1)">
                        <div class="edittable-table-height-con">
                            <pt-Canedittable refs="table2"
                                             v-on:on-change="mychange"
                                             v-on:on-delete="mydelete"
                                             v-model="AppLogical_Array"
                                             :columns-list="columns_def_new"
                                             userflag='service_info'
                            >
                            </pt-Canedittable>
                        </div>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Alert class="margin-top-10" v-if="showMessage(1)" :type="MessageType" show-icon>
            任务消息：
            <span slot="desc"> {{ BackgroundMessage }} </span>
        </Alert>
        <Row :gutter="10"  v-if="false">
            <Col span="17">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        上层父组件业务操作
                    </p>
                    <Row class="area-linkage-page-row1">
                        <span>插件返回操作目标：</span><br/>
                        <br>
                        <!--<i-input v-for="item in showRes"  :values.sync="item.detail">-->
                        <!--<span slot="prepend">{{item.name+"  "}}</span>-->
                        <!--</i-input>-->

                        <!--<input v-for="(  item, index) in listDetail" :key="index" v-model="listDetail[index]" />-->

                        <li v-for="(item, index) in listDetail">
                            <span>{{ listCol[index]}}</span>
                            <input v-model="listDetail[index]" />
                        </li>

                        <!--                        <li v-for="(item, index) in listDetail" >
                                                    <span>{{ listCol[index]}}</span><i-input  :value.sync="item" placeholder="请输入..." style="width: 300px"></i-input>
                                                </li>-->


                        <br>
                        <br>

                        <!--{{ showRes }}-->
                        <!--<br>-->
                        <!--{{listCol}}-->
                        <!--<br>-->
                        <!--{{listDetail}}-->
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>

    import Vue from 'vue';
    import ptComponents from './pt-components';
    import util from './util/index';
    import axios from 'axios';

    Vue.use(ptComponents);

    let httpinstance = '';

    let ip_addr = document.location.hostname;

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

    export default {

        data () {
            return {
                res1: [],
                //resDefault: { 'OBJ_NAME':'system', 'USER_NAME':'none' } ,
                resDefault: [ 'service_type', '2' ] ,
                //resDefault: ['', '', '', ''],
                showRes: [],
                showFlag:false,
                listCol:[],
                listDetail:[],

                AppLogical_Array:[],
                columns_def_new:[],
                AppLogical_Array_bk:[],


                showMsgFlag:false,
                BackgroundMessage:'',
                MessageType : '',

                ButtonFlag:false,

                myCount: '',
                myTimer: null,
            };
        },
        methods: {

            CreateNewSerType(){

            },

            getCode(){

                if(this.MessageType === 'error'){
                    this.myCount_total = 6;
                }else{
                    this.myCount_total = 2;
                }

                if (!this.myTimer) {
                    this.myCount = this.myCount_total;
                    this.showMsgFlag = true;
                    this.myTimer = setInterval(() => {
                        if (this.myCount > 0 && this.myCount <= this.myCount_total) {
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

                this.AppLogical_Array_bk = BackObj;
                this.AppLogical_Array = BackObj;

                this.columns_def_new = util.columns_format_3;

                this.showFlag = true;

                this.BackgroundMessage = '数据库查询操作，成功完成！';
                this.MessageType = 'success';
                this.getCode();
            },

            mydelete( BackObj , idx ){
                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000007');       //你要传给后台的参数值 key/value
                task_params['service_id'] = idx;

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
                                this.AppLogical_Array = this.AppLogical_Array_bk;

                                this.AppLogical_Array = this.AppLogical_Array.filter( (item) => {
                                    return item;
                                });

                                this.getCode();
                            }else {
                                if (vBackData['Code'] === 'redisplay') {
                                    this.AppLogical_Array = vBackData['RowsArray']
                                }

                                this.AppLogical_Array_bk = this.AppLogical_Array;
                                this.BackgroundMessage = '数据库更新操作，成功完成！';
                                this.MessageType = 'success';
                                this.getCode();
                            }
                        }
                    })
                    .catch((err)=> {
                        this.BackgroundMessage = '数据库更新操作，失败！'+err;
                        this.MessageType = 'error';
                        this.AppLogical_Array = this.AppLogical_Array_bk ;

                        //数组赋值操作，并不能出发vue发现，数组内容变更，必须使用变异方法 (mutation method)
                        // 或有非变异 (non-mutating method) 方法，例如：filter(), concat() 和 slice()
                        this.AppLogical_Array = this.AppLogical_Array.filter( (item) => {
                            return item;
                        });
                        this.getCode();
                    });

            },

            mychange( BackObj , idx){

                this.AppLogical_Array_bk = BackObj;

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
                                this.getCode();
                            }else {
                                if (vBackData['Code'] === 'redisplay') {
                                    this.AppLogical_Array = vBackData['RowsArray']
                                }

                                this.BackgroundMessage = '数据库更新操作，成功完成！';
                                this.MessageType = 'success';
                                this.getCode();
                            }
                        }
                    })
                    .catch((err) => {
                        this.BackgroundMessage = '数据库更新操作，失败！' + err;
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
            },

            AppLogical_Array( val){

                let a = 1;

            }
        }
    };
</script>