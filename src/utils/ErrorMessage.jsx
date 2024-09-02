import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

const Container = styled.div`
    margin: 1rem 0;
    font-family: "IRANSans", sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    text-align: center;
    border-radius: 5px;
    padding: 0.5rem 1rem;
`;

const ErrorMessage = ({ message }) => {
    return (
        <Container className="alert alert-danger" role="alert">
            {message}
        </Container>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ErrorMessage;
