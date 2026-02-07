import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ScannerPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [scanned, setScanned] = useState(false);

  const handleScan = (results) => {
    if (results && results.length > 0 && !scanned) {
      const rawValue = results[0].rawValue;
      
      if (rawValue) {
        setScanned(true);
        try {
           const parts = rawValue.split('/');
           const token = parts[parts.length - 1];
           
           if(token) {
               setTimeout(() => navigate(`/scan/${token}`), 200);
           }
        } catch (e) {
            setError("Invalid QR Code format");
            setScanned(false);
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
            aspectRatio: '1/1',
            boxShadow: '0 0 20px rgba(229, 9, 20, 0.2)'
        }}>
            {/* FIXED SCANNER COMPONENT */}
            <Scanner
                onScan={handleScan}
                onError={handleError}
                components={{
                    audio: false, 
                    finder: false
                }}
                constraints={{
                    facingMode: 'environment'
                }}
                styles={{
                    container: { width: '100%', height: '100%' },
                    video: { objectFit: 'cover' }
                }}
            />
            
            <div className="absolute inset-0 border-2 border-[#e50914] opacity-50 m-12 rounded-lg pointer-events-none animate-pulse"></div>
        </Box>

        {error && (
            <Typography sx={{ color: '#ff4444', mt: 3, textAlign: 'center', background: 'rgba(255,0,0,0.1)', p: 1, borderRadius: 1 }}>
                {error}
            </Typography>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;