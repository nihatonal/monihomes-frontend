import { useState } from "react";

const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token); // Token’ı sakla
            onLogin(); // Ana sayfaya yönlendirme veya state güncelleme
        } else {
            alert(data.message || "Giriş başarısız!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 to-blue-300">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
                <h2 className="text-2xl font-bold text-center text-teal-600">Hoş Geldiniz</h2>
                <p className="text-gray-600 text-center mb-6">Lütfen giriş yapın</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium">Kullanıcı Adınız</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            placeholder="Adınız"
                            onChange={(e) => setUsername(e.target.value)} required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Şifre</label>
                        <input
                            type="password"
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            placeholder="********"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition font-semibold">
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
