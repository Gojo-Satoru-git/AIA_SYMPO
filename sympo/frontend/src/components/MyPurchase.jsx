import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { usePurchases } from "../context/PurchaseContext";
import QRCodeBox from "./QrCodeBox";

const MyPurchaseDialog = ({ open, onClose }) => {
  const { purchases = [] } = usePurchases();
  const [activePurchase, setActivePurchase] = useState(null);

  return (
    <>
      {/* ================= MAIN DIALOG ================= */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#000",
            color: "#fff",
            border: "2px solid #e50914",
            borderRadius: "20px",
          },
        }}
      >
        <Box sx={{ textAlign: "center", pt: 2 }}>
          <Typography
            sx={{
              color: "#e50914",
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: "22px",
            }}
          >
            TEKHORA 26
          </Typography>
        </Box>

        <DialogContent dividers>
          {Array.isArray(purchases) && purchases.length > 0 ? (
            purchases.map((purchase) => {
              const events = Array.isArray(purchase?.events)
                ? purchase.events
                : [];

              const eventNames = events.map((e) => e.title).join(", ");
              return (
                <Box
                  key={purchase.orderId}
                  sx={{
                    border: "1px solid #e50914",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    backgroundColor: "#0a0a0a",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={600} color="#fff">
                      {eventNames || "No Events"}
                    </Typography>

                    <Typography variant="caption" color="#fff">
                      Total Paid: ₹{purchase.amount}
                    </Typography>
                  </Box>

                  <QRCodeBox
                    value={purchase.qrToken}
                    size={40}
                    onClick={() => setActivePurchase(purchase)}
                  />
                </Box>
              );
            })
          ) : (
            <Typography
              textAlign="center"
              color="#777"
              sx={{ py: 4, letterSpacing: 1 }}
            >
              No purchases found
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="error" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= QR POPUP ================= */}
      <Dialog
        open={Boolean(activePurchase)}
        onClose={() => setActivePurchase(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#000",
            color: "#fff",
            border: "2px solid #e50914",
            borderRadius: "16px",
          },
        }}
      >
        {activePurchase && (
          <DialogContent sx={{ textAlign: "center", p: 4 }}>
            <Typography
              variant="h6"
              fontWeight={800}
              letterSpacing={2}
              mb={2}
              color="#e50914"
            >
              TEKHORA 26
            </Typography>

            <Box display="flex" justifyContent="center" my={2}>
              <QRCodeBox value={activePurchase.qrToken} size={220} />
            </Box>

            <Typography variant="body1" fontWeight={600} mt={3} color="#fff">
              {(activePurchase.events || [])
                .map((e) => e.title)
                .join(", ")}
            </Typography>

            <Typography variant="caption" color="#fff" mt={1} display="block">
              Total Paid: ₹
              {(activePurchase.events || []).reduce(
                (sum, e) => sum + (e.price || 0),
                0
              )}
            </Typography>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default MyPurchaseDialog;
