import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPrice = () => {
    const [prices, setPrices] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [price, setPrice] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Fiyatları çekme
    const fetchPrices = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/prices`);
            setPrices(response.data);
        } catch (err) {
            console.error('Fiyatlar alınırken hata oluştu:', err);
        }
    };

    // Yeni fiyat ekleme
    const handleAddPrice = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/protected/prices/add`, {
                startDate,
                endDate,
                price,
            });
            setPrices([...prices, response.data]);
            resetForm();
        } catch (err) {
            console.error('Fiyat eklenirken hata oluştu:', err);
        }
    };

    // Fiyatı güncelleme
    const handleUpdatePrice = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/admin/protected/prices/${editingId}`, {
                startDate,
                endDate,
                price,
            });
            setPrices(prices.map((item) => (item._id === editingId ? response.data : item)));
            resetForm();
        } catch (err) {
            console.error('Fiyat güncellenirken hata oluştu:', err);
        }
    };

    // Fiyat silme
    const handleDeletePrice = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/protected/prices/${id}`);
            setPrices(prices.filter((price) => price._id !== id));
        } catch (err) {
            console.error('Fiyat silinirken hata oluştu:', err);
        }
    };

    // Formu sıfırlama
    const resetForm = () => {
        setStartDate('');
        setEndDate('');
        setPrice('');
        setIsEditing(false);
        setEditingId(null);
    };

    // Düzenleme formunu açma
    const handleEdit = (price) => {
        setStartDate(price.startDate);
        setEndDate(price.endDate);
        setPrice(price.price);
        setIsEditing(true);
        setEditingId(price._id);
    };

    // Sayfa yüklendiğinde fiyatları çekme
    useEffect(() => {
        fetchPrices();
    }, [prices]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Fiyat Yönetimi</h1>
            <div className='flex flex-col md:flex-row justify-between mt-10'>
                {/* Fiyat Ekleme/Güncelleme Formu */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Fiyat Güncelle' : 'Yeni Fiyat Ekle'}</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Fiyat</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={isEditing ? handleUpdatePrice : handleAddPrice}
                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                {isEditing ? 'Güncelle' : 'Ekle'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                                >
                                    İptal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Fiyat Listesi */}
                <div className="mt-8 md:mt-0 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Fiyat Listesi</h2>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="px-4 py-2">Başlangıç Tarihi</th>
                                <th className="px-4 py-2">Bitiş Tarihi</th>
                                <th className="px-4 py-2">Fiyat</th>
                                <th className="px-4 py-2">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map((price) => (
                                <tr key={price._id} className="border-b">
                                    <td className="px-4 py-2">{new Date(price.startDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{new Date(price.endDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">€ {price.price}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleEdit(price)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDeletePrice(price._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPrice;
