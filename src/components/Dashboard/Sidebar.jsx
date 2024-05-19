import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 200px;
  height: 100vh;
  background-color: #343a40;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  top: 0;
  right: 0; /* Adjusted for RTL */
  z-index: 1000;
`;

const SidebarItem = styled(Link)`
  margin: 10px 0;
  padding: 10px;
  color: white;
  text-decoration: none; /* Remove underline */
  &:hover {
    background-color: #495057;
    cursor: pointer;
  }
`;

const Sidebar = () => {
    return (
        <SidebarContainer>
            <SidebarItem to="/warehouseReceipts">حواله های انبار</SidebarItem>
            <SidebarItem to="/products">محصولات</SidebarItem>
            <SidebarItem to="/reports">گزارش ها</SidebarItem>
            <SidebarItem to="/customers">مشتریان</SidebarItem>
            <SidebarItem to="/invoices">فاکتورها</SidebarItem>
            <SidebarItem to="/invoiceStatuses">وضعیت های فاکتور</SidebarItem>
            <SidebarItem to="/payments">پرداخت ها</SidebarItem>
            <SidebarItem to="/adjustments">تعدیلات</SidebarItem>
            <SidebarItem to="/contracts">قراردادها</SidebarItem>
            <SidebarItem to="/users">کاربران</SidebarItem>
            <SidebarItem to="/returneds">مرجوعی ها</SidebarItem>
            <SidebarItem to="/years">سال ها</SidebarItem>
        </SidebarContainer>
    );
};

export default Sidebar;
