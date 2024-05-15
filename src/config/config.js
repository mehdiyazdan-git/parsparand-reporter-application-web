const IPADDRESS = process.env.REACT_APP_IPADDRESS;
const PORT = process.env.REACT_APP_PORT;
const BASE_URL = `http://${IPADDRESS}:${PORT}/api`;

export { IPADDRESS, PORT, BASE_URL };

