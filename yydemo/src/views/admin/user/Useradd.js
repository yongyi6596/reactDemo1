import React from 'react'
import { Form, Input, Button, Select, message } from 'antd';
import { post } from '../../../utils/request'

export default function Useradd() {
    const { Option } = Select;
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 18,
        },
    };
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not validate email!',
            number: '${label} is not a validate number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const onFinish = values => {
        console.log(values);
        post('/users', values

        ).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
                message.success('成功添加')
            } else {
                message.error(res.meta.msg)
            }
        })
    };
    return (
        <Form {...layout} name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            preserve={false} >
            <Form.Item
                name={['username']}
                label="用户名"
                hasFeedback
                rules={[
                    {
                        required: true,
                        pattern: /^.{1,18}$/,
                        message: '请输入正确的用户名',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: '请输入满足要求的密码',
                        min: 8,
                        max: 16
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name={['email']}
                label="Email"
                hasFeedback
                rules={[
                    {
                        required: true,
                        type: 'email',
                        pattern: /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/,
                        message: '请输入正确的邮箱',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name={['mobile']}
                label="手机号"
                hasFeedback
                rules={[{
                    required: true,
                    message: '请输入11位手机号',
                    max: 11,
                    min: 11
                },
                ]} >
                <Input style={{ width: '100%', }} />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 18 }}>
                <Button type="primary" htmlType="submit">
                    提交
        </Button>
            </Form.Item>
        </Form>
    )
}
