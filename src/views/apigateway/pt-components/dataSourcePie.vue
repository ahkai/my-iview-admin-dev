<template>
    <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios';

import util from '../util/index'

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
    name: 'dataSourcePie',
    data () {
        return {
            myoption:{},
            mytooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            mylegend: {
                orient: 'vertical',
                left: 'right',
                data: []
            },
            myitemStyle:{normal: {color: '#9bd598'}},
            myseries:[
                {
                    name: '服务二级分类',
                    type: 'pie',
                    radius: '66%',
                    center: ['50%', '60%'],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],

            mycolordef:[ '#2d8cf0','#1db01d', '#0C17A6', '#4608A6', '#398DBF',
                '#b00000', '#600000', '#263641', '#9534b0', '#10A6FF',
                '#13a0b0', '#b0907b', '#53b0a0', '#1112b0', '#b01b58',
                '#1d604b', '#075c60', '#121c60', '#60473d', '#166003'
            ],

            mycolortest0: '#1db01d',

            myTimer:'',
            BackgroundMessage:'',
            MessageType: 'error'
        };
    },

    methods: {

        getCode(){

        },

        mygetdata(){
            if( document.getElementById('data_source_con') === null ){
                return;
            }

            let tempoption = {};
            this.myoption = {};
            let service_params = new URLSearchParams();
            let task_params = {};
            this.myseries[0]['data'] = [];
            this.mylegend['data'] = [];

            service_params.append('service_id', '10000013');       //你要传给后台的参数值 key/value
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

                            let vTemparr = [];
                            let vTempobj = {};

                            this.mylegend['data'] = vBackData['TimeLine'];

                            for(  let tempitem in vTimeLine ){
                                vTimeLine[tempitem]['itemStyle'] ={normal: {color: '#9bd598'}};
                                vTimeLine[tempitem]['itemStyle']['normal']['color'] = this.mycolordef[tempitem];
                            }

                            this.myseries[0]['data'] = vTimeLine;
                            tempoption['tooltip'] = this.mytooltip;
                            tempoption['legend'] = this.mylegend;
                            tempoption['series'] = this.myseries;

                            this.myoption = tempoption;

                            this.BackgroundMessage = '数据库查询操作，成功完成！';
                            this.MessageType = 'success';

                            this.$nextTick(() => {
                                let dataSourcePie = echarts.init(document.getElementById('data_source_con'));

                                dataSourcePie.setOption(this.myoption);

                                window.addEventListener('resize', function () {
                                    dataSourcePie.resize();
                                });

                            });
                        }
                    }
                })
                .catch((err)=> {

                    this.BackgroundMessage = '数据库查询操作，失败！'+ err;

                    console.log('error:'+err);

                    this.MessageType = 'error';
                    this.getCode();
                });

        },

        init(){
            this.myoption = {};
            this.mygetdata();
        }
    },

    mounted () {

        this.init();

        this.myTimer = setInterval(() => {
            this.init();
        },600000);
    },

    destroyed () {
        clearInterval(this.myTimer);
    }

};
</script>
