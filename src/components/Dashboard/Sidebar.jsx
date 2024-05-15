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
            <SidebarItem to="/">داشبورد</SidebarItem>
            <SidebarItem to="/page1">نمودارها</SidebarItem>
            <SidebarItem to="/page2">جداول</SidebarItem>
        </SidebarContainer>
    );
};

export default Sidebar;
