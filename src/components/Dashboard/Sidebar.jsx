import styled from "styled-components";

import React from 'react';
import { NavLink } from 'react-router-dom';

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

const SidebarItem = ({ to, caption, children }) =>
    <NavLink
        to={to}
        className={({ isActive }) =>
            isActive ? 'active' : ''
        }
        style={{
                margin: 0,
                padding: '10px',
                color: 'white',
                fontFamily: 'IRANSans, sans-serif',
                fontSize: '0.9rem',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderCollapse: 'collapse',
                '&:hover': {
                        backgroundColor: '#506071',
                        cursor: 'pointer',
                },
                '&.active': {
                        backgroundColor: '#113561',
                },
        }}
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