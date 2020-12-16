import React, { useState } from 'react'
import { Space, Button, Table, Divider, Typography, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

const borderRadius = { borderRadius: 4 }

const CustomerList = () => {

    const [customerList, setCustomerList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '用户id',
            dataIndex: 'userCode',
            align: 'center',
        },
        {
            title: '用户昵称',
            dataIndex: 'nickname',
            align: 'center',
        },
        {
            title: '推广人',
            dataIndex: 'nickname',
            align: 'center',
        },
        {
            title: '推广站点',
            dataIndex: 'nickname',
            align: 'center',
        },
        {
            title: '注册时间',
            dataIndex: 'priority',
            align: 'center',
        },
        {
            title: '下单数量',
            dataIndex: 'priority',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                </Space>
            )
        }
    ]

    return (
        <div>
            <Table
                size="small"
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={customerList}
                pagination={false}
                loading={tableLoading}
            />
        </div>
    )
}

export default CustomerList