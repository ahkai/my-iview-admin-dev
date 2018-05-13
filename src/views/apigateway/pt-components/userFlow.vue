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
        argseries: Object,
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

            myobject:null,

            idname:''

        };
    },

    methods: {

        initflowdata(){
            let vTempObj = {'cpu': 0, 'mem': 0, 'disk': 0, 'networkin': 0, 'networkout': 0};

            if ( typeof (this.argseries) === 'object' && this.id !== '' ){

                let objKeys=Object.keys(this.argseries);

                if ( objKeys.length >= 5 ) {
                    vTempObj = this.argseries;

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

                        this.myobject = userFlow;
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

                        userFlow.setOption(option2);
                        window.addEventListener('resize', function () {
                            userFlow.resize();
                        });

                        this.myobject = userFlow;
                    }

                }
            }
        }

    },

    created(){

    },

    mounted () {
        this.initflowdata();
    },

    destroyed () {
        if (!this.myobject) {
            return
        }
        this.myobject.dispose();
        this.myobject = null;
    },

    watch: {

        argseries(){

            if(this.argseries !== null){
                if ( typeof (this.argseries) === 'object' && this.id !== '' ){
                    this.initflowdata();
                }
            }
        }
    }

};
</script>
