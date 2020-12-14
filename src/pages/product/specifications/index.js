import React, { useState } from 'react'
import { Space, Button, Table, Divider, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

const borderRadius = { borderRadius: 4 }

const Specifications = () => {

    const [specificationList, setSpecificationList] = useState([
        {
            id: 1,
            name: '重量',
            attrValue: '100g、200g、300g、400g、500g'
        },
        {
            id: 2,
            name: '盒',
            attrValue: '1、2、3'
        }
    ])
    const [tableLoading, setTableLoading] = useState(false)

    const columns = [
        {
            title: '规格名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '规格值',
            dataIndex: 'attrValue',
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
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />}>
                    新增商品规格
                </Button>
            </Space>
            <Table
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={specificationList}
                pagination={false}
                loading={tableLoading}
            />
        </div>
    )
}

export default Specifications