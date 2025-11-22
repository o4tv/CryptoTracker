import { useNavigate } from "react-router-dom";
import type { CoinData } from "../types/coinData";

const Coin = ({ coinData }: { coinData: CoinData }) => {
  const goToDetails = useNavigate();
  const openDetails = (id: string) => goToDetails(`coin/${id}`);

  return (
    <li
      onClick={() => openDetails(coinData.id)}
      className="bg-[#202024] rounded-xl p-4 mb-3 flex items-center justify-between cursor-pointer hover:bg-[#29292e] transition-colors"
    >
      <div className="flex items-center gap-4">
        <img
          src={coinData.image}
          alt={coinData.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-gray-100 font-medium">{coinData.name}</span>
          <span className="text-gray-500 text-sm uppercase">
            {coinData.symbol}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-gray-100 font-medium">
          {formatPrice(coinData.current_price)}
        </span>
        <span
          className={`text-sm font-medium ${
            coinData.price_change_percentage_24h >= 0
              ? "text-[#00B37E]"
              : "text-[#F75A68]"
          }`}
        >
          {coinData.price_change_percentage_24h > 0 ? "+" : ""}
          {coinData.price_change_percentage_24h.toFixed(2)}%
        </span>
      </div>
    </li>
  );
};

const formatPrice = (price: number) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export default Coin;
