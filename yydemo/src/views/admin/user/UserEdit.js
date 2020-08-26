import React, { useEffect, useState } from 'react'
import { Form, Input, Button, message } from 'antd';
import { put, get } from '../../../utils/request'
export default function UserEdit(props) {
    const [usereditid, setusereditid] = useState({})

    useEffect(() => {
        get(`/users/${props.id}`).then(res => {
            setusereditid(res.data)
        })
    }, [])
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 18,
        },
    };
    const onFinish = values => {
        put(`/users/${props.id}`, {
            'email': values.email || usereditid.email,
            'mobile': values.mobile || usereditid.mobile
        }).then(res => {
            console.log(res)
           if(res.meta.status===200){
               message.success(res.meta.msg)
           }else{
                  message.error(res.meta.msg)
           }
        })
    };
    return (
        <Form {...layout} name="nest-messages"
            onFinish={onFinish}

            preserve={false} >
            <Form.Item
                name={['username']}
                label="用户名"
                hasFeedback
                rules={[
                    {
                        pattern: /^.{1,18}$/,
                        message: '请输入正确的用户名',
                    },
                ]}
            >

                <Input placeholder={usereditid.username} disabled />
            </Form.Item>
            <Form.Item
                name={['email']}
                label="Email"
                hasFeedback
                rules={[
                    {

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
                initialValue={usereditid.mobile}
                rules={[{

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
