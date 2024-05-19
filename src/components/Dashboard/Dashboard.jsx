
import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Content from './Content';
import WarehouseReceipts from "../WarehouseReceipt/WarehouseReceipts";
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
const ContentContainer = styled.div`
  padding: 70px 20px 20px 20px;
  padding-right: 250px;
  background-color: #f8f9fa;
  flex-grow: 1;
  height: 100vh; 
  width: calc(100% - 270px);
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
