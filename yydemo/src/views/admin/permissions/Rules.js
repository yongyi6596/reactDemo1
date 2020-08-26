
import React, { Fragment, useEffect, useState } from 'react'
import {
  Breadcrumb, Card, Table, message, Tag, Button, Row, Col, Popconfirm, Popover, Modal
} from 'antd'
import { get, del, post } from '../../../utils/request'
import {
  CaretRightOutlined, CloseOutlined, EditOutlined,
  DeleteOutlined, ApartmentOutlined
} from '@ant-design/icons'
import RulesAddComponent from './RulesAddComponent'
import RulesEditComponent from './RulesEditComponent'
import RulesRightComponent from './RulesRightComponent'
export default function Rules() {
  const [RulesList, setRulesList] = useState([])
  const [RulesIndex, setRulesIndex] = useState(0)
  //添加角色对话框显示的变量
  const [RulesAdd, setRulesAdd] = useState(false)
  //编辑角色对话框显示变量
  const [RulesEdit, setRulesEdit] = useState(false)
  //需要编辑角色的ID
  const [RulesEditId, setRulesEditId] = useState(0)
  //显示分配权限树结构的对话框变量
  const [showSetRightDialog, setshowSetRightDialog] = useState(false)
  //选择好的全选权限和板悬权限key值
  const [TreeCheckKeys, setTreeCheckKeys] = useState('')
  // 分配权限ID
  const [RulesRightId, setRulesRightId] = useState(0)
  useEffect(() => {
    getRules()

  }, [])
  //  消除table展开行空白行
  useEffect(() => {
    var area = document.getElementsByClassName('ant-table-row-level-1');
    if (area.length != 0) {
      for (var i = 0; i < area.length; i++) {
        area[i].setAttribute('style', 'display:none');
      }
    }
  }, [RulesIndex])


  //   获取角色列表数据
  function getRules() {
    get(`roles`).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        setRulesList(res.data)

      }
    })
  }
  //删除指定权限
  function deleteRulesById(record, right) {
    del(`roles/${record.id}/rights/${right.id}`).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        getRules()
      }
    })
  }
  //根据ID删除角色
  function deleteRules(id) {
    console.log(id)
    del(`/roles/${id}`).then(res => {
      if (res.meta.status !== 200) {
        message.error(res.meta.msg)
      } else {
        message.success(res.meta.msg)
        getRules()
      }
    })
  }

  // 表格title
  const columns = [
    {
      title: '',
      key: 'roleName',
      width: '50px',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: '23%'
    }, {
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      width: '23%'
    }, {
      title: '操作',
      key: 'id',
      render: (text, record) => {
        return (
          <><Popover content={'编辑角色'}>
            <Button type="primary" size='small'
              onClick={() => {
                setRulesEdit(true)
                setRulesEditId(record.id)
              }}
              style={{ width: '100px', margin: '5px' }} ><EditOutlined />编辑角色
            </Button>
          </Popover>
            <Popover content={'分配权限'} >
              <Button type="ghost" size='small'
                onClick={() => {
                  setshowSetRightDialog(true)
                  setRulesRightId(record.id)
                }}
                style={{
                  width: '100px', margin: '5px',
                  backgroundColor: '#E7CD16', color: '#FFFFFF'
                }}><ApartmentOutlined />分配权限
              </Button>
            </Popover>
            <Popconfirm
              title="确定要删除该角色吗?"
              onConfirm={() => { deleteRules(record.id) }}
              onCancel={() => { message.info('取消删除') }}
              okText="删除"
              cancelText="取消"
            >
              <Popover content={'删除角色'}>
                <Button type="danger " size='small'
                  style={{ width: '100px', margin: '5px' }}><DeleteOutlined />删除角色
                </Button>
              </Popover>
            </Popconfirm>,

          </>
        )
      },
    }
  ];
  return (
    <Fragment>
      <Card>
        {/* 面包屑导航区 */}
        <Breadcrumb style={{ margin: '-10px 0 10px 0' }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          <Breadcrumb.Item>角色列表</Breadcrumb.Item>
        </Breadcrumb>
        <Button type="primary" size="large" onClick={() => { setRulesAdd(true) }}  >添加角色</Button>
        {/* 添加用户对话框 */}
        <Modal
          title="添加角色"
          destroyOnClose={true}
          visible={RulesAdd}
          onOk={() => {
            setRulesAdd(false)
            getRules()
          }}
          onCancel={() => { setRulesAdd(false) }}
        >
          <RulesAddComponent />
        </Modal>
        {/* 编辑角色对话框 */}
        <Modal
          title="编辑角色"
          destroyOnClose={true}
          visible={RulesEdit}
          onOk={() => {
            setRulesEdit(false)
            getRules()
          }}
          onCancel={() => {
            setRulesEdit(false)

          }}
        >
          <RulesEditComponent id={RulesEditId} />
        </Modal>
        {/* 编辑角色对话框 */}
        <Modal
          title="分配权限"
          destroyOnClose={true}
          visible={showSetRightDialog}
          onOk={() => {

            post(`roles/${RulesRightId}/rights`, { 'rids': TreeCheckKeys.join(',') }).then(res => {
              if (res.meta.status !== 200) {
                message.error(res.meta.msg)
              } else {
                message.success(res.meta.msg)
                getRules()
              }

            })
            setshowSetRightDialog(false)
          }}
          onCancel={() => {
            setshowSetRightDialog(false)
          }}
        >
          <RulesRightComponent id={RulesRightId} Fn={setTreeCheckKeys} />
        </Modal>

        {/* 表格内容区域 */}
        <Table
          style={{ marginTop: '10px' }}
          columns={columns}
          expandable={{
            onExpandedRowsChange: (expandedRows) => {
              //通过exoandedRows的改变,改变RulesIndex,同时触发消除table展开空白行事件
              setRulesIndex(expandedRows)
            },
            expandedRowRender: (record) => {
              return (
                <>
                  {/* 循环遍历展开栏 */}
                  {record.children.map((item => {
                    return (
                      <Row key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          borderBottom: '1px solid #f5f5f5'
                        }}  >
                        <Col span={6} key={item.id}>
                          <Tag key={item.id}
                            color="blue"
                            style={{ margin: '10px 0  ' }}> {item.authName}</Tag>
                          <CaretRightOutlined />
                        </Col>
                        <Col span={18}  >  {item.children.map((item1, index1) => {
                          return (
                            <Row key={item1.id}
                              style={{
                                borderBottom: '1px solid #f5f5f5', display: 'flex',
                                alignItems: 'center',
                              }}>
                              <Col span={6} key={item1.id}>
                                <Tag key={item1.id}
                                  color="green"
                                  style={{ margin: '10px 0  ' }}> {item1.authName}</Tag>
                                <CaretRightOutlined />
                              </Col>
                              <Col span={18} >
                                {item1.children.map((item2) => {
                                  return (
                                    <Popconfirm title="确定删除吗?"
                                      key={item2.id}
                                      onConfirm={deleteRulesById.bind(this, record, item2)}
                                      onCancel={() => { message.config('取消删除') }}
                                      okText="删除"
                                      cancelText="取消">
                                      <Tag key={item2.id}
                                        color="gold"
                                        style={{ margin: '10px 10px ' }}
                                      >{item2.authName}<CloseOutlined style={{ marginLeft: '5px' }} />
                                      </Tag>
                                    </Popconfirm>
                                  )
                                })}
                              </Col>

                            </Row>
                          )
                        })}
                        </Col>
                      </Row>
                    )
                  }))}
                </>
              )
            }
          }}
          dataSource={RulesList}
          rowKey={(record) => { return record.id }}
          bordered />
      </Card>
    </Fragment>
  )
}
