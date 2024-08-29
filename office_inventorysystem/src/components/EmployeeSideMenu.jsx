import { useState } from 'react';
import { Menu, Button } from 'antd';
import { RxDashboard } from "react-icons/rx";
import { BsFillCartCheckFill } from "react-icons/bs";
import { MdOutlineAddchart } from "react-icons/md";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function EmployeeSideMenu() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`side-menu-container ${collapsed ? 'collapsed' : ''}`}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        onClick={(item)=>{
          navigate(item.key)
        }}
        defaultSelectedKeys={['Dashboard-Employee']}
        mode="inline"
        inlineCollapsed={collapsed}
        items={[
          {
            label: 'Dashboard',
            icon: <RxDashboard />,
            key: '/employee/dashboard'
          },
          {
            label: 'Check Inventory',
            icon: <BsFillCartCheckFill />,
            key: '/employee/inventory'
          },
          {
            label: 'Reports',
            icon: <MdOutlineAddchart style={{fontSize: 15}} />,
            key: '/employee/reports'
          }
        ]}
      />
    </div>
  );
}