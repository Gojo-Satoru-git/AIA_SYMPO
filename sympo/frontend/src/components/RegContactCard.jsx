import { Card, CardContent, Typography, Box } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useToast from '../context/useToast';

const RegistrationCard = ({ position, name, phone }) => {
  const { showToast } = useToast();

  const handleCopy = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    showToast('Phone number copied!', 'success');
  };

  return (
    <Card
      className="
        group relative
        flex-shrink-0 snap-center
        transition-all duration-300
        hover:scale-[1.03]
      "
      sx={{
        backgroundColor: '#0a0a0a', // Deep black
        backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a0505 100%)',
        borderLeft: '4px solid #dc2626', // Red strip on left
        borderRight: '1px solid #333',
        borderTop: '1px solid #333',
        borderBottom: '1px solid #333',
        borderRadius: '8px',
        width: { xs: 240, sm: 260, md: 280 },
        minHeight: 160,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {/* Background Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <CardContent sx={{ width: '100%', padding: '0 !important' }}>
        {/* --- BADGE HEADER --- */}
        <div className="bg-red-900/20 py-2 px-4 flex justify-between items-center border-b border-red-900/30">
          <span className="text-[0.6rem] font-mono uppercase tracking-[0.2em] text-red-400">
            Authorized
          </span>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e] animate-pulse"></div>
        </div>

        <div className="p-5 text-center">
          {/* POSITION */}
          <Typography
            variant="subtitle1"
            className="text-red-500 font-bold uppercase tracking-widest mb-1"
            sx={{ fontSize: '0.9rem', textShadow: '0 0 5px rgba(220, 38, 38, 0.4)' }}
          >
            {position}
          </Typography>

          <div className="h-px w-12 bg-gray-700 mx-auto mb-3"></div>

          {/* NAME */}
          <Typography className="text-white text-lg font-serif tracking-wide mb-3 group-hover:text-red-100 transition-colors">
            {name}
          </Typography>

          {/* PHONE */}
          <Box
            onClick={() => handleCopy(phone)}
            className="
                    inline-flex items-center gap-2 px-4 py-1.5
                    bg-black border border-gray-800 rounded
                    group-hover:border-red-600 group-hover:shadow-[0_0_10px_rgba(220,38,38,0.3)]
                    transition-all duration-300
                    cursor-pointer hover:bg-gray-900 active:scale-95 transition-transform
                "
            title="Click to copy"
          >
            <LocalPhoneIcon
              sx={{ fontSize: 14 }}
              className="text-gray-500 group-hover:text-red-500 transition-colors"
            />
            <Typography className="text-gray-400 font-mono text-xs tracking-wider group-hover:text-white transition-colors">
              {phone}
            </Typography>
            <ContentCopyIcon
              sx={{ fontSize: 12 }}
              className="text-gray-600 group-hover:text-red-400 ml-1 transition-colors"
            />
          </Box>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationCard;
