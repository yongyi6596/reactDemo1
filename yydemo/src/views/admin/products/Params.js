import React, { Fragment, useEffect, useState } from 'react'
import {
  Breadcrumb, Card, Table, Tabs, message, Tag, Button, Modal, Input, Form
  , Cascader, Alert, Popconfirm
} from 'antd'
import {
  PlusOutlined, CheckSquareTwoTone, EditOutlined, DeleteOutlined
} from '@ant-design/icons'
import { get, del, post, put } from '../../../utils/request'



const { TabPane } = Tabs;

export default function Params() {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [inputVisible, setinputVisible] = useState(false)

  const [inputValue, setinputValue] = useState('')

  const [EditId, setEditId] = useState(0)
  // 存储商品分类数据
  const [ParamsList, setParamsList] = useState([])
  // 存储级联选择器选择的id
  const [CascaderCat_id, setCascaderCat_id] = useState(0)
  //存储分类参数数据
  //  静态数据
  const [StaticParamesData, setStaticParamesData] = useState([])
  // 动态数据
  const [DynamicParamesData, setDynamicParamesData] = useState([])
  //编辑参数是依据ID和key查询单个参数
  const [PramesByIdKey, setPramesByIdKey] = useState({})
  const [DynamicParamesVisible, setDynamicParamesVisible] = useState(false)
  const [DynamicParamesVisible2, setDynamicParamesVisible2] = useState(false)

  // 决定展示的添加参数对话框是动态还是静态的变量,由添加属性按钮触发
  const [DynamicAndStatic, setDynamicAndStatic] = useState('')
  //tabs栏禁用与启用的变量
  const [DisabledFlag, setDisabledFlag] = useState(true)
  // 获取商品分类数据
  useEffect(() => {
    getParamsList()
  }, [])
  // 获取商品分类数据
  function getParamsList() {
    get('/categories').then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        setParamsList(res.data)
      }

    })
  }
  //   级联选择器选择后的函数
  function onChange(value, e) {
    if (e.length > 1) {
      setDisabledFlag(false)
      //将级联选择器选择的ID存储起来
      setCascaderCat_id(e[2].cat_id)
      getParamesDataByKey('many')
    } else {
      setDisabledFlag(true)
    }

  }
  // 根据key值获取动态参数或是静态属性
  function getParamesDataByKey(key) {
    get(`categories/${CascaderCat_id}/attributes`, { 'sel': key }).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        if (key == 'only') {

          // res.data.map((item) => {
          //   return (
          //     item.inputVisible = false,
          //     item.inputValue = ''
          //   )
          // })
          setStaticParamesData(res.data)
        } else {
          // res.data.map((item) => {
          //   return (
          //     item.inputVisible = false,
          //     item.inputValue = ''
          //   )
          // })
          console.log(res.data)

          setDynamicParamesData(res.data)
        }
      }
    })
  }
  //根据id和key查询参数
  function getParamesDataByIdKey(id, key) {
    get(`categories/${CascaderCat_id}/attributes/${id}`, { 'sel': DynamicAndStatic }).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        setPramesByIdKey(res.data)
      }
    })
  }
  //删除动态参数
  function deleteParames(record) {
    console.log(record)
    del(`/categories/${(record.cat_id)}/attributes/${(record.attr_id)} `)
      .then(res => {
        if (res.meta.status !== 200) {
          message.error(res.meta.msg)
        } else {
          getParamesDataByKey(record.attr_sel)
        }


      })

  }
  // tabs栏切换回调事件
  function callback(key) {
    getParamesDataByKey(key)
  }
  //添加动态参数或者静态属性对话框关闭时向服务器发出请求
  function DynamicParamesFinish(e) {
    post(`categories/${CascaderCat_id}/attributes`, {
      attr_name: e.attr_name,
      attr_sel: DynamicAndStatic,
    }).then(res => {
      if (res.meta.status !== 201) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        getParamesDataByKey(DynamicAndStatic)

      }
    })
  }
  //修改参数信息
  function editParamesFinish(e) {
    put(`categories/${CascaderCat_id}/attributes/${EditId}`, {
      attr_name: e.attr_name || PramesByIdKey.attr_name,
      attr_sel: PramesByIdKey.attr_sel,
      attr_vals: PramesByIdKey.attr_vals
    }
    ).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        getParamesDataByKey(DynamicAndStatic)
      }
    })
  }
  // 可编辑tag
  function handleInputChange(e) {
    setinputValue(e.target.value)
  };
  function handleInputConfirm(record) {
    const recordAttr_vals = (record.attr_vals).split(',')
    setinputVisible(false)

    put(`categories/${record.cat_id}/attributes/${record.attr_id}`, {
      attr_name: record.attr_name,
      attr_sel: record.attr_sel,
      attr_vals: `${record.attr_vals},${inputValue}`
    }).then(res => {
      console.log(res)
      getParamesDataByKey(record.attr_sel)
      setinputValue('')
    }
    )

  };
  //可编辑TAG结束
  // 删除选择的tag
  function log(record, index) {
    console.log(index, record)
    const arr = record.attr_vals.split(',')

    arr.splice(index, 1)
    console.log(arr)
    console.log((arr.join(',')))

    put(`categories/${record.cat_id}/attributes/${record.attr_id}`, {
      attr_name: record.attr_name,
      attr_sel: record.attr_sel,
      attr_vals: arr.join(',')

    }
    ).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        getParamesDataByKey(record.attr_sel)
      }
    })
  }
  return (
    <Fragment>
      <Card>
        {/* 面包屑导航区 */}
        <Breadcrumb style={{ margin: '-10px 0 10px 0' }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>分类参数</Breadcrumb.Item>
        </Breadcrumb>
        {/* 警告文字区 */}
        <Alert message="注意:只允许为第三级分类设置相关参数!"
          type="warning" showIcon closable />
        {/* 级联选择器区域 */}
                选择商品分类:   <Cascader
          style={{ marginTop: '15px', width: '250px' }}
          fieldNames={{ label: 'cat_name', value: 'cat_name', }}
          expandTrigger='hover'
          options={ParamsList}
          onChange={onChange}
          placeholder="请选择" />
        {/* tabs栏 */}
        <Tabs defaultActiveKey="many" onChange={callback}  >
          {/* 动态参数管理区 */}
          <TabPane tab="动态参数" key="many" disabled={DisabledFlag}  >
            {/* 添加动态参数按钮 */}
            <Button type='primary'
              disabled={DisabledFlag}
              onClick={() => {
                setDynamicParamesVisible(true)
                setDynamicAndStatic('many')
              }}
              style={{ margin: '5px 0' }}
            >添加动态参数</Button>

            {/* 动态属性表格 */}
            <Table dataSource={DynamicParamesData}
              expandable={{
                expandedRowRender: (record) => {
                  record.inputVisible = inputVisible

                  return (<Fragment>
                    {(record.attr_vals).split(',').map((item, index) => {
                      return <Tag closable onClose={log.bind(this, record, index)} key={item} >{item}</Tag>
                    })}
                    {record.inputVisible && (
                      <Input
                        type="text"
                        size="small"
                        className="tag-input"
                        value={inputValue}
                        onChange={

                          handleInputChange
                        }
                        onBlur={handleInputConfirm.bind(this, record)}
                        onPressEnter={handleInputConfirm.bind(this, record)}
                      />
                    )}
                    {!record.inputVisible && (
                      <Tag className="site-tag-plus" onClick={() => {
                        console.log(record)
                        setinputVisible(true)

                      }}>
                        <PlusOutlined /> New Tag
                      </Tag>
                    )}
                  </Fragment>)
                }
              }}
              columns={[
                {
                  title: '参数名称',
                  dataIndex: 'attr_name',
                  key: 'attr_id',
                }, {
                  title: '操作',
                  key: 'attr_id',
                  render: (record) => {
                    return (
                      <Fragment>
                        <Button type='primary' onClick={() => {
                          setDynamicParamesVisible2(true)
                          getParamesDataByIdKey(record.attr_id)
                          setDynamicAndStatic('many')
                          setEditId(record.attr_id)
                        }} >编辑</Button>
                        <Popconfirm
                          title="Are you sure delete this task?"
                          onConfirm={() => { deleteParames(record) }}
                          onCancel={() => { message.info('取消删除') }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type='default' >删除</Button>
                        </Popconfirm>,
                      </Fragment>

                    )
                  }
                }
              ]}
              bordered
              rowKey='attr_id' />
          </TabPane>
          {/* 静态属性管理区 */}
          <TabPane tab="静态属性" key="only" disabled={DisabledFlag} >
            {/* 添加静态按钮 */}
            <Button type='primary'
              disabled={DisabledFlag}
              onClick={() => {
                setDynamicAndStatic('only')
                setDynamicParamesVisible(true)
              }} style={{ marginTop: '5px 0' }}  >添加静态属性</Button>
            {/* 静态属性表格 */}
            <Table dataSource={StaticParamesData}
              bordered
              rowKey='attr_id'
              expandable={{
                expandedRowRender: (record) => {
                  record.inputVisible = inputVisible

                  return (<Fragment>
                    {(record.attr_vals).split(',').map((item, index) => {
                      return <Tag closable onClose={log.bind(this, record, index)} key={item} >{item}</Tag>
                    })}
                    {record.inputVisible && (
                      <Input
                        type="text"
                        size="small"
                        className="tag-input"
                        value={inputValue}
                        onChange={

                          handleInputChange
                        }
                        onBlur={handleInputConfirm.bind(this, record)}
                        onPressEnter={handleInputConfirm.bind(this, record)}
                      />
                    )}
                    {!record.inputVisible && (
                      <Tag className="site-tag-plus" onClick={() => {
                        console.log(record)
                        setinputVisible(true)

                      }}>
                        <PlusOutlined /> New Tag
                      </Tag>
                    )}
                  </Fragment>)
                }
              }}
              columns={[
                {
                  title: '#',
                  width: '50px',
                  key: 'attr_id',
                  render: (text, record, index) => {
                    return (index + 1)
                  }
                },

                {
                  title: '参数名称',
                  dataIndex: 'attr_name',
                  key: 'attr_id',
                },
                 {
                  title: '操作',
                  key: 'attr_id',
                  render: (record) => {
                    return (
                      <Fragment>
                        <Button type='primary' onClick={() => {
                          setDynamicParamesVisible2(true)
                          getParamesDataByIdKey((record.attr_id))
                          setDynamicAndStatic('only')
                          setEditId((record.attr_id))

                        }} >编辑</Button>
                        <Popconfirm
                          title="Are you sure delete this task?"
                          onConfirm={() => { deleteParames(record) }}
                          onCancel={() => { message.info('取消删除') }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type='default' >删除</Button>
                        </Popconfirm>,

                      </Fragment>

                    )
                  }
                }

              ]} />
          </TabPane>
        </Tabs>
        {/* 添加动态参数/静态属性对话框 */}
        <Modal
          title={DynamicAndStatic == 'many' ? "动态参数1" : "静态属性1"}
          form={form2}
          visible={DynamicParamesVisible}
          destroyOnClose
          // afterClose={() => {
          //     setCascaderCatPidAndLevel('')
          // }}
          onOk={() => {
            form2.submit();
            setDynamicParamesVisible(false)
          }}
          onCancel={() => { setDynamicParamesVisible(false) }}
        >
          <Form
            labelCol={
              { span: 5 }
            }
            wrapperCol={
              { span: 16 }
            }
            preserve={false}
            name="参数名称"
            form={form2}

            onFinish={DynamicParamesFinish}
            onFinishFailed={errorInfo => {
              console.log('Failed:', errorInfo)
            }}
          >
            <Form.Item
              label="参数名称"
              name="attr_name"
              rules={[
                {
                  required: true,
                  message: '请输入参数名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        {/* 参数编辑对话框 */}
        <Modal
          title={DynamicAndStatic == 'many' ? "动态参数" : "静态属性"}
          form={form}
          visible={DynamicParamesVisible2}
          destroyOnClose

          onOk={() => {
            form.submit();
            setDynamicParamesVisible2(false)
          }}
          onCancel={() => { setDynamicParamesVisible2(false) }}
        >
          <Form
            labelCol={
              { span: 5 }
            }
            wrapperCol={
              { span: 16 }
            }

            preserve={false}
            name="修改参数名称"
            form={form}
            onFinish={editParamesFinish}
            onFinishFailed={errorInfo => {
              console.log('Failed:', errorInfo)
            }}
          >
            <Form.Item
              label="参数名称"
              name="attr_name"
              rules={[
                {

                  message: '请输入参数名称',
                },
              ]}
            >
              <Input placeholder={PramesByIdKey.attr_name} />
            </Form.Item>
          </Form>
        </Modal>

      </Card>
    </Fragment >
  )
}
