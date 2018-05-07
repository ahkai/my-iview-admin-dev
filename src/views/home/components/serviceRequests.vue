<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios';

// import util from '/src/views/mytest/util/index';
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
    name: 'serviceRequests',
    data () {
        return {
            myoption:{},
            mytooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            mygrid: {
                top: '3%',
                left: '1.2%',
                right: '1%',
                bottom: '3%',
                containLabel: true
            },
            myyAxis: [
                {
                    type: 'value',
                }
            ],
            myxAxis:[
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        }
                    ],
            myseries:[],
            myseries2:{},
            myseriestype:'line',
            mylabel:{
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },

            myareaStyle: {normal: {
                    color: ''
                }},

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

            // if(this.MessageType === 'error'){
            //     this.myCount_total = 6;
            // }else{
            //     this.myCount_total = 2;
            // }
            //
            // if (!this.myTimer) {
            //     this.myCount = this.myCount_total;
            //     this.showMsgFlag = true;
            //     this.myTimer = setInterval(() => {
            //         if (this.myCount > 0 && this.myCount <= this.myCount_total) {
            //             this.myCount--;
            //         } else {
            //             this.showMsgFlag = false;
            //             clearInterval(this.myTimer);
            //             this.myTimer = null;
            //         }
            //     }, 1000)
            // }
        },

        mygetdata(){

            let tempoption = {};
            let service_params = new URLSearchParams();
            let task_params = {};
            this.myseries = [];

            service_params.append('service_id', '10000011');       //你要传给后台的参数值 key/value
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

                            this.myxAxis[0]['data'] = vBackData['TimeLine'];

                            for(  let tempitem in vTimeLine ){

                                vTimeLine[tempitem]['stack'] = '总量';
                                vTimeLine[tempitem]['type'] = this.myseriestype;
                                vTimeLine[tempitem]['areaStyle'] = this.myareaStyle;
                                vTimeLine[tempitem]['areaStyle']['normal']['color'] = this.mycolordef[tempitem];

                                if( tempitem == (vTimeLine.length - 1) ){
                                    vTimeLine[tempitem]['label'] = this.mylabel;
                                }
                            } 

                            this.myseries = vTimeLine;

                            tempoption['tooltip'] = this.mytooltip;
                            tempoption['grid'] = this.mygrid;
                            tempoption['yAxis'] = this.myyAxis;
                            tempoption['series'] = this.myseries;
                            tempoption['xAxis'] = this.myxAxis;

                            this.myoption = tempoption;

                            this.BackgroundMessage = '数据库查询操作，成功完成！';
                            this.MessageType = 'success';

                            const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
                            serviceRequestCharts.setOption( this.myoption );

                            window.addEventListener('resize', function () {
                                serviceRequestCharts.resize();
                            });

                        }
                    }
                })
                .catch((err)=> {
                    this.myseries = [];
                    this.myoption = {};
                    this.myxAxis[0]['data'] = [];
                    this.BackgroundMessage = '数据库查询操作，失败！'+ err;
                    this.MessageType = 'error';
                    this.getCode();
                });

        },

        init(){
            this.myseries = [];
            this.myoption = {};
            this.myxAxis[0]['data'] = [];
            this.mygetdata();
        }
    },

    mounted () {

        this.init();

        this.myTimer = setInterval(() => {
            this.init();
        },6000);

    },
    watch :{

        // option (data) {
        //     // this.init();
        // }

    },

    destroyed () {
        clearInterval(this.myTimer);
    }

};
</script>