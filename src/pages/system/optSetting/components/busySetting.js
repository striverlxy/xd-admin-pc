import React, { useEffect, useState } from 'react'
import styles from './style.less'
import { Form, Input, Button, Upload, Typography, Space, TimePicker, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import httpUtils from '../../../../utils/request'
import moment from 'moment';

const { Text, Link } = Typography;

const BusySetting = props => {

    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    useEffect(() => {
        if (props.configList.length > 0) {
            let startIndex = props.configList.findIndex(config => config.key == 'busy.startTime')
            let endIndex = props.configList.findIndex(config => config.key == 'busy.endTime')
            setStartTime(startIndex > -1 && props.configList[startIndex])
            setEndTime(endIndex > -1 && props.configList[endIndex])
        }
    }, [props])

    const updateSetting = async () => {
        let data = {
            propertyList: [startTime, endTime]
        }
        props.updateConfig(data)
    }

    return (
        <div className={styles.baseView}>
            <div className={styles.left}>
            <Form
                layout="vertical"
                style={{width:300}}
            >
                <Form.Item
                    label={<Space>开业时间<Text type="warning">（小程序可以正常下单）</Text></Space>}
                >
                    <TimePicker 
                        value={moment(startTime.value || new Date(), 'h:mm:ss')} 
                        onChange={(moment, dataString) => {
                            setStartTime({
                                ...startTime, 
                                value: dataString
                            })
                        }} 
                    />
                </Form.Item>
                <Form.Item
                    label={<Space>打烊时间<Text type="warning">（小程序不再支持下单）</Text></Space>}
                >
                    <TimePicker 
                        value={moment(endTime.value || new Date(), 'h:mm:ss')} 
                        onChange={(moment, dataString) => {
                            setEndTime({
                                ...endTime, 
                                value: dataString
                            })
                        }} 
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" onClick={updateSetting}>更新营业设置</Button>
                </Form.Item>
            </Form>
            </div>
        </div>
    )
}

export default BusySetting