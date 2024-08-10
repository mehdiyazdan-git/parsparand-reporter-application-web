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
            max-width: 90%; /* Adjust as needed */
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
