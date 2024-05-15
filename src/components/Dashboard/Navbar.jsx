// src/components/Navbar.jsx
import React from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  background-color: #305c89;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  right: 230px; /* Adjusted for RTL */
  width: calc(100% - 270px); /* Adjusted for sidebar width */
  z-index: 1000;
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
`;

const NavbarSearch = styled.input`
  padding: 5px;
  border: none;
  border-radius: 5px;
`;

const Navbar = () => {
    return (
        <NavbarContainer>
            <NavbarBrand>پارس پرند حیان</NavbarBrand>
            <NavbarSearch type="text" placeholder="جستجو..." />
        </NavbarContainer>
    );
};

export default Navbar;
