import React, { useEffect, useState } from 'react'
import { Form, Input, Button,  message } from 'antd';
import { put, get } from '../../../utils/request'

function RulesEditComponent(props) {
    const [RulesInfoById, setRulesInfoById] = useState([])
    useEffect(() => {
        get(`/roles/${props.id}`).then(res => {
            setRulesInfoById(res.data)
     
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
        put(`/roles/${props.id}`, {
            'roleName': values.roleName || RulesInfoById.roleName,
            'roleDesc': values.roleDesc || RulesInfoById.roleDesc
        }).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
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
                        message: '请输入角色名称',
                    },
                ]}
            >
                <Input placeholder={RulesInfoById.roleName}  />
            </Form.Item>
            <Form.Item
                name={['roleDesc']}
                label="角色描述"
                hasFeedback
                rules={[
                    {
                        
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

export default RulesEditComponent
