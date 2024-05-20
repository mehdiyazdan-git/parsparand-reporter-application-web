import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';


const SidebarContainer = styled.div`
  width: 200px;
  height: 100vh;
  background-color: #343a40;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0.1rem;
  position: fixed;
  top: 0;
  right: 0; /* Adjusted for RTL */
  z-index: 1000;
`;

const SidebarItem = styled(NavLink)`
  margin: 0;
  padding: 10px;
  color: white;
  font-family: "IRANSans", sans-serif;
  font-size: 0.9rem;
  text-decoration: none; /* Remove underline */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Add border for hover effect */
  border-collapse: collapse;

  &:hover {
    background-color: #506071;
    cursor: pointer;
  }

  &.active {
    background-color: #113561; /* Color for the selected link */
  }
`;

const Sidebar = () => {
    return (
        <SidebarContainer>
            <SidebarItem to="/warehouseReceipts" className={({ isActive }) => (isActive ? 'active' : '')}>حواله های انبار</SidebarItem>
            <SidebarItem to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>محصولات</SidebarItem>
            <SidebarItem to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>گزارش ها</SidebarItem>
            <SidebarItem to="/customers" className={({ isActive }) => (isActive ? 'active' : '')}>مشتریان</SidebarItem>
            <SidebarItem to="/invoices" className={({ isActive }) => (isActive ? 'active' : '')}>فاکتورها</SidebarItem>
            <SidebarItem to="/invoiceStatuses" className={({ isActive }) => (isActive ? 'active' : '')}>وضعیت های فاکتور</SidebarItem>
            <SidebarItem to="/payments" className={({ isActive }) => (isActive ? 'active' : '')}>پرداخت ها</SidebarItem>
            <SidebarItem to="/adjustments" className={({ isActive }) => (isActive ? 'active' : '')}>تعدیلات</SidebarItem>
            <SidebarItem to="/contracts" className={({ isActive }) => (isActive ? 'active' : '')}>قراردادها</SidebarItem>
            <SidebarItem to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>کاربران</SidebarItem>
            <SidebarItem to="/returneds" className={({ isActive }) => (isActive ? 'active' : '')}>مرجوعی ها</SidebarItem>
            <SidebarItem to="/years" className={({ isActive }) => (isActive ? 'active' : '')}>سال ها</SidebarItem>
        </SidebarContainer>
    );
};

export default Sidebar;
