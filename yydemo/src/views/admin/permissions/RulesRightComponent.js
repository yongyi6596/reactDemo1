import React, { useState, useEffect, Fragment } from 'react';
import { Tree } from 'antd';
import { get, post } from '../../../utils/request'
function RulesRightComponent(props) {
    const [treeData, settreeData] = useState([])
    const [TreeCheckKeys, setTreeCheckKeys] = useState('')
    useEffect(() => {
        get(`/rights/tree`).then(res => {
            function deepClone(node1) {
                if (typeof (node1) !== 'Object' || node1 == null) {
                    return node1
                }
                let result
                if (node1 instanceof Array) {
                    result = []
                } else {
                    result = {}
                }
                for (let key in node1) {
                    if (node1.hasOwnProterty(key)) {
                        result[key] = deepClone(node1[key])
                    }
                }
                return result
            }
            const node2 = deepClone(res.data)
            node2.map((item) => {
                item.key = item.id
                item.title = item.authName
                item.children.map((item1) => {
                    item1.key = item1.id
                    item1.title = item1.authName
                    item1.children.map((item2) => {
                        item2.key = item2.id
                        item2.title = item2.authName
                    })
                })
            })
            settreeData(node2)
        })
    }, [])
    const onCheck = (checkedKeyss, info) => {
        const infoarr= [...checkedKeyss,...info.halfCheckedKeys]
        props.Fn(infoarr)
    };
    return (
        <Fragment>
            <Tree

                checkable

                onCheck={onCheck}
                treeData={treeData}
            />

        </Fragment>

    )
}

export default RulesRightComponent
