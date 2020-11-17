import React, { useState, useEffect, useCallback } from 'react'
import { useHistory, Link } from "react-router-dom";
import { Tabs, Form, Input, Row, Col, Button, Checkbox, Alert, message } from 'antd';
import { LockTwoTone, MailTwoTone, MobileTwoTone, UserOutlined, AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import styles from './style.less'
import httpUtils from '../../../utils/request'
import localStorage from '../../../utils/localStorage'

const { TabPane } = Tabs;


const formRules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
    mobile: [
        {
          required: true,
          message: '请输入手机号码',
        },
        {
          pattern: /^1\d{10}$/,
          message: '手机号码格式有误',
        }
    ],
    captcha: [{ required: true, message: '请输入验证码' }]
}

const Login = () => {

    let history = useHistory();
    const [timing, setTiming] = useState(false)
    const [loginInfo, setLoginType] = useState({status: '', loginType: 'account'})
    const [tabKey, setTabKey] = useState('account')
    const [autoLogin, setAutoLogin] = useState(true);
    const [count, setCount] = useState(120)
    const [loginLoading, setLoginloading] = useState(false)
    const [loginErrMsg, setLoginErrMsg] = useState("")

    const [form] = Form.useForm();

    const getCaptcha = useCallback(async () => {
        form.validateFields(['mobile'])
            .then(({ mobile }) => {
                message.success(mobile + ' 获取验证码成功！验证码为：1234');
                setTiming(true)
            })
            .catch(err => {
                console.log(err)
            })
    })
    useEffect(() => {
        let interval = 0;
        if (timing) {
            interval = setInterval(() => {
                setCount(preCount => {
                    if (preCount <= 1) {
                        setTiming(false)
                        clearInterval(interval)
                        return 120
                    }

                    return preCount - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timing])

    const onFinish = async values => {

        localStorage.setItem(localStorage.keyMap.ACCESS_TOKEN, "111111111")
        history.push('/home')
    };

    return (
        <div className={styles.main}>
            <div className={styles.login}>
                <Form form={form} onFinish={onFinish}>
                    {
                        loginInfo.loginType == 'mobile' && loginInfo.status == 'error' && (
                            <Alert
                                style={{
                                    marginBottom: 24,
                                }}
                                message={loginErrMsg}
                                type="error"
                                showIcon
                            />
                        )
                    }
                    <Form.Item name="mobile" rules={formRules.mobile}>
                        <Input size="large" prefix={<MobileTwoTone className={styles.prefixIcon} />} placeholder="请输入手机号码" />
                    </Form.Item>
                    <Form.Item name="password" rules={formRules.password}>
                        <Input size="large" prefix={<LockTwoTone className={styles.prefixIcon} />} type='password' placeholder="请输入密码" />
                    </Form.Item>
                    <Row gutter={8}>
                        <Col span={16}>
                        <Form.Item name="captcha" rules={formRules.captcha}>
                            <Input size="large" prefix={<MailTwoTone className={styles.prefixIcon} />} placeholder="请输入验证码" />
                        </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Button
                                disabled={timing}
                                className={styles.getCaptcha}
                                size="large"
                                onClick={() => getCaptcha()}
                            >
                                { timing ? `${count}秒` : '获取验证码'}
                            </Button>
                        </Col>
                    </Row>
                    <Button size="large" loading={loginLoading} className={styles.submit} type="primary" htmlType="submit">登录</Button>
                </Form>
            </div>
        </div>
    )
}

export default Login