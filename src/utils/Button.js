import styled from 'styled-components';

const Button = styled.button.attrs(props => ({
  type: props.type || 'button'  // Set default type to 'button'
}))`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-family: "IRANSans", sans-serif;
  font-size: 0.7rem;
  margin: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: white;

  /* Color props for different variants */
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return '#007bff';
      case 'secondary':
        return '#6c757d';
      case 'success':
        return '#28a745';
      case 'danger':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  }};

  &:hover {
    background-color: ${props => {
      switch (props.$variant) {
        case 'primary':
          return '#0056b3';
        case 'secondary':
          return '#5a6268';
        case 'success':
          return '#218838';
        case 'danger':
          return '#c82333';
        case 'warning':
          return '#e0a800';
        default:
          return '#5a6268';
      }
    }};
  }

  /* Handle focus state */
  &:focus {
    outline: none;
    box-shadow: ${props => {
      switch (props.$variant) {
        case 'primary':
          return '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
        case 'secondary':
          return '0 0 0 0.2rem rgba(108, 117, 125, 0.25)';
        case 'success':
          return '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
        case 'danger':
          return '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        case 'warning':
          return '0 0 0 0.2rem rgba(255, 193, 7, 0.25)';
        default:
          return '0 0 0 0.2rem rgba(108, 117, 125, 0.25)';
      }
    }};
  }
`;

export default Button;
