import { ArrowDown, ArrowUp } from "lucide-react";

const PriceSummary = ({ uniquePrices }) => {
    if (!uniquePrices || uniquePrices.length === 0) return null;

    const minPrice = Math.min(...uniquePrices);
    const maxPrice = Math.max(...uniquePrices);

    return (
        <div>
            <h4 className="text-gray-800 text-lg font-semibold mb-4">Fiyat Özeti</h4>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-green-100 text-green-700 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1">
                        <ArrowDown size={16} />
                        <p className="text-sm">En Düşük</p>
                    </div>
                    <p className="text-xl font-bold">{minPrice.toLocaleString()} €</p>
                </div>

                <div className="p-3 bg-red-100 text-red-700 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-1">
                        <ArrowUp size={16} />
                        <p className="text-sm">En Yüksek</p>
                    </div>
                    <p className="text-xl font-bold">{maxPrice.toLocaleString()} €</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {uniquePrices.map((p, i) => (
                    <span
                        key={i}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                    >
                        {p.toLocaleString()} €
                    </span>
                ))}
            </div>
        </div>
    );
};

export default PriceSummary;
