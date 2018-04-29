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
                        公共条件筛选
                    </p>
                    <Row class="area-linkage-page-row3">
                        <pt-Selector
                                v-model="resDefault"
                                level='2'
                                size="small"
                        />
                    </Row>
                    <Row class="margin-top-10" v-if="show(1)">
                        <div class="edittable-table-height-con">
                            <pt-Canedittable refs="table2" v-on:input="input" v-model="AppLogical_Array" :columns-list="columns_def_new"></pt-Canedittable>
                        </div>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Alert class="margin-top-10" v-if="showMessage(1)" :type="MessageType" show-icon>
            A success
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

                showMsgFlag:false,
                BackgroundMessage:'',
                MessageType : '',

                myCount: '',
                myTimer: null,
            };
        },
        methods: {

            getCode(){
                const TIME_COUNT = 3;
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

            print() {
                console.log(this.showRes);
            },

            input( BackObj , idx){

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

                service_params.append('service_id', '10000006');       //你要传给后台的参数值 key/value
                task_params = BackObj[idx];

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {
                            this.BackgroundMessage = '数据库更新操作，成功完成！';
                            this.MessageType = 'success';
                            this.getCode();
                        }
                    })
                    .catch(function(err) {
                        // this.BackgroundMessage = '数据库更新操作，失败！';
                        // this.MessageType = 'error';
                        // getCode();
                        console.log(err);
                    });
            }
        },
        watch: {
            res1 (val) {
                this.showRes = val;
            },
            resDefault (val) {

                this.AppLogical_Array = val;
                this.columns_def_new = util.columns_format_3;

                this.showFlag = true;

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