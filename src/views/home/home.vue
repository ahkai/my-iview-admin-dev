<style lang="less">
    @import "./home.less";
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
            <Card>
                <Row>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon>
                        网关当前资源使用情况
                    </p>
                </Row>
                <Row>
                    <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                        <div >
                            <user-flow :argseries="myseries" id="data-source-row1" ref="flow1"></user-flow>
                        </div>
                    </Col>
                    <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                        <div >
                            <user-flow  :argseries="myseries2" id="data-source-row2" ref="flow2"></user-flow>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Row>

        <Alert class="margin-top-10" v-if="showMessage(1)" :type="MessageType" show-icon>
            任务消息：
            <span slot="desc"> {{ BackgroundMessage }} </span>
        </Alert>
    </div>

</template>

<script>
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';

import axios from 'axios';

import util from '../mytest/util/index'

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
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable,
        toDoListItem
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
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: '',

            myseries:[],
            myseries2:[],
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
                            let vTimeLine = vBackData['TaskArgs'];
                            let tempseries = [];
                            let tempobj = {
                                name: '',
                                type: 'gauge',
                                min: 0,
                                max: 100,
                                detail: {
                                    formatter: '{value}%',
                                    fontSize: 18,
                                    offsetCenter: [0, '50px']
                                },
                                data: [{value: 0, name: ''}],
                                center: ['25%', '50%'],
                                radius: '70%',
                                title: {
                                    offsetCenter: [0, '80px']
                                },
                                axisLine: {
                                    lineStyle: {
                                        // color: [],
                                        width: 20
                                    }
                                },
                                splitLine: {
                                    length: 20
                                }
                            };
                            let tempobj2 = {
                                name: '',
                                type: 'gauge',
                                min: 0,
                                max: 100,
                                detail: {
                                    formatter: '{value}%',
                                    fontSize: 18,
                                    offsetCenter: [0, '50px']
                                },
                                data: [{value: 0, name: ''}],
                                center: ['25%', '50%'],
                                radius: '70%',
                                title: {
                                    offsetCenter: [0, '80px']
                                },
                                axisLine: {
                                    lineStyle: {
                                        // color: [],
                                        width: 20
                                    }
                                },
                                splitLine: {
                                    length: 20
                                }
                            };
                            let tempobj3 = {
                                name: '',
                                type: 'gauge',
                                min: 0,
                                max: 100,
                                detail: {
                                    formatter: '{value}%',
                                    fontSize: 18,
                                    offsetCenter: [0, '50px']
                                },
                                data: [{value: 0, name: ''}],
                                center: ['25%', '50%'],
                                radius: '70%',
                                title: {
                                    offsetCenter: [0, '80px']
                                },
                                axisLine: {
                                    lineStyle: {
                                        // color: [],
                                        width: 20
                                    }
                                },
                                splitLine: {
                                    length: 20
                                }
                            };

                            tempobj.data[0]['value'] = Number(vTimeLine['cpu']).toFixed(2) ;
                            tempobj.data[0]['name'] = 'CPU使用率';
                            tempobj['name'] = 'CPU';

                            tempseries.push( tempobj);

                            tempobj2.data[0]['value'] = Number(vTimeLine['mem']).toFixed(2) ;
                            tempobj2.data[0]['name'] = 'MEM使用率';
                            tempobj2['name'] = 'MEM';

                            tempseries.push( tempobj2 );

                            this.myseries = tempseries;

                            this.$refs.flow1.flowupdate(tempseries);

                            let tempseries2 = [];

                            tempobj3.data[0]['value'] = Number(vTimeLine['disk']).toFixed(2) ;
                            tempobj3.data[0]['name'] = 'DISK使用率';
                            tempobj3['name'] = 'DISK';

                            tempseries2.push( tempobj3 );

                            this.myseries2 = tempseries2;

                            this.$refs.flow2.flowupdate(tempseries2);

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
