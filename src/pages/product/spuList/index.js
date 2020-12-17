import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, DatePicker, Divider, Drawer, Form, Cascader} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import PicturesWall from '../../../components/picturesWall'
import httpUtils from '../../../utils/request'

const { Option } = Select;
const { RangePicker } = DatePicker;
const inputStyle = { width: 160, borderRadius: 4 }
const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
};

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

export default function SpuList() {

    const [data, setData] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 200
    })
    const [loading, setLoading] = useState(false)

    const [cateOption, setCateOption] = useState([])

    const getCateList = async () => {
        let resp = await httpUtils.get('/admin/cate/list')
        let wrap = wrapTableList(resp.children)
        setCateOption(wrap)
    }

    const wrapTableList = cates => {
        let temp = []
        cates.map(item => {
            let obj = {
                value: item.tree.id,
                label: item.tree.cateName
            }
            if (item.children && item.children.length > 0) {
                obj.children = wrapTableList(item.children)
            }
            temp.push(obj)
        })

        return temp
    }

    useEffect(() => {
        getCateList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            align: 'center',
            width: 200
        },
        {
            title: '商品分类',
            dataIndex: 'name',
            align: 'center',
            width: 160
        },
        {
            title: '商品状态',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: 'SKU',
            dataIndex: 'name',
            align: 'center',
            width: 120
        },
        {
            title: '销售价（元）',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '划线价（元）',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '农户分账比例（%）',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '总销量',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 200,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                </Space>
            )
        }
    ];


    const [spuDrawerProps, setSpuDrawerProps] = useState({
        visible: true,
        title: '新增商品'
    })
    const [spuDrawerData, setSpuDrawerData] = useState({})
    const handleSpuDrawerOpen = (data = {}) => {
        setSpuDrawerProps({
            visible: true,
            title: data.id ? '编辑商品' : '新增商品'
        })
        if (data.id) {
            setSpuDrawerData(data)
        }
        getAttrKeyListt()
    }
    const handleSpuDrawerClose = () => {
        setSpuDrawerProps({
            visible: false,
            title: '新增商品'
        })
        setSpuDrawerData({})
    }

    const [choosedAttr, setChoosedAttr] = useState([])
    const [skuList, setSkuList] = useState([])
    const [skuColumns, setSkuColumns] = useState([])

    const [attrKeyList, setAttrKeyList] = useState([])
    const getAttrKeyListt = async () => {
        let params = {
            pageNum: 1,
            pageSize: 10000
        }
        let resp = await httpUtils.get('/admin/item/attr/key/list', params)
        setAttrKeyList(resp.dataList)
    }
    // const getAttrValueList = async keyId => {
    //     let resp = await httpUtils.get(`/admin/item/attr/values/${keyId}`)
    //     return resp
    // }
    const [skuTableDataList, setSkuTableList] = useState([])
    const handleChooseAttr = async e => {
        let newList = []
        
        let column = []
        for (let i = 0; i < e.length; i++) {
            let idx = choosedAttr.findIndex(attr => attr.id == e[i])
            let columnName = ''
            if (idx > -1) {
                newList.push(choosedAttr[idx])
                columnName = choosedAttr[idx].name
            } else {
                let idx = attrKeyList.findIndex(key => key.id == e[i])
                let valueList = await httpUtils.get(`/admin/item/attr/values/${e[i]}`)
                newList.push({
                    id: e[i],
                    name: attrKeyList[idx].keyName,
                    valueList,
                    choosedValueIdList: []
                })
                columnName = attrKeyList[idx].keyName
            }
            column.push({
                title: columnName,
                align: 'center',
                render: record => record.attr ? record.attr.find(a => a.keyName == columnName).valueName : ''
            })
        }
        setChoosedAttr(newList)

        column = column.concat([
            {
                title: '售卖价格',
                align: 'center',
                render: record => <Input style={{width: 100}} onChange={e => changeSkuListInputValue(e, 'salePrice', record.id)} type="number" value={record.salePrice}/>
            },
            {
                title: '农户分润比例',
                align: 'center',
                render: record => <Input style={{width: 100}} onChange={e => changeSkuListInputValue(e, 'farmFeePercent', record.id)} type="number" value={record.farmFeePercent}/>
            }
        ])
        //设置table头部
        setSkuColumns(column)
    }

    const changeSkuListInputValue = (e, valueName, id) => {
        const { value } = e.target
        // let skus = skuList.slice()
        // let index = skus.findIndex(sku => sku.id == id)
        // console.log(index)
        // skus[index][valueName] = value
        // setSkuList(skus)
        console.log(skuList)

        
        // setSkuTableList()
    }

    const changeAttrSelectValue = (e, index) => {
        let newList = choosedAttr.slice()
        newList[index].choosedValueIdList = []
        e.map(item => {
            let o = newList[index].valueList.find(attr => attr.id == item)
            o.keyName = newList[index].name
            newList[index].choosedValueIdList.push(o)
        })
        setChoosedAttr(newList)
        // console.log(newList)
        //笛卡尔算法

        let skuList = []
        let totalAttrList = newList.map(item => item.choosedValueIdList)
        var result = totalAttrList.reduce((last, current) => {
            const array = [];
            last.forEach((par1, index) => {
                current.forEach((par2, idx) => {
                    array.push(index + "_" + idx);
                });
            });
            return array;
        });
        
        result.map(item => {
            let tmp = item.split('_')
            let tmpAttr = []
            for(let i = 0; i < tmp.length; i++) {
                tmpAttr.push(totalAttrList[i][tmp[i]])
            }
            skuList.push({attr: tmpAttr, id: item, salePrice: 0, farmFeePercent: 0})
        })
        setSkuList(skuList)
    }

    const saveSpu = () => {
        console.log(skuList)
        console.log(spuDrawerData)
    }

    const randerTable = () => {
        return (
            <div>
                <Card size="small" title="数据检索" extra={
                    <Space>
                        <Button style={borderRadius} type="primary" size="middle" icon={<SearchOutlined />}>
                                搜索
                        </Button>
                    </Space>
                }>
                    <Space>
                        <Input 
                            style={inputStyle} 
                            size="middle" 
                            placeholder="商品名称" 
                            allowClear 
                        />
                        <Select
                            size="middle"
                            style={inputStyle}
                            placeholder="商品分类"
                            allowClear 
                        >
                            <Option value="1">农户1</Option>
                            <Option value="2">农户2</Option>
                        </Select>
                        <Input 
                            style={inputStyle} 
                            size="middle" 
                            placeholder="SKU编码" 
                            allowClear 
                        />
                    </Space>
                </Card>
                <Space style={{marginTop: 10}}>
                    <Button style={borderRadius} type="primary" size="middle">
                        批量操作
                    </Button>
                    <Button style={borderRadius} type="primary" size="middle" onClick={handleSpuDrawerOpen}>
                        添加商品
                    </Button>
                </Space>
                <Table
                    size="small"
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                />
                <Drawer
                    title={spuDrawerProps.title}
                    destroyOnClose
                    width={720}
                    onClose={handleSpuDrawerClose}
                    visible={spuDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                        style={{
                            textAlign: 'right',
                        }}
                        >
                        <Button style={{ marginRight: 8 }} onClick={() => saveSpu()}>
                            暂存不上架
                        </Button>
                        <Button type="primary">
                            保存并上架
                        </Button>
                        </div>
                    }
                >
                    <Form size="large" {...layout}>
                        <Typography.Title level={4}>商品分类</Typography.Title>
                        <Form.Item
                            label="商品分类"
                        >
                            <Cascader 
                                size="middle"
                                options={cateOption} 
                                onChange={e => {
                                    setSpuDrawerData({
                                        ...spuDrawerData,
                                        cateId: e[e.length - 1]
                                    })
                                }} 
                                placeholder="请选择商品分类" 
                            />
                        </Form.Item>
                        <Typography.Title level={4}>基本信息</Typography.Title>
                        <Form.Item
                            label="商品名"
                        >
                            <Input  
                                size="middle"  
                                placeholder="请输入商品名" 
                                onChange={e => {
                                    const { value } = e.target
                                    setSpuDrawerData({
                                        ...spuDrawerData,
                                        spuName: value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="简介"
                        >
                            <Input  
                                size="middle"  
                                placeholder="请输入简介" 
                                onChange={e => {
                                    const { value } = e.target
                                    setSpuDrawerData({
                                        ...spuDrawerData,
                                        note: value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="商品图"
                        >
                            <PicturesWall saveFileList={e => 
                                setSpuDrawerData({
                                    ...spuDrawerData,
                                    bannerUrls: e
                                })
                            } />
                        </Form.Item>
                        <Form.Item
                            label="商品属性"
                        >
                            <Space direction="vertical" size={20}>
                                <Select
                                    mode="multiple"
                                    size="middle"
                                    placeholder="请选择商品属性" 
                                    style={{ width: 200 }}
                                    onChange={handleChooseAttr}
                                >
                                    {
                                        attrKeyList.map((item, index) => (
                                            <Select.Option value={item.id}>{item.keyName}</Select.Option>
                                        ))
                                    }
                                </Select>
                                <Space>
                                    {
                                        choosedAttr.map((item, index) => (
                                            <Select
                                                key={index}
                                                mode="multiple"
                                                size="middle"
                                                placeholder={`请勾选${item.name}规格值`}
                                                style={{ width: 200 }}
                                                onChange={e => changeAttrSelectValue(e, index)}
                                            >
                                                {
                                                    item.valueList.map((itm, idx) => (
                                                        <Select.Option value={itm.id} key={idx}>{itm.valueName}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        ))
                                    }
                                </Space>
                                <Table
                                    size="small"
                                    bordered={true}
                                    style={{marginTop: 12}}
                                    columns={skuColumns}
                                    rowKey={record => record.id}
                                    dataSource={skuList}
                                    pagination={false}
                                />
                            </Space>
                        </Form.Item>
                        <Form.Item
                            label="商品详情"
                        >
                            <PicturesWall saveFileList={e => 
                                setSpuDrawerData({
                                    ...spuDrawerData,
                                    detailUrls: e
                                })
                            } />
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        )
    }
    
    return (
        <div style={blockStyle}>
            <Tabs>
                <TabPane tab="已上架商品(1000)" key="1">
                    {randerTable()}
                </TabPane>
                <TabPane tab="待上架商品(10)" key="2">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}