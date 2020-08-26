import React, { useEffect, useState } from 'react'
import { Layout, Menu,  Dropdown, message } from 'antd';
import {
  DownOutlined, TableOutlined, ShoppingCartOutlined,
  ShoppingOutlined, LockOutlined, UserOutlined,
} from '@ant-design/icons';
import './index.css'
import { withRouter } from 'react-router-dom'
import { removeToken } from '../../utils/auth'
import { get } from '../../utils/request'
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
function Index(props) {
  // 左侧菜单栏
  const [menulist, setstate] = useState([])
  // 左侧菜单栏图标
  const [menuicon] = useState(
    {
      125: <UserOutlined />,
      103: <LockOutlined />,
      101: <ShoppingOutlined />,
      102: <ShoppingCartOutlined />,
      145: <TableOutlined />,
    }
  )
  useEffect(() => {
    get('/menus').then(res => {
      setstate(res.data)
    })

  }, [])
  const menu = (
    <Menu onClick={(e) => {
      if (e.key === 'goOut') {
        props.history.push('/login')
        removeToken()
      } else {

        message.info(e.key)
      }
    }} >
      <Menu.Item key='通知中心'>通知中心</Menu.Item>
      <Menu.Item key='设置'>设置 </Menu.Item>
      <Menu.Item key='goOut'>退出</Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <DownOutlined /> 超级管理员
          </a>
        </Dropdown>,
      </Header>
      <Layout>
        <Sider width={'200px'} className="site-layout-background">

          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            onClick={(e) => {
              console.log(e.key)
              
              props.history.push(`/admin/${e.key}`)
            }}
          >
            {/* 左侧菜单栏的渲染 */}
            {
              menulist.map((item, index) => {
                return <SubMenu key={item.path} title={
                  <span>{menuicon[item.id]}{item.authName}</span>
                }>{menulist[index].children.map((item1) => {
                  return <Menu.Item key={item1.path}>
                    <span>{menuicon[item.id]}</span>{item1.authName} </Menu.Item>
                })}  </SubMenu>
              })
            }
          </Menu>
        </Sider>
        <Layout style={{ padding: '12px 12px 12px' }}>
         
          <Content
            // className="site-layout-background"
            style={{
              padding: '0 10px',
              margin: 0,
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default withRouter(Index) 
