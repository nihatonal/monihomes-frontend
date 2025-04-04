import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const token = localStorage.getItem("token"); // Token’ı al

    useEffect(() => {
        const fetchProtectedData = async () => {
            const response = await fetch("http://localhost:5000/api/admin/protected", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            setData(result.message);
        };

        if (token) {
            fetchProtectedData();
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/admin/login"; // Giriş sayfasına yönlendir
    };
    return (
        <div>
            <h2>Admin Dashboard</h2>
            {data ? <p>{data}</p> : <p>Veri yükleniyor...</p>}

            <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
    );
};

export default AdminDashboard;
