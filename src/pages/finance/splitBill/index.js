import React, { useState } from 'react'
import { Space, Button, Table, Divider, Typography, Image, Tabs, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const SplitBill = () => {

    const [billList, setBillList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '分账单id',
            dataIndex: 'billCode',
            align: 'center',
        },
        {
            title: '供货农户',
            dataIndex: 'farmer',
            align: 'center',
        },
        {
            title: '集配仓',
            dataIndex: 'priority',
            align: 'center',
        },
        {
            title: '生成时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>打印</Typography.Link>
                    <Typography.Link>详情</Typography.Link>
                </Space>
            )
        }
    ]

    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }}>
                        <Select.Option value="1">成都集配仓</Select.Option>
                        <Select.Option value="2">上海集配仓</Select.Option>
                        <Select.Option value="3">南京集配仓</Select.Option>
                    </Select>
                }
            >
                <TabPane tab="分账单" key="1">
                    <Space>
                        <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />}>
                            新增专题页
                        </Button>
                    </Space>
                    <Table
                        size="small"
                        bordered={true}
                        style={{marginTop: 12}}
                        columns={columns}
                        rowKey={record => record.id}
                        dataSource={billList}
                        pagination={false}
                        loading={tableLoading}
                    />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default SplitBill