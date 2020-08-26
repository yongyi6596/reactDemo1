import React, { Fragment, useEffect, useState } from 'react'
import {
    Breadcrumb, Card, Input, Table, Switch, message,
    Button, Popover,  Modal, Popconfirm
} from 'antd'
import { EditOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons'
import { get, put, del } from '../../../utils/request'
import Useradd from './Useradd'
import UserEdit from './UserEdit'
import UserFP from './UserFP'
const { Search } = Input;
export default function User() {
    const [userlist, setuserlist] = useState([])
    const [queryInfo, setqueryInfo] = useState({
        query: '',
        pagenum: 1,
        pagesize: 10
    })
    // 添加用户对话框
    const [visible, setvisible] = useState(false)
    //编辑用户对话框
    const [useredit, setuseredit] = useState(false)
    // 需要编辑用户的id
    const [usereditid, setusereditid] = useState(0)
    //分配角色对话框
    const [userFP, setuserFP] = useState(false)
    const [userFpId, setuserFpId] = useState(0)
    const [UserFpInfo, setUserFpInfo] = useState([])
    //进去页面获取所有用户的信息
    useEffect(() => {
        getqueryInfo()
    }, [])
   
    //获取所有用户的信息
    function getqueryInfo() {
        get('/users', queryInfo).then(res => {
            setuserlist(res.data.users)
        })
    }
    //切换用户状态
    function onChange(record, checked, e) {
        put(`/users/${record.id}/state/${checked}`).then(value => {
            if (value.meta.status === 200) {
                message.success('设置状态成功')
            } else {
                message.error('设置状态失败')
            }
        })
    }
    //通过id值删除相应的用户
    function removeUser(id) {
        del(`/users/${id}`).then(res => {
            if (res.meta.status !== 200) {
                return message.error(res.meta.msg)
            } else {
                message.success(res.meta.msg)
                getqueryInfo()
            }
        })
    }
    //表格title
    const columns = [
        {
            title: '',
            key: '',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '角色',
            dataIndex: 'role_name',
            key: 'id',
        }, {
            title: '姓名',
            dataIndex: 'username',
            key: 'id',
        }, {
            title: '电话',
            dataIndex: 'mobile',
            key: 'id',
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'id',
        },
        {
            title: '状态',
            dataIndex: 'mg_state',
            key: 'mg_state',
            render: (text, record, index) => {
                return (<Switch defaultChecked={record.mg_state ===1 ? true : false}
                    onChange={onChange.bind(this, record)} />)
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (
                    <><Popover content={'编辑角色'}>
                        <Button type="primary" size='small'
                            onClick={() => {
                                setuseredit(true)
                                setusereditid(record.id)
                            }}
                            style={{ width: '50px', margin: '5px' }} ><EditOutlined />
                        </Button>
                    </Popover>
                        <Popover content={'分配角色'} >
                            <Button type="ghost" size='small'
                                onClick={() => {
                                    setuserFP(true)
                                    setuserFpId(record.id)
                                }}
                                style={{
                                    width: '50px', margin: '5px',
                                    backgroundColor: '#E7CD16', color: '#FFFFFF'
                                }}><ApartmentOutlined />
                            </Button>
                        </Popover>
                        <Popconfirm
                            title="确定要删除该用户吗?"
                            onConfirm={() => { removeUser(record.id) }}
                            onCancel={() => message.error('取消删除')}
                            okText="删除"
                            cancelText="取消"
                        >
                            <Popover content={'删除角色'}>
                                <Button type="danger " size='small'

                                    style={{ width: '50px', margin: '5px' }}><DeleteOutlined />
                                </Button>
                            </Popover>
                        </Popconfirm>,

                    </>
                )
            },
        },
    ];

    return (
        <Fragment>
            <Card>
                {/* 面包屑导航区 */}
                <Breadcrumb style={{ margin: '-10px 0 10px 0' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                    <Breadcrumb.Item>用户列表</Breadcrumb.Item>
                </Breadcrumb>
                {/* 用户搜索区 */}

                <Search
                    placeholder="请输入搜索内容"
                    allowClear={true}
                    onSearch={value =>
                        setqueryInfo({
                            query: value,
                            pagenum: 1,
                            pagesize: 10
                        })
                    }
                    style={{ width: 350 }}
                />
                {/* 添加用户按钮 */}
                <Button type='primary' onClick={() => { setvisible(true) }} size='middle'
                    style={{ marginLeft: '20px' }}>添加角色</Button>
                {/* 添加用户对话框 */}
                <Modal
                    title="添加用户"
                    destroyOnClose={true}
                    visible={visible}
                    onOk={() => {
                        setvisible(false)
                    }}
                    onCancel={() => { setvisible(false) }}
                >
                    <Useradd />
                </Modal>
                {/* 修改用户对话框 */}
                <Modal
                    title="修改用户"
                    destroyOnClose={true}
                    visible={useredit}
                    onOk={() => {
                        setuseredit(false)
                        getqueryInfo()
                    }}
                    onCancel={() => { setuseredit(false) }}
                >

                    <UserEdit id={usereditid} />
                </Modal>
                {/* 分配用户权限对话框 */}
                <Modal
                    title="分配角色"
                    destroyOnClose={true}
                    visible={userFP}
                    onOk={() => {
                        setuserFP(false)
                        console.log(UserFpInfo)
                        put(`users/${UserFpInfo[0]}/role`, { 'rid': UserFpInfo[1] }).then(res => {
                            console.log(res)
                            if (res.meta.status !== 200) {
                                message.error(res.meta.msg)
                            } else {
                                message.success(res.meta.msg)
                                getqueryInfo()

                            }
                        })
                    }}
                    onCancel={() => { setuserFP(false) }}
                >
                    <UserFP id={userFpId} Fn={setUserFpInfo} />
                </Modal>
                {/* 表格内容区域渲染所有的用户内容 */}
                <Table
                    style={{ marginTop: '10px' }}
                    columns={columns}

                    dataSource={userlist}
                    rowKey='id'
                    bordered />
                {/* 分页区域 */}


            </Card>
        </Fragment>
    )
}
