
import React from 'react';
import styled from 'styled-components';
import WarehouseReceipts from "../WarehouseReceipt/WarehouseReceipts";


const ContentContainer = styled.div`
  padding: 70px 20px 20px 20px;
  padding-right: 250px;
  background-color: #f8f9fa;
  flex-grow: 1;
  height: 100vh; 
  width: calc(100% - 270px);
  overflow-y: auto; 
`;


const Content = () => {
    return (
        <ContentContainer>
            <WarehouseReceipts/>
        </ContentContainer>
    );
};

export default Content;
