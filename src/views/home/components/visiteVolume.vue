<template>
    <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios';

import util from '../../mytest/util/index'

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
    name: 'visiteVolume',
    data () {
        return {
            myoption:{},
            mytooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            mygrid: {
                top: 0,
                left: '2%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            myyAxis: {
                type: 'category',
                data: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun', 'A', 'B'],
                nameTextStyle: {
                    color: '#c3c3c3'
                }
            },
            myxAxis:{
                type: 'value',
                boundaryGap: [0, 0.01]
            },

            myitemStyle:{
                normal:
                    {
                        color: '#2d8cf0'
                    }
            },

            myseries:[
                {
                    name: '访问量',
                    type: 'bar',
                    data: []
                }
            ],

            mycolordef:[ '#2d8cf0','#10A6FF', '#0C17A6', '#4608A6', '#398DBF',
                '#b00000', '#600000', '#263641', '#9534b0', '#1db01d',
                '#13a0b0', '#b0907b', '#53b0a0', '#1112b0', '#b01b58',
                '#1d604b', '#075c60', '#121c60', '#60473d', '#166003'
            ],

            mycolortest0: '#600000',

            myTimer:'',
            BackgroundMessage:'',
            MessageType: 'error'
        };
    },

    methods: {

        getCode(){

        },

        mygetdata(){

            let tempoption = {};
            this.myoption = {};
            let service_params = new URLSearchParams();
            let task_params = {};
            this.myseries[0]['data'] = [];

            service_params.append('service_id', '10000012');       //你要传给后台的参数值 key/value
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

                            this.myyAxis['data'] = vBackData['TimeLine'];

                            let vTemparr = [];
                            let vTempobj = {};

                            for(  let tempitem in vTimeLine ){
                                vTimeLine[tempitem]['itemStyle'] = {normal:{color: '#2d8cf0'}};
                                vTimeLine[tempitem]['itemStyle']['normal']['color'] = this.mycolordef[tempitem];
                            }

                            this.myseries[0]['data'] = vTimeLine;
                            tempoption['tooltip'] = this.mytooltip;
                            tempoption['grid'] = this.mygrid;
                            tempoption['yAxis'] = this.myyAxis;
                            tempoption['series'] = this.myseries;
                            tempoption['xAxis'] = this.myxAxis;

                            this.myoption = tempoption;

                            this.BackgroundMessage = '数据库查询操作，成功完成！';
                            this.MessageType = 'success';

                            this.$nextTick(() => {
                                let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
                                let xAxisData = [];
                                let data1 = [];
                                let data2 = [];
                                for (let i = 0; i < 20; i++) {
                                    xAxisData.push('类目' + i);
                                    data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                                    data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
                                }

                                visiteVolume.setOption(this.myoption);

                                window.addEventListener('resize', function () {
                                    visiteVolume.resize();
                                });

                            });
                        }
                    }
                })
                .catch((err)=> {

                    this.BackgroundMessage = '数据库查询操作，失败！'+ err;
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
        },60000);
    },

    destroyed () {
        clearInterval(this.myTimer);
    }
};
</script>
