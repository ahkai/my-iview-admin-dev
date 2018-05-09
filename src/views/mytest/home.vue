<style lang="less">
    @import "./mytest.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    当前网关服务调用量
                </p>
                <div class="line-chart-con">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        当日累计微服务访问TOP10统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        当日微服务二级分类项占比
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        网关当前CPU、MEM资源使用情况
                    </p>
                    <div  class="data-source-row">
                        <user-flow :argseries="myseries" id="flow1" ref="flow1"></user-flow>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        网关当前DISK、NETWORK资源使用情况
                    </p>
                    <div  class="data-source-row">
                        <user-flow  :argseries="myseries2" id="flow2" ref="flow2"></user-flow>
                    </div>
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
import dataSourcePie from './pt-components/dataSourcePie.vue';
import visiteVolume from './pt-components/visiteVolume.vue';
import serviceRequests from './pt-components/serviceRequests.vue';
import userFlow from './pt-components/userFlow.vue';

import axios from 'axios';

import util from './util/index'

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


export default {
    name: 'home',
    components: {
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow
    },
    data () {
        return {
            toDoList: [
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                }
            ],
            count: {
                createUser: 496,
                visit: 3264,
                collection: 24389305,
                transfer: 39503498
            },

            showAddNewTodo: false,
            newToDoItemValue: '',

            myseries:[],
            myseries2:[],
            myseries3:[],
            myTimer:'',
            myTimer2:'',

            showMsgFlag:false,
            BackgroundMessage :'',
            MessageType :''
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        },

        showMessage(var2){
            return this.showMsgFlag;
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

        mygetdata(){

            this.myseries = [];
            this.myseries2 = [];
            this.myseries3 = [];

            let service_params = new URLSearchParams();
            let task_params = {};

            service_params.append('service_id', '10000014');       //你要传给后台的参数值 key/value
            task_params = 'none';

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
                            let vTimeLine = { 'cpu':0, 'mem':0, 'disk':0, 'network':0 };
                            vTimeLine = vBackData['TaskArgs'];

                            this.$refs.flow1.flowupdate(vTimeLine);
                            this.$refs.flow2.flowupdate(vTimeLine);

                            this.BackgroundMessage = '数据库查询操作，成功完成！';
                            this.MessageType = 'success';

                            console.log('BBBBBBBBBBBBB');

                        }
                    }
                })
                .catch( (err) => {
                    this.BackgroundMessage = '数据库查询操作，失败！'+ err;
                    this.MessageType = 'error';
                    this.getCode();
                });

        },

        init(){
            this.mygetdata();
        }
    },

    mounted(){
        this.myTimer2 = setInterval(() => {
            this.init();
        },12000);
    },

    destroyed () {
        clearInterval(this.myTimer2);
        clearInterval(this.myTimer);
    }

};
</script>
