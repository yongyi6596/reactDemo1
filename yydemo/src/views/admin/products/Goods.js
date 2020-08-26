import React, { Fragment, useEffect, useState } from 'react'
import {
  Breadcrumb, Card, Table, message, Tag, Button, Popconfirm, Modal, Input, Form
  , Cascader
} from 'antd'
import { get, del, post } from '../../../utils/request'
import {
  CloseSquareTwoTone, CheckSquareTwoTone, EditOutlined, DeleteOutlined
} from '@ant-design/icons'
function Goods() {
  const [form] = Form.useForm();
  // 控制添加分类对话框变量
  const [AddClassificationVisible, setAddClassificationVisible] = useState(false)
  // 存储商品分类数据
  const [GoodsList, setGoodsList] = useState([])
  //存储添加分类对话框中级联选择器父级分类数据
  const [ParentGoodsList, setParentGoodsList] = useState([])
  // 存储添加分类对话框中级联选择器的选择数据,在对话框关闭时,清空
  const [CascaderCatPidAndLevel, setCascaderCatPidAndLevel] = useState({})
  // 获取商品分类数据
  useEffect(() => {
    getGoodsList()
  }, [])
  // 获取商品分类数据
  function getGoodsList() {
    get('/categories').then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
      }
      setGoodsList(res.data)
    })
  }

  //添加分类对话框中获取父级分类
  function getParentGoodsList() {
    get('/categories', {
      type: 2
    }).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        console.log(res.data)
      }
      setParentGoodsList(res.data)
    })

  }
  // 表格title数据
  const columns = [

    {
      title: '分类名称',
      dataIndex: 'cat_name',
      key: 'cat_name',
      width: '23%'
    }, {
      title: '是否有效',
      dataIndex: 'cat_deleted',
      key: 'id',
      width: '23%',
      render: (record,) => {
        return record.cat_deleted ?
          <CloseSquareTwoTone twoToneColor="#eb2f96" />
          : <CheckSquareTwoTone twoToneColor="#52c41a" />

      }
    }, {
      title: '排序',
      dataIndex: 'cat_level',
      key: 'id',
      render: (record) => {
        if (record.cat_level == 0) { return <Tag color="blue">一级</Tag> } else if (
          record.cat_level == 1) { return <Tag color="green">二级</Tag> } else {
          return <Tag color="gold">三级</Tag>
        }
      }
    }, {
      title: '操作',
      key: 'id',
      render: (record) => {
        return (
          <Fragment>
            <Button type="primary"><EditOutlined />编辑</Button>
            <Popconfirm
              title="确定要删除该分类吗?"
              onConfirm={() => { del(`/categories/${record.cat_id}`).then(res => { console.log(res) }) }}

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

  //添加分类对话框关闭,发出网络请求添加分类
  const onFinish = values => {
    const obj1 = {
      cat_name: values.cat_name,
      cat_pid: CascaderCatPidAndLevel.cat_pid || 0,
      cat_level: CascaderCatPidAndLevel.cat_level + 1 || 0
    }
    post('/categories', { ...obj1 }).then(res => {
      if (res.meta.status !== 201) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        getGoodsList()
      }
    })
  };
  // 对 添加分类 对话框中 级联选择器value 进行处理
  function onChange(value, e) {
    const newE = e[1] || e[0]
    setCascaderCatPidAndLevel({
      cat_pid: newE.cat_id,
      cat_level: newE.cat_level
    })
  }
  return (
    <Fragment>
      <Card>
        {/* 面包屑导航区 */}
        <Breadcrumb style={{ margin: '-10px 0 10px 0' }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          <Breadcrumb.Item>角色列表</Breadcrumb.Item>
        </Breadcrumb>
        {/* 添加分类按钮 */}
        <Button type='primary'
          onClick={() => {
            setAddClassificationVisible(true)
            getParentGoodsList()
          }} >添加分类</Button>
        {/* 添加分类对话框 */}
        <Modal
          title="商品分类"
          visible={AddClassificationVisible}
          destroyOnClose
          afterClose={() => {
            setCascaderCatPidAndLevel('')
          }}
          onOk={() => {
            form.submit();
            setAddClassificationVisible(false)
          }}
          onCancel={() => { setAddClassificationVisible(false) }}
        >
          <Form
            labelCol={
              { span: 5 }
            }
            wrapperCol={
              { span: 16 }
            }
            preserve={false}
            name="basic"
            form={form}
            onFinish={onFinish}
            onFinishFailed={errorInfo => {
              console.log('Failed:', errorInfo)
            }}
          >
            <Form.Item
              label="分类名称"
              name="cat_name"
              rules={[
                {
                  required: true,
                  message: '请输入分类名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="父类名称"
              rules={[
                {
                  required: true,
                  message: '请输入分类名称',
                },
              ]}
            >
              <Cascader
                label="父类名称"
                fieldNames={{ label: 'cat_name', value: 'cat_name', }}
                changeOnSelect
                expandTrigger='hover'
                defaultValue={['请选择']}
                options={ParentGoodsList}
                onChange={onChange}
              />,
                        </Form.Item>

          </Form>
        </Modal>
        {/* 表格内容区域 */}
        <Table dataSource={GoodsList}
          style={{ marginTop: "15px" }}
          columns={columns}
          rowKey='cat_name' bordered
          expandable={{
            onExpandedRowsChange: (expandedRows) => {
              //通过exoandedRows的改变,改变RulesIndex,同时触发消除table展开空白行事件
            },
            indentSize: 35

          }} />


      </Card>
    </Fragment >
  )
}

export default Goods
