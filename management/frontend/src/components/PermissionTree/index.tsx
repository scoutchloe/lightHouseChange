import React, { useState, useEffect } from 'react';
import { Tree, Tag, Spin, Empty } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import type { Permission } from '../../types';
import { permissionApi } from '../../services/api';

interface PermissionTreeProps {
  checkable?: boolean;
  checkedKeys?: number[];
  onCheck?: (checkedKeys: number[]) => void;
  selectable?: boolean;
  selectedKeys?: number[];
  onSelect?: (selectedKeys: number[]) => void;
  showStatus?: boolean;
  height?: number;
}

const PermissionTree: React.FC<PermissionTreeProps> = ({
  checkable = false,
  checkedKeys = [],
  onCheck,
  selectable = false,
  selectedKeys = [],
  onSelect,
  showStatus = true,
  height = 400,
}) => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  // 将权限列表转换为树形数据
  const convertToTreeData = (permissions: Permission[]): DataNode[] => {
    const convertNode = (permission: Permission): DataNode => ({
      key: permission.id,
      title: (
        <span>
          {permission.permissionName}
          <Tag 
            color={permission.permissionType === 'menu' ? 'blue' : 'green'} 
            style={{ marginLeft: 8 }}
          >
            {permission.permissionType === 'menu' ? '菜单' : '按钮'}
          </Tag>
          {showStatus && (
            <Tag 
              color={permission.status === 1 ? 'success' : 'error'} 
              style={{ marginLeft: 4 }}
            >
              {permission.status === 1 ? '启用' : '禁用'}
            </Tag>
          )}
        </span>
      ),
      children: permission.children ? permission.children.map(convertNode) : undefined,
    });

    return permissions.map(convertNode);
  };

  // 获取所有权限ID
  const getAllKeys = (permissions: Permission[]): number[] => {
    const keys: number[] = [];
    const traverse = (nodes: Permission[]) => {
      nodes.forEach(node => {
        keys.push(node.id);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(permissions);
    return keys;
  };

  // 加载权限树
  const loadPermissionTree = async () => {
    setLoading(true);
    try {
      const response = await permissionApi.getTree();
      if (response.code === 200) {
        const permissions = response.data;
        setTreeData(convertToTreeData(permissions));
        
        // 默认展开所有节点
        const allKeys = getAllKeys(permissions);
        setExpandedKeys(allKeys);
      }
    } catch (error) {
      console.error('加载权限树失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissionTree();
  }, []);

  const handleCheck: TreeProps['onCheck'] = (checked) => {
    if (onCheck) {
      // 当启用checkStrictly时，checked是一个对象 {checked: Key[], halfChecked: Key[]}
      // 当未启用checkStrictly时，checked是Key[]数组
      let keys: React.Key[];
      if (typeof checked === 'object' && 'checked' in checked) {
        keys = checked.checked;
      } else if (Array.isArray(checked)) {
        keys = checked;
      } else {
        keys = [];
      }
      onCheck(keys.map(key => Number(key)));
    }
  };

  const handleSelect: TreeProps['onSelect'] = (selected) => {
    if (onSelect) {
      onSelect(selected.map(key => Number(key)));
    }
  };

  const handleExpand = (expanded: React.Key[]) => {
    setExpandedKeys(expanded.map(key => Number(key)));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin tip="加载权限树..." />
      </div>
    );
  }

  if (treeData.length === 0) {
    return <Empty description="暂无权限数据" />;
  }

  return (
    <Tree
      checkable={checkable}
      checkStrictly={checkable} // 当可选择时，禁用级联选择，避免取消子权限时自动取消父权限
      checkedKeys={checkedKeys.map(String)}
      onCheck={handleCheck}
      selectable={selectable}
      selectedKeys={selectedKeys.map(String)}
      onSelect={handleSelect}
      expandedKeys={expandedKeys.map(String)}
      onExpand={handleExpand}
      treeData={treeData}
      height={height}
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '8px',
        backgroundColor: '#fafafa',
      }}
    />
  );
};

export default PermissionTree; 