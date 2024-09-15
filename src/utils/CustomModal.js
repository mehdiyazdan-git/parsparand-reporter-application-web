import styled from "styled-components";
import {Modal} from "react-bootstrap";

const CustomModal = styled(Modal).attrs(props => ({
  ...props,
}))`
          display: flex;
          justify-content: center;
          align-items: center;
        
          .modal-dialog {
            width: fit-content;
            min-width: 700px;
            max-width: 95%; /* Adjust as needed */
          }
        
          .modal-content {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px); /* This applies the glass effect */
            -webkit-backdrop-filter: blur(10px); /* For Safari support */
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
              color: white;
              font-size: 1.2rem;
              font-weight: 500;
              transition: all 0.3s ease-in-out;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              
          }
        `;
export default CustomModal;

export const Body = styled(Modal.Body)`
    max-height: 75vh;
    min-height: max-content;
    min-width: calc(var(--bs-modal-width) + 1rem);
    overflow-y: auto;
    font-family: "IRANSans", sans-serif;
    font-size: 0.8rem;
    margin: 0;
    background-color: rgba(240, 240, 240, 0.3);
    border-radius: 0.25rem;
    padding: 1rem;
    line-height: 1.5;
    color: #495057;
    border: 1px solid #9c9c9c;
`;

export const Header = styled(Modal.Header)`
    background-color: rgba(28, 94, 161, 0.2);
    padding: 10px;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
    text-align: right;
    text-indent: 10px;
    font-family: "IRANSansBold", sans-serif
`;

export const Title = styled(Modal.Title)`
    font-family: "IRANSansBold", sans-serif;
    font-size: 0.8rem;
    color: #fff;
`;
export const Container = styled.div`
    width: 100%;
    padding-right: calc(var(1.5rem) * 0.5);
    padding-left: calc(var(0) * 0.5);
    margin-right: auto;
    margin-left: auto;
`;
