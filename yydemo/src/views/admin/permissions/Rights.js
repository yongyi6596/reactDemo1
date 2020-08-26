
import React, { Fragment, useEffect, useState } from 'react'
import {
    Breadcrumb, Card, Input, Table, Switch, message, Tag
} from 'antd'
import { get } from '../../../utils/request'
export default function Rights() {
    const [permissionsList, setpermissionsList] = useState([])
    useEffect(() => {
        getpermissions()
    }, [])
    function getpermissions() {
        get(`/rights/list`).then(res => {
            if (res.meta.status !== 200) {
                message.error(res.meta.msg)
            } else {
                setpermissionsList(res.data)
                message.success(res.meta.msg)
            }
        })
    }
    // 表格title
    const columns = [
        {
            title: '',
            key: 'id',
            width: '50px',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '权限名称',
            dataIndex: 'authName',
            key: 'authName',
        }, {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        }, {
            title: '权限等级',
            dataIndex: 'level',
            key: 'id',
            render: (text, record, index) => {
                if (text == 0) {
                    return (<Tag color="blue">一级</Tag>)
                } else if (text == 1) {
                    return (<Tag color="green">二级</Tag>)
                } else if (text == 2) {
                    return (<Tag color="gold">三级</Tag>)
                }
            }
        }
    ];
    return (
        <Fragment>
            <Card>
                {/* 面包屑导航区 */}
                <Breadcrumb style={{ margin: '-10px 0 10px 0' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>权限管理</Breadcrumb.Item>
                    <Breadcrumb.Item>权限列表</Breadcrumb.Item>
                </Breadcrumb>
                {/* 表格内容区域 */}

                <Table
                    style={{ marginTop: '10px' }}
                    columns={columns}
                    dataSource={permissionsList}
                    rowKey='id'
                    bordered />
            </Card>
        </Fragment>
    )
}
