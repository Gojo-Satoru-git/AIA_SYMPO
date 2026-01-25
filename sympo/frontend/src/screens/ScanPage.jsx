import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const ScanPage = () => {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");

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

    if (token) {
      validateQR();
    } else {
      setError("QR token missing");
      setLoading(false);
    }
  }, [token]);

  const handleVerify = async () => {
    if(!selectedEvent) {
      setError("Please select an event");
      return;
    }
    try {
      setVerifying(true);

      const res = await api.post("/payment/scan/confirm", {
        qrToken: token,
        eventId: selectedEvent,
      });
      
      setData((prev => ({
        ...prev,
        events: res.data.events,
      })));

      setSelectedEvent("");
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

  const remainingEvents = data.events.filter(
    (event) => !event.used
  );


  return (
    <div className="relative z-20 min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="bg-gray-900 border border-green-500 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-400">
          Participant Details
        </h2>

        <p className="mb-2">
          <strong>Email:</strong> {data?.email}
        </p>

        <p className="mb-2">
          <strong>Order ID:</strong> {data?.orderId}
        </p>

        <p className="mb-4">
          <strong>Amount:</strong> ₹{data?.amount}
        </p>

        <div className="mt-4 text-left">
          <p className="mb-2 font-semibold">Events:</p>

          {data.events.map((event) => (
            <div key={event.id} className="flex justify-between mb-1">
              <span>{event.title}</span>
              {event.used ? (
                <span className="text-green-400">✔ Verified</span>
              ) : (
                <span className="text-yellow-400">Pending</span>
              )}
            </div>
          ))}
        </div>

        {remainingEvents.length > 0 && (
          <>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="mt-4 w-full p-2 rounded bg-black border border-green-500"
            >
              <option value="">Select event to verify</option>
              
              {data.events
                .filter((event) => !event.used)
                .map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
              ))}
            </select>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="mt-4 px-6 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
            >
              {verifying ? "Verifying..." : "VERIFY EVENT"}
            </button>
          </>
        )}

        {remainingEvents.length === 0 && (
          <p className="text-green-400 font-bold mt-4 text-lg">
            All Events Verified ✔
          </p>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
