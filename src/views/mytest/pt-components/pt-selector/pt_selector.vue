<template>
    <div>
        <Row :gutter="gutterNum">
            <Col :span="span" v-if="show(1)">
                <Select
                    ref="LEVEL1"
                    v-model="FirstLevel_Value"
                    filterable
                    transfer
                    :size="size"
                    style="width:100%">

                    <Option v-for=" item in FirstLevel_Array" :value="item.app_cname" :key="item.app_id">{{ item.app_cname }}</Option>
                </Select>
            </Col>
            <Col :span="span" v-if="show(2)">
                <Select
                    ref="LEVEL2"
                    v-model="SecondLevel_Value"
                    filterable
                    transfer
                    :size="size"
                    style="width:100%">
                    <Option v-for=" item in FirstLevel_Array" :value="item.app_ename" :key="item.app_id">{{ item.app_ename }}</Option>
                </Select>
            </Col>
            <!--<Col :span="span" v-if="show(2)">
                <Select
                    ref="coun"
                    v-model="currCou"
                    @on-change="hasChange"
                    :filterable="searchable"
                    :placeholder="phHandled(2)"
                    :size="size"
                    :not-found-text="ndsHandled(2)"
                    :disabled="disabled === undefined ? false : disHandled(2)"
                    transfer
                    style="width:100%">
                    <Option v-for="item in counList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </Col>-->
            <Col :span="span">
                <span @click="handleSearchItem" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <i-table @on-current-change="RetSelectData" highlight-row height="200" :columns="columns_def" :data="AppLogical_Array" ></i-table>
        </Row>
        <slot></slot>
        <!--<span>{{ AppLogical_Array}}</span>-->
    </div>
</template>

<script>

import util from '../../util/index';
const newLinkageArr = util.levelArr;
//const dataTypeArr = util.dataType;

import axios from 'axios';

let httpinstance = axios.create({
    baseURL: 'http://192.168.232.11:5000'
});

// var httpinstance = axios.create({
//     baseURL: 'http://192.168.58.11:5000'
// });

let config_axios =  {
    method: 'post',
    url: '',
    headers: {
        'Content-type': 'application/x-www-form-urlencoded'
        //'Content-type': 'application/json'
    },
    data: [],
    //params:[]
};

let service_params = new URLSearchParams();
let task_params = {};

const url_route = {
    'system' : '10000001' ,
    'app_id' : '10000002' ,
    'service' : '10000003' ,
    'service_id' : '10000004'
};


const columns_format = [
/*    {
        type: 'selection',
        width: 60,
        align: 'center'
    },*/
    {
        key: 'logical_id',
        title: 'ID'
    },
    {
        key: 'logical_name',
        title: '机器名'
    },
    {
        key: 'logical_type',
        title: '设备类型'
    },
    {
        key: 'cpu_num',
        title: '处理器'
    },
    {
        key: 'mem_num',
        title: '内存'
    },
/*    {
        key: 'os_type_id',
        title: '操作系统ID'
    },*/
    {
        key: 'type_desc',
        title: '描述1'
    },
    {
        key: 'type_desc2',
        title: '描述2'
    }
];

