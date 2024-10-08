// src/components/Navbar.jsx
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import TimeDisplay from "../../utils/TimeDisplay";

const NavbarContainer = styled.div`
  background-color: #305c89;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  right: 200px; /* Adjusted for RTL */
  width: calc(100% - 200px); /* Adjusted for sidebar width */
  z-index: 1000;
`;

const NavbarBrand = styled.div`
  font-family: "Amine", sans-serif;
  font-size: 1.5rem;
`;

const YearWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-right: 10px;
    min-width: 250px;
`;

const Navbar = () => {



    return (
        <NavbarContainer>
            <NavbarBrand>پارس پرند حیان</NavbarBrand>
            <YearWrapper>
                <TimeDisplay/>
            </YearWrapper>
        </NavbarContainer>
    );
};

export default Navbar;
