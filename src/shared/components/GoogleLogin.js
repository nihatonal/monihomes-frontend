import { useState, useEffect } from "react";

const GoogleLogin = (clientId) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGoogleAPI = () => {
            if (!window.gapi) {
                setError("Google API yüklenemedi.");
                return;
            }
            window.gapi.load("auth2", () => {
                window.gapi.auth2.init({
                    client_id: clientId,
                    redirect_uri: "http://localhost:3000/auth/callback",
                });
            });
        };
        loadGoogleAPI();
    }, [clientId]);

    const handleLogin_ = async () => {
        const auth2 = window.gapi.auth2.getAuthInstance();
        if (!auth2) {
            setError("Google Auth instance oluşturulamadı.");
            return;
        }

        try {
            const googleUser = await auth2.signIn();
            const idToken = googleUser.getAuthResponse().id_token;

            // Token'ı backend'e gönder
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: idToken }),
            });

            if (!response.ok) {
                throw new Error("Backend doğrulama başarısız.");
            }

            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return { user, error, handleLogin_ };
};

export default GoogleLogin;
