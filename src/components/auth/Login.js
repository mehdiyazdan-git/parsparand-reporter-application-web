
import React, { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import useAuth from "./useAuth";
import {BASE_URL} from "../../config/config";
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [networkError, setNetworkError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                username,
                password,
            });
            const { access_token, user_role } = response.data;
            login(access_token, username, user_role);
            const from = location.state?.from;
            navigate(from?.pathname || '/api/reports', { replace: true });
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error);
            } else {
                setNetworkError(true);
            }
        }
    };

    return (
        <div style={{fontFamily:"IRANSans"}} className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center mb-4 ">ورود</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>نام کاربری:</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>رمز عبور:</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    ورود
                                </button>
                                {error && (
                                    <Alert variant="danger" style={{ marginTop: 10 }}>
                                        {error}
                                    </Alert>
                                )}
                                {networkError && (
                                    <Alert variant="danger" style={{ marginTop: 10 }}>
                                        خطایی در اتصال به سرور رخ داده است. لطفاً دوباره تلاش کنید.
                                    </Alert>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


