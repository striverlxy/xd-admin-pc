import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Divider, Typography, Drawer, Popconfirm, Image, Modal, Form, Cascader, message } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const { Option } = Select;
const { RangePicker } = DatePicker;

const { Text, Link } = Typography;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const borderRadius = { borderRadius: 4 }
const inputStyle = { width: 160, borderRadius: 4 }
const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}


const SplitSetting = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const getSplitList = async () => {
        setLoading(true)
        let resp = await httpUtils.get('/admin/order/split/template/list', {})
        setData(resp)
        setLoading(false)
    }

    const [cateOption, setCateOption] = useState([])

    const getCateList = async () => {
        let resp = await httpUtils.get('/admin/cate/list')
        let wrap = wrapTableList(resp.children)
        setCateOption(wrap)
        console.log(wrap)
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
        getSplitList()
        getCateList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '拆单规则',
            dataIndex: 'cateName',
            align: 'center',
            width: 700
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleSplitSettingModalOpen(record)}>编辑</Typography.Link>
                    <Popconfirm placement="topLeft" title="确定删除该拆单规则吗?" onConfirm={() => delSplit(record.id)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger" onClick={() => delSplit(record.id)}>删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const [splitSettingModalProps, setSplitSettingModalProps] = useState({
        visible: false,
        title: '',
    })
    const [splitSettingModalData, setSplitSettingModalData] = useState({})
    const handleSplitSettingModalOpen = data => {
        setSplitSettingModalProps({
            visible: true,
            title: data.id ? '更新拆单规则': '添加拆单规则'
        })
        setSplitSettingModalData(data)
    }
    const handleSplitSettingModalClose = () => {
        setSplitSettingModalProps({
            visible: false,
            title: ''
        })
        setSplitSettingModalData({})
    }

    const handleSplitSettingModalOk = async () => {
        let data = {
            cateId: splitSettingModalData.cateId,
            cateName: splitSettingModalData.cateName
        }
        await httpUtils.post('/admin/order/split/template/add', data)
        message.success('添加成功')
        handleSplitSettingModalClose()
        getSplitList()
    }

    const delSplit = async id => {
        await httpUtils.post(`/admin/order/split/template/del/${id}`, {})
        message.success('删除成功')
        getSplitList()
    }

    return (
        <div>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={handleSplitSettingModalOpen}>
                        增加拆单规则
                    </Button>
                </Space>
                <Table
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={false}
                    loading={loading}
                />
                <Modal
                    destroyOnClose
                    title={splitSettingModalProps.title}
                    visible={splitSettingModalProps.visible}
                    onOk={handleSplitSettingModalOk}
                    onCancel={handleSplitSettingModalClose}
                >
                    <Space direction="vertical">
                        <Text type="warning">当订单出现以下分类的商品时,将该分类下的商品单独拆分为一个订单</Text>
                        <Form size="large" {...layout}>
                            <Form.Item
                                label="商品分类"
                            >
                                <Cascader 
                                    size="large"
                                    options={cateOption}
                                    onChange={e => {
                                        
                                        let tmp = cateOption.slice()
                                        let cateName = ''
                                        for (let i = 0; i < e.length; i++) {
                                            let index = tmp.findIndex(cate => cate.value == e[i])
                                            if (i == e.length - 1) {
                                                cateName = tmp[index].label
                                            }
                                            tmp = tmp[index].children
                                        }
                                        setSplitSettingModalData({
                                            ...splitSettingModalData,
                                            cateId: e[e.length - 1],
                                            cateName
                                        })
                                    }} 
                                    placeholder="请选择商品分类" 
                                />
                            </Form.Item>
                        </Form>
                    </Space>
                </Modal>
            </div>
        </div>
    )
}

export default SplitSetting