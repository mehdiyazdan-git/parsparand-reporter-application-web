import styled from "styled-components";

import React from 'react';

const SidebarContainer = styled.div`  
  width: 200px;  
  height: 100vh;  
  background-color: rgba(1, 47, 87, 0.49);  
  color: white;  
  display: flex;  
  flex-direction: column;  
  padding: 0.1rem;  
  position: fixed;  
  top: 0;  
  right: 0; /* Adjusted for RTL */  
  z-index: 1000;
`;

// eslint-disable-next-line no-use-before-define
const NavLink = styled(NavLink)`
   margin: 0;
    padding: 10px;
    color: white;
    font-family: 'IRANSans, sans-serif',sans-serif;
    font-size: 0.9rem;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-collapse: collapse;

    &:hover {
        background-color: #506071;
        cursor: pointer;
    }

    &.active {
        background-color: #113561 !important; 
    },
`;

const SidebarItem = ({ to, caption, children }) =>
    <NavLink
        to={to}
        className={({ isActive }) =>
            isActive ? 'active' : ''
        }
    >
            {caption || children}
    </NavLink>
;

const Sidebar = () => {
        return (
            <SidebarContainer>
                    <SidebarItem to="/warehouseReceipts" caption={"حواله های انبار"}/>
                    <SidebarItem to="/products" caption={"محصولات"}/>
                    <SidebarItem to="/reports" caption={"گزارش ها"}/>
                    <SidebarItem to="/monthly-report" caption={"گزارش ماهیانه"}/>
                    <SidebarItem to="/annual-report" caption={"گزارش سالیانه"}/>
                    <SidebarItem to="/year-comparison-report" caption={"گزارش مقایسه ای سال"}/>
                    <SidebarItem to="/customers" caption={"مشتریان"}/>
                    <SidebarItem to="/client-summary" caption={"خلاصه مشتری"}/>
                    <SidebarItem to="/invoices" caption={"فاکتورها"}/>
                    <SidebarItem to="/invoiceStatuses" caption={"وضعیت های فاکتور"}/>
                    <SidebarItem to="/payments" caption={"پرداخت ها"}/>
                    <SidebarItem to="/adjustments" caption={"تعدیلات"}/>
                    <SidebarItem to="/contracts" caption={"قراردادها"}/>
                    <SidebarItem to="/users" caption={"کاربران"}/>
                    <SidebarItem to="/returneds" caption={"مرجوعی ها"}/>
                    <SidebarItem to="/years" caption={"سال ها"}/>
                    <SidebarItem to="/login" caption={"login"}/>
            </SidebarContainer>
        );
};

export default Sidebar;