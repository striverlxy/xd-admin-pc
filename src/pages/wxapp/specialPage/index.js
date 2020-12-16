import React, { useState } from 'react'
import { Space, Button, Table, Divider, Typography, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

const borderRadius = { borderRadius: 4 }

const SpecialPage = () => {

    const [specialPageList, setSpecialPageList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const columns = [
        {
            title: '专题名',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '专题图标',
            dataIndex: 'icon',
            align: 'center',
        },
        {
            title: '专题详情图片',
            dataIndex: 'imgUrl',
            align: 'center',
            render: imgUrl => <Image src={imgUrl} />
        },
        {
            title: '排序',
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
                dataSource={specialPageList}
                pagination={false}
                loading={tableLoading}
            />
        </div>
    )
}

export default SpecialPage