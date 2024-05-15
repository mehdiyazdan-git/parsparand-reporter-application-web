
import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Content from './Content';
import {Outlet} from "react-router-dom";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;


const Dashboard = () => {
    return (
        <DashboardContainer>
            <Sidebar />
            <MainContent>
                <Navbar />
                <Content/>
            </MainContent>
        </DashboardContainer>
    );
};

export default Dashboard;
