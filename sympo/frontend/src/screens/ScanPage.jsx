import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const ScanPage = () => {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState("");

  useEffect(() => {
    const validateQR = async () => {
      try {
        const res = await api.post("/payment/scan/validate", { qrToken: token });

        if (res.data.success) {
          setData(res.data);
        } else {
          setError("Invalid QR Code");
        }
      } catch (err) {
        setError(err.response?.data?.message || "QR validation failed");
      } finally {
        setLoading(false);
      }
    };

    if (token) validateQR();
    else {
      setError("QR token missing");
      setLoading(false);
    }
  }, [token]);

  const handleVerify = async () => {
    if(!selectedEventId) return;

    try {
      setVerifying(true);

      await api.post("/payment/scan/confirm", {
        qrToken: token,
        eventId: selectedEventId,
      });
      
      setData((prev) => ({
        ...prev,
        items: prev.items.map(item => 
          String(item.eventId) === String(selectedEventId) 
            ? { ...item, used: true } 
            : item
        ),
      }));

      setSelectedEventId("");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="relative z-20 min-h-screen flex items-center justify-center bg-black text-white">
        <h2 className="text-xl">Validating QR...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative z-20 min-h-screen flex items-center justify-center bg-black text-red-500">
        <h2 className="text-xl font-bold">{error}</h2>
      </div>
    );
  }

  const pendingItems = data.items.filter(i => !i.used);


  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
      <div className="bg-gray-900 border border-green-500 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-green-400 mb-4 text-center">Ticket Valid</h2>
        
        <div className="space-y-2 text-sm text-gray-300 mb-6">
          <p>User: <span className="text-white">{data.email || "N/A"}</span></p>
          <p>Order: <span className="text-white">{data.orderId}</span></p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-white border-b border-gray-700 pb-2">Events in Ticket</h3>
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-black/50 p-3 rounded">
              <span>{item.title}</span>
              {item.used ? (
                <span className="text-green-500 text-xs font-bold border border-green-500 px-2 py-1 rounded">VERIFIED</span>
              ) : (
                <span className="text-yellow-500 text-xs font-bold">PENDING</span>
              )}
            </div>
          ))}
        </div>

        {pendingItems.length > 0 ? (
          <div className="mt-8 pt-4 border-t border-gray-700">
            <label className="block text-sm mb-2 text-gray-400">Verify Entry For:</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-black border border-gray-600 rounded p-3 mb-4 focus:border-green-500 outline-none"
            >
              <option value="">-- Select Event --</option>
              {pendingItems.map((item) => (
                <option key={item.eventId} value={item.eventId}>
                  {item.title}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleVerify}
              disabled={!selectedEventId || verifying}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded transition disabled:opacity-50"
            >
              {verifying ? "Processing..." : "CONFIRM ENTRY"}
            </button>
          </div>
        ) : (
          <div className="mt-8 text-center bg-green-900/20 p-4 rounded border border-green-900">
            <p className="text-green-500 font-bold">All events verified!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
