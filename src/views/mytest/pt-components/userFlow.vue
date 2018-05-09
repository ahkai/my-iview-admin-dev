<template>
    <div style="width:100%;height:100%;"  :id="id"></div>
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

const option = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
        {
            name: 'CPU',
            type: 'gauge',
            min: 0,
            max: 100,
            detail: {
                formatter: '{value}%',
                fontSize: 18,
                offsetCenter: [0, '50px']
            },
            data: [{value: 50, name: 'CPU使用量'}],
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
        },
        {
            name: 'MEM',
            type: 'gauge',
            min: 0,
            max: 100,
            detail: {
                formatter: '{value}%',
                fontSize: 18,
                offsetCenter: [0, '50px']
            },
            data: [{value: 50, name: 'MEM使用量'}],
            center: ['75%', '50%'],
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
        }
    ]
};

const option2 = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
        {
            name: 'CPU',
            type: 'gauge',
            min: 0,
            max: 100,
            detail: {
                formatter: '{value}%',
                fontSize: 18,
                offsetCenter: [0, '50px']
            },
            data: [{value: 50, name: 'CPU使用量'}],
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
        },
        {
            name: 'MEM',
            type: 'gauge',
            min: 0,
            max: 100,
            detail: {
                formatter: '{value}%',
                fontSize: 18,
                offsetCenter: [0, '50px']
            },
            data: [{value: 50, name: 'MEM使用量'}],
            center: ['75%', '50%'],
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
        }
    ]
};

export default {
    name: 'userFlow',

    props: {
        value:Array,
        argseries: Array,
        id: String

    },

    data () {
        return {
            myoption:{},
            myoption2:{},
            mytooltip: {
                formatter: '{a} <br/>{b} : {c}%'
            },

            mycolordef:[ '#2d8cf0','#10A6FF', '#0C17A6', '#4608A6', '#398DBF',
                '#b00000', '#600000', '#263641', '#9534b0', '#1db01d',
                '#13a0b0', '#b0907b', '#53b0a0', '#1112b0', '#b01b58',
                '#1d604b', '#075c60', '#121c60', '#60473d', '#166003'
            ],

            mycolortest0: '#600000',

            myTimer:'',
            BackgroundMessage:'',
            MessageType: 'error',

            idname:''

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

                            this.myseries[0].data[0]['value'] = Number(vTimeLine['cpu']).toFixed(2) ;
                            this.myseries[1].data[0]['value'] = Number(vTimeLine['mem']).toFixed(2);
                            this.myseries2[0].data[0]['value'] = Number(vTimeLine['disk']).toFixed(2);

                            this.myoption['series'] = this.myseries;
                            this.myoption['tooltip'] = this.mytooltip;

                            this.myoption2['series'] = this.myseries2;
                            this.myoption2['tooltip'] = this.mytooltip;

                            this.BackgroundMessage = '数据库查询操作，成功完成！';
                            this.MessageType = 'success';

                            // let userFlow = echarts.init(document.getElementsByName('userflow1'));
                            // let userFlow2 = echarts.init(document.getElementsByName('userflow2'));

                            let userFlow = echarts.init(document.getElementById('user_flow'));
                            // let userFlow2 = echarts.init(document.getElementById('user_flow'));
                            userFlow.setOption( this.myoption );
                            // userFlow2.setOption( this.myoption2);

                            window.addEventListener('resize', function () {
                                userFlow.resize();
                            });

                            // window.addEventListener('resize', function () {
                            //     userFlow2.resize();
                            // });

                        }
                    }
                })
                .catch((err)=> {

                    this.BackgroundMessage = '数据库查询操作，失败！'+ err;
                    this.MessageType = 'error';
                    this.getCode();
                });

        },

        getuserflowitem( ){

            // let headings = document.getElementsByTagName("user_flow");
            //
            // for ( let i = 0; i < headings.length; i++ )  {
            //     let h = headings[i];
            //
            //     if(( i + 1 ) == Number(this.seqid) || (i+1) == headings.length)
            //         return h;
            // }

            // let Ul = document.getElementsByClassName( this.seqid );
            //
            // return Ul[0];

            return document.getElementById( this.id );

        },

        init(){
            this.myoption = {};
            this.mygetdata();
        },

        flowupdate: function (vTempArray) {

            let vTempObj = {'cpu': 0, 'mem': 0, 'disk': 0, 'network': 0};

            if ( typeof (vTempArray) === 'object' ){

                let objKeys=Object.keys(vTempArray);

                if ( objKeys.length >= 3 ) {
                    vTempObj = vTempArray;
                }
            }

            let userFlow = echarts.init(document.getElementById(this.id));

            if (this.id === 'flow1') {
                option.name = 'CPU';
                option.series[0].data[0].name = 'CPU使用率';
                option.series[0].data[0].value = Number(vTempObj['cpu']).toFixed(2);
                option.name = 'MEM';
                option.series[1].data[0].name = 'MEM使用率';
                option.series[1].data[0].value = Number(vTempObj['mem']).toFixed(2);

                userFlow.setOption(option);
                window.addEventListener('resize', function () {
                    userFlow.resize();
                });
            }

            if (this.id === 'flow2') {
                option2.name = 'DISK';
                option2.series[0].data[0].name = 'DISK使用率';
                option2.series[0].data[0].value = Number(vTempObj['disk']).toFixed(2);
                option2.name = 'NETWORK';
                option2.series[1].data[0].name = 'NETWORK流量';
                option2.series[1].data[0].value = ((vTempObj['networkin'] + vTempObj['networkout'])/1024).toFixed(2);
                option2.series[1].max = 100;
                // option.series[1].detail.formatter = '{value} byte/s';
                option2.series[1].detail.formatter = '{value} KB/s';

                console.log( vTempObj['networkin'] + vTempObj['networkout'] );

                userFlow.setOption(option2);
                window.addEventListener('resize', function () {
                    userFlow.resize();
                });
            }


        }
    },

    mounted () {

        // this.init();
        // this.myTimer = setInterval(() => {
        //     this.init();
        // },12000);

        this.flowupdate();

    },

    destroyed () {
        // clearInterval(this.myTimer);
    }
};
</script>
