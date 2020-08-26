import React, { Fragment, useEffect, useState, useLayoutEffect } from 'react'
import {
    Breadcrumb, Card, Input, Table, Switch, message, Tag, Button, Popconfirm
} from 'antd'
import {withRouter} from 'react-router-dom' 
import {
    CloseSquareTwoTone, CheckSquareTwoTone, EditOutlined, DeleteOutlined
} from '@ant-design/icons'
import { get, del } from '../../../utils/request'
const { Search } = Input;
 function Categories(props) {
    // 商品列表数据
    const [goodsList, setgoodsList] = useState([])
  
    useEffect(() => {
        getgoodList()
    }, [])
    // 获取商品列表数据
    function getgoodList() {
        get('/goods', {
            query: '',
            pagenum: 1,
            pagesize: 10
        }).then(res => {
            console.log(res.data.goods)
            res.data.goods.map((item) => {
                return item.key = item.add_time
            })
            console.log(res.data.goods)

            setgoodsList(res.data.goods)
        })
    }
    const columns = [
        {
            title: '',
            key: 'goods_id',
            width: '50px',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '商品名称',
            dataIndex: 'goods_name',
            key: 'goods_name',
            width: '450px'
        }, {
            title: '商品价格(元)',
            dataIndex: 'goods_price',
            key: 'goods_price',
            width: '120px'
        }, {
            title: '商品重量',
            dataIndex: 'goods_weight',
            key: 'goods_weight',
            width: '90px'
        },
        {
            title: '创建时间',
            width: '90px',
            key: 'add_time',
            dataIndex: 'add_time',

        }, {
            title: '操作',
            key: 'goods_id',
            render: (record) => {
                return (
                    <Fragment>
                        <Button type="primary" ><EditOutlined />编辑</Button>
                        <Popconfirm
                            title="确定要永久删除该商品吗?"
                            onConfirm={() => {
                                console.log(record)
                                del(`/goods/${record.goods_id}`).then(res => {
                                    if (res.meta.status !== 200) {
                                        message.error(res.meta.msg)
                                    } else {
                                        message.success(res.meta.msg)
                                        getgoodList()
                                    }
                                })
                            }}

                            okText="删除"
                            cancelText="取消"
                        >
                            <Button type='danger'

                                style={{ marginLeft: '10px' }} >
                                <DeleteOutlined />删除</Button>
                        </Popconfirm>,
                    </Fragment>
                )
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
                <Search
                    placeholder="请输入搜索内容"
                    allowClear={true}
                    // onSearch={value =>
                    //     setqueryInfo({
                    //         query: value,
                    //         pagenum: 1,
                    //         pagesize: 10
                    //     })
                    // }
                    style={{ width: 350 }}
                />
                {/* 添加用户按钮 */}
                <Button type='primary' onClick={()=>{props.history.push('/admin/goods/goodsadd')}} size='middle'
                    style={{ marginLeft: '20px' }}>添加商品</Button>
                {/* 表格内容区域 */}

                <Table
                    style={{ marginTop: '10px' }}
                    columns={columns}
                    dataSource={goodsList}
                    rowKey='id'
                    bordered />
            </Card>
        </Fragment>
    )
}
export default withRouter (Categories) 