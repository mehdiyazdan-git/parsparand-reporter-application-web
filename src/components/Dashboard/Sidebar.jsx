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

const StyledNavLink = styled(NavLink)`
    display: block;
    padding: 10px 15px;
    color: white;
    font-family: "IRANSans", sans-serif;
    font-size: 0.8rem;
    border: #dfe5df 1px solid;
    border-collapse: collapse;
    text-decoration: none;
    border-radius: 1px;
    margin: 0;
    transition: background-color 0.3s, color 0.3s;

    &.active {
        background-color: rgba(1, 47, 87, 0.49);
        color: #fff;
    }

    &:hover {
        background-color: ${({ isActive }) => (isActive ? '#123963' : '#195595')};
        color: #fff;
    }
`;

const SidebarItem = ({ to, caption, children }) => (
    <StyledNavLink to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
        {caption || children}
    </StyledNavLink>
);

const Sidebar = () => {
    return (
        <SidebarContainer>
            <SidebarItem to="/warehouseReceipts" caption="حواله های انبار" />
            <SidebarItem to="/products" caption="محصولات" />
            <SidebarItem to="/reports" caption="گزارش ها" />
            <SidebarItem to="/monthly-report" caption="گزارش ماهیانه" />
            <SidebarItem to="/annual-report" caption="گزارش سالیانه" />
            <SidebarItem to="/year-comparison-report" caption="گزارش مقایسه ای سال" />
            <SidebarItem to="/customers" caption="مشتریان" />
            <SidebarItem to="/client-summary" caption="خلاصه مشتری" />
            <SidebarItem to="/invoices" caption="فاکتورها" />
            <SidebarItem to="/invoiceStatuses" caption="وضعیت های فاکتور" />
            <SidebarItem to="/payments" caption="پرداخت ها" />
            <SidebarItem to="/adjustments" caption="تعدیلات" />
            <SidebarItem to="/contracts" caption="قراردادها" />
            <SidebarItem to="/users" caption="کاربران" />
            <SidebarItem to="/returneds" caption="مرجوعی ها" />
            <SidebarItem to="/years" caption="سال ها" />
            <SidebarItem to="/login" caption="login" />
        </SidebarContainer>
    );
};

export default Sidebar;
