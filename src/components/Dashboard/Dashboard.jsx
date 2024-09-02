
import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {Outlet} from "react-router-dom";

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: transparent;
`;
const ContentContainer = styled.div`
    padding: 70px 250px 20px 20px;
    background-color: rgba(255, 255, 255, 0.2);
    flex-grow: 1;
    height: 100vh;
    width: 100%
    overflow-y: auto;
`;


const Dashboard = () => {
    return (
        <DashboardContainer>
            <Sidebar />
            <MainContent>
                <Navbar />
                <ContentContainer>
                    <Outlet/>
                </ContentContainer>
            </MainContent>
        </DashboardContainer>
    );
};

export default Dashboard;
