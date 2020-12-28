import React, {useState, useEffect} from 'react'
import styles from './style.less'
import { Form, Input, Button, Upload, Typography, Space, InputNumber, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import httpUtils from '../../../../utils/request'

const { Text, Link } = Typography;

const OrderSetting = props => {

    const [cancelTime, setCancelTime] = useState({})
    const [farmFeePercent, setFarmFeePercent] = useState({})
    const [expressAmount, setExpressAmount] = useState({})
    useEffect(() => {
        if (props.configList.length > 0) {
            let cancelTimeIndex = props.configList.findIndex(config => config.key == 'order.cancelTime')
            let farmFeePercentIndex = props.configList.findIndex(config => config.key == 'order.farm.fee.percent')
            let expressAmountIndex = props.configList.findIndex(config => config.key == 'order.express.amount')
            setCancelTime(cancelTimeIndex > -1 && props.configList[cancelTimeIndex])
            setFarmFeePercent(farmFeePercentIndex > -1 && props.configList[farmFeePercentIndex])
            setExpressAmount(expressAmountIndex > -1 && props.configList[expressAmountIndex])
        }
    }, [props])

    const updateSetting = async () => {
        let data = {
            propertyList: [cancelTime, farmFeePercent, expressAmount]
        }
        props.updateConfig(data)
    }

    return (
        <div className={styles.baseView}>
            <div className={styles.left}>
            <Form
                layout="vertical"
                style={{width:350}}
            >
                <Form.Item
                    label={<Space>订单取消时间<Text type="warning">（该时间内未付款，自动取消订单）</Text></Space>}
                >
                    <InputNumber
                        value={cancelTime.value}
                        onChange={e => {
                            setCancelTime({
                                ...cancelTime,
                                value: e
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="农户分账比例"
                >
                    <InputNumber
                        value={farmFeePercent.value}
                        onChange={e => {
                            setFarmFeePercent({
                                ...farmFeePercent,
                                value: e
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="运费比例"
                >
                    <InputNumber
                        value={expressAmount.value}
                        onChange={e => {
                            setExpressAmount({
                                ...expressAmount,
                                value: e
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" onClick={updateSetting}>更新订单设置</Button>
                </Form.Item>
            </Form>
            </div>
        </div>
    )
}

export default OrderSetting