import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import API from "../utils/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (type !== "all") params.type = type;
      const res = await API.get("/transactions/", { params });
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [search, type]);

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#111111] mb-6">Transactions</h1>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF7A00] transition-all"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF7A00] transition-all"
          >
            <option value="all">All Types</option>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Date", "Description", "Category", "Amount", "Type"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((txn, i) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                    <td className="px-6 py-4 text-sm text-[#111111] max-w-xs truncate">{txn.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-orange-50 text-[#FF7A00] text-xs font-medium rounded-lg">
                        {txn.category?.display_name || "Uncategorized"}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${txn.transaction_type === "credit" ? "text-green-500" : "text-red-500"}`}>
                      {txn.transaction_type === "credit" ? "+" : "-"}₹{parseFloat(txn.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${txn.transaction_type === "credit" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {txn.transaction_type}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}