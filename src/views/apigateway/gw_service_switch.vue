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
                        网关微服务状态切换控制
                    </p>
                    <Row >
                        <i-select :model.sync="FirstLevel_Array" style="width:200px" @on-change="getleveltwo" >
                            <i-option v-for="(firstitem, index) in FirstLevel_Array" :value="firstitem.obj_id" :key="index">{{firstitem.obj_name}}</i-option>
                        </i-select>
                        <Button type="primary" @click="toLoading" :disabled="Button1Flag" icon="ios-color-wand-outline">刷新路由配置</Button>
                    </Row>
                </Card>
                <Card>
                    <Tabs type="card" :animated="false" >
                        <Tab-pane  v-for="(secondaryitem, index) in SecondLevel_Array" :label="secondaryitem.obj_name" :key="index">
                            <pt-switchtab :switchtabid="secondaryitem.obj_id" v-on:childgetcode="childgetcode">

                            </pt-switchtab>
                        </Tab-pane>
                    </Tabs>
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

                FirstLevel_Array:[],
                SecondLevel_Array:[],

                showMsgFlag:false,
                BackgroundMessage:'',
                MessageType : '',

                Button1Flag:true,

                TestKey: '',



                myCount: 0,
                myCount_total:4,
                myTimer: null
            };
        },
        methods: {

            childgetcode( childmsg, childmsgtype, id){

                this.MessageType  = childmsgtype;
                this.BackgroundMessage = childmsg;

                if( id === 2){
                    this.Button1Flag = false;
                }

                this.getCode();

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

            toLoading(){
                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000003');       //你要传给后台的参数值 key/value
                task_params['obj_id'] = 'none';

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let TempObj = res.data;
                            this.FirstLevel_Array = TempObj['LEVEL_1'];

                            this.BackgroundMessage = '数据库更新操作，成功完成！';
                            this.MessageType = 'success';
                            this.getCode();


                        }
                    })
                    .catch(( err )=> {
                        this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                        this.MessageType = 'error';
                        this.getCode();
                    });
            },

            getlevelone () {

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000003');       //你要传给后台的参数值 key/value
                task_params['obj_id'] = 'none';

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let TempObj = res.data;
                            this.FirstLevel_Array = TempObj['LEVEL_1'];

                            this.BackgroundMessage = '数据库更新操作，成功完成！';
                            this.MessageType = 'success';
                            this.getCode();


                        }
                    })
                    .catch(( err )=> {
                        this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                        this.MessageType = 'error';
                        this.getCode();
                    });

            },

            getleveltwo( vSelectValue){

                let service_params = new URLSearchParams();
                let task_params = {};

                service_params.append('service_id', '10000004');       //你要传给后台的参数值 key/value
                task_params['type_id'] = vSelectValue;

                service_params.append( 'service_args', util.json2Form(task_params) );

                config_axios.data = service_params;
                config_axios.url = '/task';

                httpinstance( config_axios )
                    .then((res) => {
                        if (res.status === 200) {

                            let TempObj = res.data;
                            this.SecondLevel_Array = TempObj['LEVEL_2'];

                            this.BackgroundMessage = '数据库更新操作，成功完成！';
                            this.MessageType = 'success';
                            this.getCode();


                        }
                    })
                    .catch(( err )=> {
                        this.BackgroundMessage = '数据库更新操作，失败！' + err ;
                        this.MessageType = 'error';
                        this.getCode();
                    });
            }
        },

        watch: {

        },

        mounted(){
            this.getlevelone();
        }
    };
</script>