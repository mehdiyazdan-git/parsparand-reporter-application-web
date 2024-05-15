import React from 'react';
import styled from "styled-components";
import {useAuth} from "../hooks/useAuth";
import Button from "./Button";


const ErrorPageContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: calc(100vh - 200px);
        font-family: IRANSans,sans-serif;
        font-size: 0.8rem;
        font-weight: bold;
        color: #ff0000;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 20px;
        width: calc(100% - 40px);
        @media (max-width: 768px) {
            width: 100%;
            max-width: 100%;
        }
    `;

const ErrorMessage = styled.div`
  text-align: right;
  margin-bottom: 20px;
  border: 1px solid #afaeae;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const LoadingDataErrorPage = () => {
    const auth = useAuth();
    return (
        <ErrorPageContainer>
            <ErrorMessage>
                <p>خطا در دریافت اطلاعات از سرور</p>
                <p>1 -لطفا یک با از برنامه خارج شده و مجددا وارد شوید.</p>
                <p>2 - تنظیمات شبکه و vpn خود را چک کنید.</p>
                <p>3 - در صورت مشکل در اتصال به اینترنت لطفا با پشتیبانی تماس بگیرید.</p>
            </ErrorMessage>
            <Button onClick={auth.logout}>خروج از سیستم</Button>
        </ErrorPageContainer>
    );
};

export default LoadingDataErrorPage;
