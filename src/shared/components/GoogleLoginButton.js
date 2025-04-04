import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Google'dan gelen mesajları dinle
        const handleMessage = (event) => {
            if (event.data && event.data.accessToken) {
                console.log("Access Token:", event.data.accessToken);
                console.log("Refresh Token:", event.data.refreshToken);
                console.log("User Info:", event.data.userInfo);
                setUserInfo(event.data.userInfo); // Kullanıcı bilgisini kaydet
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handleLogin = () => {
        // Yeni bir pencere aç ve Google girişini başlat
        const loginWindow = window.open("http://localhost:5000/api/login", "_blank", "width=500,height=600");

        if (!loginWindow) {
            alert("Pop-up engelleyici açık olabilir. Lütfen devre dışı bırakın.");
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div>
                <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Google ile Giriş Yap
                </button>

                {userInfo && (
                    <div className="mt-4">
                        <h3>Hoşgeldiniz, {userInfo.name}!</h3>
                        <img src={userInfo.picture} alt="User" className="rounded-full w-16 h-16 mt-2" />
                        <p>Email: {userInfo.email}</p>
                    </div>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
