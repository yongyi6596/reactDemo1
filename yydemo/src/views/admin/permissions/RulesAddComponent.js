import React from 'react'
import { Form, Input, Button,  message } from 'antd';
import { post } from '../../../utils/request'

export default function RulesAddComponent() {
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 18,
        },
    };
    const onFinish = values => {
        console.log(values);
        post('/roles', values

        ).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
                message.success(res.meta.msg)
            } else {
                message.error(res.meta.msg)
            }
        })
    };
    return (
        <Form {...layout} name="nest-messages"
            onFinish={onFinish}
            preserve={false} >
            <Form.Item
                name={['roleName']}
                label="角色名称"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: '请输入角色名称',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={['roleDesc']}
                label="角色描述"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: '角色描述',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 18 }}>
                <Button type="primary" htmlType="submit">
                    提交
            </Button>
            </Form.Item>
        </Form>
    )
}
