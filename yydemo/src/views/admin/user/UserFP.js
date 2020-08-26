import React, { useEffect, useState} from 'react'
import { Select, message } from 'antd';
import { get, } from '../../../utils/request'

const { Option } = Select;

export default function UserFP(props) {
    const [rolesInfo, setrolesInfo] = useState([])
    useEffect(() => {
        get('/roles').then(res => {

            if (res.meta.status !== 200) {
                message.error(res.meta.msg)
            } else {
                message.success(res.meta.msg)
                setrolesInfo(res.data)
            }
        })
    }, [])


    function onChange(value, e) {
        const newarr = [props.id, e.key]
        props.Fn(newarr)

    }


    return (
        <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择一个角色"
            labelInValue
            optionFilterProp="children"
            onChange={onChange}

            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >{
                rolesInfo.map((item) => {
                    return (
                        <Option key={item.id} value={item.roleName}  >{item.roleName}</Option>
                    )
                })
            }


        </Select>
    )
}
