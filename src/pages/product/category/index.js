import React, { useState } from 'react'
import { Space, Button, Table, Divider, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

const borderRadius = { borderRadius: 4 }

const Category = () => {

    const [categotyList, setCategoryList] = useState([
        {
            id: 1,
            name: '新鲜水果',
            children: [
                {
                    id: 10,
                    name: '热带水果',
                    children: [
                        {
                            id: 100,
                            name: '苹果',
                        },
                        {
                            id: 101,
                            name: '梨子',
                        }
                    ]
                },
                {
                    id: 11,
                    name: '寒带水果'
                }
            ]
        }
    ])
    const [tableLoading, setTableLoading] = useState(false)

    const columns = [
        {
            title: '分类名',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>增加子类</Typography.Link>
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
                    添加
                </Button>
            </Space>
            <Table
                showHeader={false}	
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={categotyList}
                pagination={false}
                loading={tableLoading}
            />
        </div>
    )
}

export default Category