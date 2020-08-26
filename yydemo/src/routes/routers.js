import Login from '../views/Login'
import Goods from '../views/admin/products/Goods'
import Edit from '../views/admin/products/Edit'
import NotFoundPage from '../views/NotFoundPage'
import User from '../views/admin/user/User'
import Rules from '../views/admin/permissions/Rules'
import Rights from '../views/admin/permissions/Rights'
import Params from '../views/admin/products/Params'
import Categories from '../views/admin/products/Categories'
import Orders from '../views/admin/oders/Orders'
import Reports from '../views/admin/reports/Reports'
import Dashboard from '../components/dashboard/Dashboard'
import GoodsAdd from '../views/admin/products/GoodsAdd'

export const mainRoute = [
    {
        path: '/',
        component: Login,
        exact: true
    }, {
        path: '/login',
        component: Login
    }, {
        path: '/404',
        component: NotFoundPage
    }
]
export const adminRoute = [
    {
        path: '/admin',
        component: Dashboard,
        exact: true
    }, {
        path: '/admin/users',
        component: User
    }, {
        path: '/admin/roles',
        component: Rules
    }, {
        path: '/admin/rights',
        component: Rights
    }, {
        path: '/admin/goods',
        component: Goods,
        exact:true

    }, {
        path: '/admin/params',
        component: Params

    }, {
        path: '/admin/categories',
        component: Categories

    }, {
        path: '/admin/orders',
        component: Orders

    }, {
        path: '/admin/reports',
        component: Reports

    }, {
        path: '/admin/products/edit/:id?',
        component: Edit,
        isshow: false,

    },{
        path:'/admin/goods/goodsadd',
        component:GoodsAdd
    }
]
