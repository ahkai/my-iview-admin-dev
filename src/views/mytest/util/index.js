let util = {};

util.levelArr = [0, 1, 2, 3];

util.oneOf = (item, arr) => {
    return arr.some(i => {
        return i === item;
    });
};
util.getIndex = (list, name) => {
    for (const i in list) {
        if (list[i] === name) {
            return i;
        }
    }
};

util.dataType = ['all', 'code', 'name'];

util.checkLevel = val => {
    return util.oneOf(val, util.levelArr);
};

util.json2Form=(json)=> {
    var str = [];
    for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}

util.columns_format_1 = [
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

util.columns_format_2 = [
    {
        key: 'service_id',
        title: 'ID'
    },
    {
        key: 'service_type',
        title: '类型'
    },
    {
        key: 'service_name',
        title: '服务名'
    },
    {
        key: 'service_desc',
        title: '服务描述'
    },
    {
        key: 'service_url',
        title: '内部URL'
    },
    {
        key: 'service_func',
        title: '内部FUNC'
    },
    {
        key: 'service_owner',
        title: '创建人'
    },
    {
        key: 'service_date',
        title: '最后修改'
    },
    {
        key: 'service_status',
        title: '状态'
    }
];
util.columns_format_3 = [
    {
        key: 'service_id',
        title: 'ID',
        align: 'center',
        width: 100
    },
    {
        key: 'service_type',
        title: '类型',
        align: 'center',
        width: 100
    },
    {
        key: 'service_name',
        title: '服务名',
        width: 175,
        align: 'center',
        editable: true
    },
    {
        key: 'service_desc',
        title: '服务描述',
        width: 150,
        align: 'center',
        editable: true
    },
    {
        key: 'service_url',
        title: '内部URL',
        width: 100,
        align: 'center',
        editable: true
    },
    {
        key: 'service_func',
        title: '内部FUNC',
        width: 100,
        align: 'center',
        editable: true
    },
    {
        key: 'service_owner',
        title: '创建人',
        align: 'center',
        width: 100
    },
    {
        key: 'service_date',
        title: '最后修改',
        align: 'center',
        width: 150
    },
    {
        key: 'service_status',
        title: '状态',
        width: 80,
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 190,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

util.columns_format_4 = [
    {
        key: 'type_id',
        title: 'ID',
    },
    {
        key: 'type_name',
        title: '分类名称',
    },
    {
        key: 'type_desc',
        title: '分类描述',
    },
    {
        key: 'type_level',
        title: '分类级别',
    },
    {
        key: 'type_uplevel',
        title: '所属级别',
    },
    {
        key: 'type_date',
        title: '创建时间',
    },
    {
        key: 'type_status',
        title: '状态',
    }
];

util.columns_format_5 = [
    {
        key: 'obj_id',
        title: 'ID',
        align: 'center',
        width: 100
    },
    {
        key: 'obj_name',
        title: '分类名称',
        align: 'center',
        width: 200,
        editable: true
    },
    {
        key: 'type_desc',
        title: '分类描述',
        width: 200,
        align: 'center',
        editable: true
    },
    {
        key: 'type_level',
        title: '分类级别',
        width: 100,
        align: 'center',
    },
    {
        key: 'type_uplevel',
        title: '所属级别',
        width: 100,
        align: 'center'
     },
    {
        key: 'type_date',
        title: '创建时间',
        width: 100,
        align: 'center'
    },
    {
        key: 'type_status',
        title: '状态',
        align: 'center',
        width: 100,
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 350,
        key: 'handle',
        handle: ['edit', 'delete', 'search','add' ]
    }
];

util.columns_format_6 = [
    {
        key: 'obj_id',
        title: 'ID',
        align: 'center',
        width: 100
    },
    {
        key: 'obj_name',
        title: '分类名称',
        align: 'center',
        width: 200,
        editable: true
    },
    {
        key: 'type_desc',
        title: '分类描述',
        width: 200,
        align: 'center',
        editable: true
    },
    {
        key: 'type_level',
        title: '分类级别',
        width: 100,
        align: 'center',
    },
    {
        key: 'type_uplevel',
        title: '所属级别',
        width: 100,
        align: 'center'
    },
    {
        key: 'type_date',
        title: '创建时间',
        width: 100,
        align: 'center'
    },
    {
        key: 'type_status',
        title: '状态',
        align: 'center',
        width: 100,
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 250,
        key: 'handle',
        handle: ['edit', 'delete' ]
    }
];

export default util;