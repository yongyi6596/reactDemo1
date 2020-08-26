import React from 'react'
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import { post } from '../utils/request'
import { setToken } from '../utils/auth'

function Login(props) {
    console.log(props)
    const onFinish = values => {
        post('/login', {
            username: values.username,
            password: values.password
        }).then(ret => {
            console.log(ret)
            if (ret.meta.status === 200) {
                setToken(ret.data.token)
                message.success('成功登陆')
                props.history.push('/admin')
            } else if (ret.meta.status !== 200) {
                message.error('账户密码错误')
            }
        })
        console.log('Received values of form: ', values);
    };
    return (
        <Card className='login-card' title='YY-Shop'>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入账户!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        忘记密码
          </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
          </Button>
          Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default Login
