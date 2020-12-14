import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, DatePicker, Divider, Drawer, Form} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import PicturesWall from '../../../components/picturesWall'

const { Option } = Select;
const { RangePicker } = DatePicker;
const inputStyle = { width: 160, borderRadius: 4 }
const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs;

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

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            let data = [
                {
                    id: 1,
                    name: "张三",
                    gender: 1,
                    email: '1@123'
                },
                {
                    id: 2,
                    name: "张三02",
                    gender: 1,
                    email: '1@123'
                },
                {
                    id: 3,
                    name: "张三03",
                    gender: 2,
                    email: '1@123'
                },
                {
                    id: 4,
                    name: "张三04张三04张三04",
                    gender: 2,
                    email: '1@123'
                },
                {
                    id: 5,
                    name: "张三05",
                    gender: 1,
                    email: '1@123'
                },
                {
                    id: 6,
                    name: "张三06",
                    gender: 1,
                    email: '1@123'
                }
            ]
            setData(data)
            setLoading(false)
        }, 100)
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
    }
    const handleSpuDrawerClose = () => {
        setSpuDrawerProps({
            visible: false,
            title: '新增商品'
        })
        setSpuDrawerData({})
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
                        <Button style={{ marginRight: 8 }}>
                            暂存不上架
                        </Button>
                        <Button type="primary">
                            保存并上架
                        </Button>
                        </div>
                    }
                >
                    <Form size="large">
                        <Typography.Title level={4}>商品分类</Typography.Title>
                        <Form.Item
                            label="商品分类"
                        >
                            <Input  size="middle"  placeholder="请输入品牌名称"></Input>
                        </Form.Item>
                        <Typography.Title level={4}>基本信息</Typography.Title>
                        <Form.Item
                            label="商品名"
                        >
                            <Input  size="middle"  placeholder="请输入品牌名称"></Input>
                        </Form.Item>
                        <Form.Item
                            label="简介"
                        >
                            <Input  size="middle"  placeholder="请输入品牌名称"></Input>
                        </Form.Item>
                        <Form.Item
                            label="商品图"
                        >
                            <PicturesWall />
                        </Form.Item>
                        <Typography.Title level={4}>价格/规格</Typography.Title>
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