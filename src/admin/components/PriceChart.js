import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const PriceDashboard = ({ priceData }) => {
    if (!priceData || priceData.length === 0) return null;

    // Sıralama
    const sortedData = [...priceData].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // En yüksek, en düşük, ortalama fiyat
    const prices = sortedData.map((p) => p.price);
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);
    const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartlar */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                    <h4 className="text-sm font-semibold text-gray-600">🔼 En Yüksek Fiyat</h4>
                    <p className="text-2xl font-bold text-red-600">{highestPrice.toLocaleString()} ₺</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                    <h4 className="text-sm font-semibold text-gray-600">🔽 En Düşük Fiyat</h4>
                    <p className="text-2xl font-bold text-green-600">{lowestPrice.toLocaleString()} ₺</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                    <h4 className="text-sm font-semibold text-gray-600">📊 Ortalama Fiyat</h4>
                    <p className="text-2xl font-bold text-indigo-600">{averagePrice.toLocaleString()} ₺</p>
                </div>
            </div>

            {/* Grafik */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <h4 className="text-gray-800 text-lg font-semibold mb-4">Zamana Göre Fiyat Değişimi</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sortedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="startDate"
                            tickFormatter={(date) => new Date(date).toLocaleDateString("tr-TR", {
                                day: "2-digit",
                                month: "short",
                            })}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={(val) => `${val.toLocaleString()} ₺`}
                            width={80}
                        />
                        <Tooltip
                            formatter={(value) => `${value.toLocaleString()} ₺`}
                            labelFormatter={(label) =>
                                `Tarih: ${new Date(label).toLocaleDateString("tr-TR")}`
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PriceDashboard;
