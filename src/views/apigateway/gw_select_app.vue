<style lang="less">
    @import './gw.less';
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="17">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        被调用公共条件筛选
                    </p>
                    <Row class="area-linkage-page-row1">
                        <pt-Selector
                                v-model="resDefault"
                                level="2"
                                size="small"
                        />
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10"  v-if="show(1)">
            <Col span="17">
                <Card>
                    <p slot="title">
                        <Icon type="minus-round"></Icon>
                        上层父组件业务操作
                    </p>
                    <Row class="area-linkage-page-row1">
                        <span>插件返回操作目标：</span><br/>
                        <br>
                        <!--<i-input v-for="item in showRes"  :values.sync="item.detail">-->
                        <!--<span slot="prepend">{{item.name+"  "}}</span>-->
                        <!--</i-input>-->

                        <!--<input v-for="(  item, index) in listDetail" :key="index" v-model="listDetail[index]" />-->

                        <li v-for="(item, index) in listDetail">
                            <span>{{ listCol[index]}}</span>
                            <input v-model="listDetail[index]" />
                        </li>

                        <!--                        <li v-for="(item, index) in listDetail" >
                                                    <span>{{ listCol[index]}}</span><i-input  :value.sync="item" placeholder="请输入..." style="width: 300px"></i-input>
                                                </li>-->


                        <br>
                        <br>

                        <!--{{ showRes }}-->
                        <!--<br>-->
                        <!--{{listCol}}-->
                        <!--<br>-->
                        <!--{{listDetail}}-->
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    // import alSelector from './components/al-selector.vue';
    // import alCascader from './components/al-cascader.vue';

    //import ptSelector from './pt-components/pt-selector/pt_selector.vue';

    import Vue from 'vue';
    import ptComponents from './pt-components/index';

    Vue.use(ptComponents);

    export default {
        // components: {
        //     alSelector,
        //     alCascader
        // },
        data () {
            return {
                res1: [],
                //resDefault: { 'OBJ_NAME':'system', 'USER_NAME':'none' } ,
                resDefault: [ 'system', '2' ] ,
                showRes: [],
                showFlag:false,
                listCol:[],
                listDetail:[]
            };
        },
        methods: {
            renderFormat (label) {
                return label.join(' => ');
            },

            show(var1){
                return this.showFlag;
            },

            print() {
                console.log(this.showRes);
            }
        },
        watch: {
            res1 (val) {
                this.showRes = val;
            },
            resDefault (val) {

                this.showRes = val;
                this.showFlag = true;

                this.listDetail = [];
                this.listCol = [];

                for( var index in this.showRes){

                    if( index%2 ){
                        this.listDetail.push(this.showRes[index]);
                    }else{
                        this.listCol.push(this.showRes[index]);
                    }

                }
            }
        }
    };
</script>