export default {
    name: 'ptSelector',
    data () {
        return {
            GetJsonStr : '',
            FirstLevel_Value: '',
            SecondLevel_Value: '',
            ThirdLevel_Value: '',
            FourthLevel_Value: '',

            FirstLevel_Array: {},
            cityList: {},
            counList: {},
            streList: {},

            FirstIndex: 0,
            SecondIndex: 0,
            ThirdIndex: 0,
            FourthIndex: 0,

            AppLogical_Array:[],
            columns_def:columns_format,

            isInit: true,
            defaultPlaceholder: ['请选择', '请选择', '请选择', '请选择'],
            defaultnotFoundText: ['无匹配', '无匹配', '无匹配', '无匹配'],
            cloneValue: []
        };
    },
    props: {
        gutter: {
            type: [String, Number],
            default: 10
        },
        level: {
            type: [String, Number],
            default: 3,
            validator: val => {
                return util.oneOf(parseInt(val), newLinkageArr);
            }
        },
        value: {
            type: Array
        },
        searchable: {
            type: Boolean,
            default: false
        },
/*        dataType: {
            type: String,
            default: 'all',
            validator: (val) => {
                //return util.oneOf(val, dataTypeArr);
            }
        },*/
        auto: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [Array, String],
            default () {
                return this.defaultPlaceholder;

            }
        },
        size: {
            type: String,
            default: 'default'
        },
        notFoundText: {
            type: [String, Array],
            default () {
                return this.defaultnotFoundText;
            }
        },
        disabled: {
            type: [Boolean, Array, Number],
            default: false
        }
    },
    computed: {
        gutterNum () {
            if (typeof this.gutter === 'number') {
                return this.gutter;
            } else {
                return parseInt(this.gutter);
            }
        },
        showLevel () {
            return parseInt(this.level);
        },
        span () {
           if (util.oneOf(this.showLevel, newLinkageArr)) {
                return 24 / (this.showLevel + 1);
            }
        }
    },
    watch: {
        FirstLevel_Value (newValue) {

            for (let ArrayItem of this.FirstLevel_Array) {

                if (ArrayItem.app_cname === newValue) {
                    this.SecondLevel_Value = ArrayItem.app_ename;
                }

            }
        },

        SecondLevel_Value (newValue) {

            for( let ArrayItem of this.FirstLevel_Array){

                if( ArrayItem.app_ename === newValue ){
                    this.FirstLevel_Value = ArrayItem.app_cname ;
                }

            }
        }

    },
    methods: {
        init () {

            console.log( "AAA:"+this.value[0]);
            console.log( "BBB:"+this.value[1]);
            console.log( "CCC:"+this.level);

            //config_axios.params['service_id'] = '10000001';

            service_params = new URLSearchParams();
            service_params.append('service_id', url_route[ this.value[0] ]);       //你要传给后台的参数值 key/value

            //postdata:Util.json2Form(params)

            config_axios.data = service_params;
            config_axios.url = '/task';

            // httpinstance.get( '/getlevel/1' )
            // httpinstance.post('/task?service_id=10000001')

            httpinstance( config_axios )
                .then((res) => {

                    //console.log( "BBB:"+ res.data);

                    if (res.status === 200) {

                        this.GetJsonStr = res.data;

                        this.FirstLevel_Array = this.GetJsonStr['LEVEL_1'] ;

                        //console.log( "BBB:"+ this.FirstLevel_Array);
                    }
                })
                .catch(function(err) {
                    console.log(err); // 从数据库获取数据出现问题
                });
        },

        show (level) {

            return level <= this.showLevel;
        },

        handleSearchItem(){

            let url_route_id = 'none';

            if ( this.value[0] === 'system' ){
                url_route_id = "app_id" ;
            }

            if ( this.value[0] === 'service' ){
                url_route_id = "service_id" ;
            }

            for( let ArrayItem of this.FirstLevel_Array){
                if( ArrayItem.app_ename === this.SecondLevel_Value ){

                    //httpinstance.get('/getlogical/'+ArrayItem.app_id)
                    //httpinstance.post('/task?service_id=10000002&' + ArrayItem.app_id )

                    service_params = new URLSearchParams();
                    task_params = {};

                    service_params.append('service_id', url_route_id );       //要传给后台的参数值 key/value
                    task_params[ 'app_id' ] = ArrayItem.app_id;

                    //var sTemp = util.json2Form(task_params);
                    //console.log( "CCC:"+ sTemp );
                    //service_params.append( 'service_args', sTemp );

                    service_params.append( 'service_args', util.json2Form(task_params) );
                    console.log( "service_args:" + service_params.get('service_args') );

                    config_axios.data = service_params;
                    config_axios.url = '/task';

                    httpinstance(config_axios)
                        .then((res) => {
                            if (res.status === 200) {
                                this.GetJsonStr = res.data;
                                this.AppLogical_Array = this.GetJsonStr['LOGICAL_INFO'] ;
                            }
                        })
                        .catch(function(err) {
                            console.log(err); // 从数据库获取数据出现问题
                        });

                    break
                }
            }
        },

        RetSelectData(currentRow , oldCurrentRow){

            // this.$emit('input', [ '1','2']);
            // this.$emit('on-change', [ '1','2']);
            let arr = [];
/*            Object.keys(currentRow).forEach(v => {
                let o = {};
                o['name'] = v;
                o['detail'] = currentRow[v];
                //o[v] = currentRow[v];
                arr.push(o);
            });*/

            Object.keys(currentRow).forEach(v => {
                arr.push(v);
                arr.push(currentRow[v]);
            });


            this.$emit('input', arr);
            // this.$emit('on-change', currentRow);
        },


        /*
        returnRes (level) {
            if (this.auto) {
                this.returnResArr(this.showLevel);
            } else {
                this.returnResArr(level);
            }
        },
        setNextSelect (index) {
            return areaData[this[index]][Object.keys(areaData[this[index]])[0]];
        },
        returnResArr (level) {
            let res = [];
            let i = 0;
            let codeArr = [this.provIndex, this.cityIndex, this.counIndex, this.streIndex];
            let nameArr = [this.currPro, this.currCit, this.currCou, this.currStr];
            if (this.dataType === 'name') {
                while (i <= level) {
                    if (nameArr[i]) {
                        res.push(nameArr[i]);
                    }
                    i++;
                };
            } else if (this.dataType === 'all') {
                while (i <= level) {
                    if (codeArr[i] && nameArr[i]) {
                        let item = {
                            code: codeArr[i],
                            name: nameArr[i]
                        };
                        res.push(item);
                    }
                    i++;
                }
            } else {
                while (i <= level) {
                    if (codeArr[i]) {
                        res.push(codeArr[i]);
                    }
                    i++;
                };
            }
            this.$emit('input', res);
            this.$emit('on-change', res);
        },
        hasChange () {
            this.isInit = false;
        },
        phHandled (level) {
            if (typeof this.placeholder === 'string' && this.placeholder !== '') {
                return this.placeholder;
            } else {
                if (this.placeholder && this.placeholder[level]) {
                    return this.placeholder[level];
                } else {
                    return this.defaultPlaceholder[level];
                }
            }
        },
        ndsHandled (index) {
            if (typeof this.notFoundText === 'string' && this.notFoundText !== '') {
                return this.notFoundText;
            } else {
                if (!this.notFoundText) {
                    return this.defaultnotFoundText[index];
                } else {
                    if (this.notFoundText[index]) {
                        return this.notFoundText[index];
                    } else {
                        return this.defaultnotFoundText[index];
                    }
                }
            }
        },
        disHandled (level) {
            if (typeof this.disabled === 'number') {
                if (util.oneOf(this.disabled, areaLinkageArr)) {
                    if (level >= this.disabled) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if (Array.isArray(this.disabled)) {
                let i = 0;
                let isDis = false;
                while (this.disabled[i]) {
                    if (this.disabled[i] === level) {
                        isDis = true;
                        break;
                    }
                    i++;
                }
                return isDis;
            } else {
                return this.disabled;
            }
        }*/
    },
    // updated () {
    //     this.init();
    // },

/*    created(){

        this.init();
    },*/

    mounted () {
        this.init();
    }
};
</script>
