import { useState } from 'react';
import QrScanner from "react-qr-barcode-scanner";
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Scanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleScan = (data) => {
    if (data) {
      const scannedText = data?.text || data;
      
      if (scannedText) {
        try {
           const parts = scannedText.split('/');
           const token = parts[parts.length - 1];
           
           if(token) {
               navigate(`/scan/${token}`);
           }
        } catch (e) {
            setError("Invalid QR Code format");
        }
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Camera access denied or error occurred.");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-md relative">
        <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ color: '#aaa', mb: 2 }}
        >
            Back to Home
        </Button>

        <Typography variant="h5" sx={{ color: '#e50914', fontWeight: 700, mb: 1, textAlign: 'center' }}>
            SCAN TICKET
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 4, textAlign: 'center' }}>
            Align the QR code within the frame
        </Typography>

        <Box sx={{ 
            border: '2px solid #333', 
            borderRadius: '16px', 
            overflow: 'hidden',
            position: 'relative',
            bgcolor: '#000',
            aspectRatio: '1/1'
        }}>
            <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                constraints={{
                    video: { facingMode: 'environment' } // Uses back camera on mobile
                }}
            />
            
            <div className="absolute inset-0 border-2 border-[#e50914] opacity-50 m-12 rounded-lg pointer-events-none animate-pulse"></div>
        </Box>

        {error && (
            <Typography sx={{ color: 'red', mt: 2, textAlign: 'center' }}>
                {error}
            </Typography>
        )}
      </div>
    </div>
  );
};

export default Scanner;