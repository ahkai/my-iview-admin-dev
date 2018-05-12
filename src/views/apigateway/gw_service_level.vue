<style lang="less">
    @import './gw.less';
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="22">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        服务一级分类信息维护
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
                                             v-on:on-add="myadd"
                                             v-on:on-search="mysearch"
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
        <Row :gutter="10" v-if="show(2)">
            <Col span="22">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        服务二级分类信息维护
                    </p>
                    <Row class="margin-top-10" v-if="show(2)">
                        <div class="edittable-table-height-con">
                            <pt-Canedittable ref="table_level2"
                                             v-on:on-change="mychange2"
                                             v-on:on-delete="mydelete2"
                                             v-model="AppLogical_Array2"
                                             :columns-list="columns_def_new2"
                                             userflag='service_type2'
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
    </div>
</template>

<script>

    import Vue from 'vue';
    import ptComponents from './pt-components/index';
    import util from './util/index';
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
                AppLogical_Array_bk:[],

                AppLogical_Array2:[],
                columns_def_new2:[],
                AppLogical_Array2_bk:[],
                showtable2flag:false,

                showMsgFlag:false,
                BackgroundMessage:'',
                MessageType : '',

                ButtonFlag:false,

                TestKey: '',

                myCount: 0,
                myCount_total:4,
                myTimer: null
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

                if( var1 === 1 ){
                    return this.showFlag;
                }

                if( var1 === 2 ){
                    return this.showtable2flag;
                }

                return false;

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
                this.columns_def_new = util.columns_format_5;

                this.showFlag = true;

                this.showtable2flag = false;
                this.AppLogical_Array2 = [];
                this.columns_def_new2 = [];
            },

            myadd( BackObj , idx ){

                let TempItem = {}

                TempItem['obj_id'] = 'AUTO';
                TempItem['obj_name'] = 'none';
                TempItem['type_desc'] = 'none';
                TempItem['type_level'] = '2';
                TempItem['type_uplevel'] = idx;
                TempItem['type_date'] = 'AUTO';
                TempItem['type_status'] = '0';

                this.AppLogical_Array2 = [];
                this.AppLogical_Array2.push( TempItem );
                this.columns_def_new2 = util.columns_format_6 ;
                this.showtable2flag = true;

            },

            mysearch( BackObj , idx ){
                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000010');       //你要传给后台的参数值 key/value
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
                                this.AppLogical_Array2_bk = vBackData['RowsArray'];
                                this.AppLogical_Array2 = vBackData['RowsArray'];
                                this.columns_def_new2 = util.columns_format_6;
                                this.showtable2flag = true;

                                //this.$refs.levelselect.init();

                                this.BackgroundMessage = '数据库查询操作，成功完成！';
                                this.MessageType = 'success';
                                this.getCode();
                            }
                        }
                    })
                    .catch((err)=> {
                        this.BackgroundMessage = '数据库查询操作，失败！'+ err;
                        this.MessageType = 'error';
                        this.getCode();
                    });
            },

            mydelete( BackObj , idx ){
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

                            if( vBackData['Code'] === '0' ||  vBackData['error_code'] ){
                                this.BackgroundMessage = '数据库操作，失败！' +  vBackData['Message'] ;
                                this.MessageType = 'error';
                                this.$refs.levelselect.init();

                                this.AppLogical_Array = this.AppLogical_Array_bk;

                                this.AppLogical_Array = this.AppLogical_Array.filter( (item) => {
                                    return item;
                                });

                                this.getCode();
                            }else {
                                if (vBackData['Code'] === 'redisplay') {
                                    this.AppLogical_Array = vBackData['RowsArray'];
                                }

                                // this.$refs.levelselect.FirstLevel_Array.push(this.AppLogical_Array[0]);
                                // this.$refs.levelselect.UpdateFirstLevel(this.AppLogical_Array);
                                //this.$refs.levelselect.UpdateFirstLevel('aaa');
                                this.$refs.levelselect.init();
                                this.AppLogical_Array_bk = this.AppLogical_Array;
                                this.BackgroundMessage = '数据库更新操作，成功完成！';
                                this.MessageType = 'success';
                                this.getCode();
                            }
                        }
                    })
                    .catch((err) => {
                        this.BackgroundMessage = '数据库更新操作，失败！'+ err;
                        this.MessageType = 'error';

                        this.AppLogical_Array = this.AppLogical_Array_bk;

                        this.AppLogical_Array = this.AppLogical_Array.filter( (item) => {
                            return item;
                        });

                        this.getCode();
                    });

            },

            mychange( BackObj , idx){

                this.AppLogical_Array_bk = BackObj;
                this.AppLogical_Array = BackObj;

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000008');       //你要传给后台的参数值 key/value
                task_params = BackObj[idx];

                if( task_params['obj_name'] == '' ){
                    task_params['obj_name'] = 'none';
                    this.AppLogical_Array[idx]['obj_name'] = 'none';
                }

                if( task_params['type_desc'] == '' ){
                    task_params['type_desc'] = 'none';
                    this.AppLogical_Array[idx]['type_desc'] = 'none';
                }

                if( task_params['type_baseurl'] == '' ){
                    task_params['type_baseurl'] = 'none';
                    this.AppLogical_Array[idx]['type_baseurl'] = 'none';
                }

                this.AppLogical_Array = this.AppLogical_Array.filter( (item) => {
                    return item;
                });

                if( this.isInteger(task_params['type_status']) ){
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
                                    this.$refs.levelselect.init();
                                    this.getCode();
                                }else{
                                    if( vBackData['Code'] === 'redisplay'){
                                        this.AppLogical_Array = vBackData['RowsArray']
                                    }

                                    this.$refs.levelselect.init();

                                    this.BackgroundMessage = '数据库更新操作，成功完成！';
                                    this.MessageType = 'success';
                                    this.getCode();

                                }

                            }
                        })
                        .catch(( err )=> {
                            this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                            this.MessageType = 'error';

                            this.$refs.levelselect.init();

                            this.getCode();
                        });
                }else{
                    this.BackgroundMessage = '状态字段数值不能大于 10 的正整数，不能是小数！' ;
                    this.MessageType = 'error';
                    this.getCode();
                }
            },

            mydelete2( BackObj , idx ){
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

                            if( vBackData['Code'] === '0' ||  vBackData['error_code'] ){
                                this.BackgroundMessage = '数据库操作，失败！' +  vBackData['Message'] ;
                                this.MessageType = 'error';

                                this.AppLogical_Array2 = this.AppLogical_Array2_bk;

                                this.AppLogical_Array2 = this.AppLogical_Array2.filter( (item) => {
                                    return item;
                                });

                                this.getCode();
                            }else {
                                if (vBackData['Code'] === 'redisplay') {
                                    this.AppLogical_Array2 = vBackData['RowsArray'];
                                }

                                // this.$refs.levelselect.FirstLevel_Array.push(this.AppLogical_Array[0]);
                                // this.$refs.levelselect.UpdateFirstLevel(this.AppLogical_Array);
                                //this.$refs.levelselect.UpdateFirstLevel('aaa');

                                this.AppLogical_Array2_bk = this.AppLogical_Array2;
                                this.BackgroundMessage = '数据库更新操作，成功完成！';
                                this.MessageType = 'success';
                                this.getCode();
                            }
                        }
                    })
                    .catch((err) => {
                        this.BackgroundMessage = '数据库更新操作，失败！'+ err;
                        this.MessageType = 'error';

                        this.AppLogical_Array2 = this.AppLogical_Array2_bk;

                        this.AppLogical_Array2 = this.AppLogical_Array2.filter( (item) => {
                            return item;
                        });

                        this.getCode();
                    });

            },

            isInteger( obj ){

                if( obj.length > 1 || obj.length == 0 ){
                    return false
                }

                let vtemp = Number(obj);

                if( typeof vtemp != 'number' ){
                    return false
                }

                return true
            },

            mychange2( BackObj , idx ){

                this.AppLogical_Array2_bk = BackObj;
                this.AppLogical_Array2 = BackObj;

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000008');       //你要传给后台的参数值 key/value
                task_params = BackObj[idx];

                if( task_params['obj_name'] == '' ){
                    task_params['obj_name'] = 'none';
                    this.AppLogical_Array[idx]['obj_name'] = 'none';
                }

                if( task_params['type_desc'] == '' ){
                    task_params['type_desc'] = 'none';
                    this.AppLogical_Array[idx]['type_desc'] = 'none';
                }

                if( task_params['type_baseurl'] == '' ){
                    task_params['type_baseurl'] = 'none';
                    this.AppLogical_Array[idx]['type_baseurl'] = 'none';
                }

                this.AppLogical_Array = this.AppLogical_Array.filter( (item) => {
                    return item;
                });

                if( this.isInteger(task_params['type_status'])){
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
                                }else{
                                    if( vBackData['Code'] === 'redisplay'){
                                        this.AppLogical_Array2 = vBackData['RowsArray']
                                    }

                                    this.BackgroundMessage = '数据库更新操作，成功完成！';
                                    this.MessageType = 'success';
                                    this.getCode();

                                }

                            }
                        })
                        .catch(( err )=> {
                            this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                            this.MessageType = 'error';
                            this.getCode();
                        });
                }else{
                    this.BackgroundMessage = '状态字段数值不能大于 10 的正整数，不能是小数！' ;
                    this.MessageType = 'error';
                    this.getCode();
                }
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