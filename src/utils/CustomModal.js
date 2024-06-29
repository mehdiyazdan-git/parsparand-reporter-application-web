import styled from "styled-components";
import {Modal} from "react-bootstrap";

const CustomModal = styled(Modal)`
          display: flex;
          justify-content: center;
          align-items: center;
        
          .modal-dialog {
            width: auto;
            max-width: 90%; /* Adjust as needed */
          }
        
          .modal-content {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px); /* This applies the glass effect */
            -webkit-backdrop-filter: blur(10px); /* For Safari support */
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        `;
export default CustomModal;