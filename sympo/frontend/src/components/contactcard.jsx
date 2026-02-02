import { Card, CardContent, Typography, Box } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useToast from '../context/useToast';

const ContactCard = ({ eventName, coordinators }) => {
  const { showToast } = useToast();

  const handleCopy = (phone) => {
    navigator.clipboard.writeText(phone);
    showToast('Phone number copied!', 'success');
  };

  return (
    <Card
      className="
        group relative
        flex-shrink-0 snap-center mx-3
        transition-all duration-500 ease-out
        hover:-translate-y-2
      "
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(153, 27, 27, 0.4)', // red-800
        borderRadius: '4px', // Sharper corners for retro feel
        width: { xs: 260, sm: 280, md: 300 },
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* --- DECORATION: RED TAPE AT TOP --- */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_10px_#dc2626] z-10" />

      {/* --- HOVER GLOW EFFECT --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '1.5rem',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {/* --- HEADER: EVENT NAME --- */}
        <div className="mb-6 border-b border-red-900/30 pb-4">
          <Typography
            className="font-serif text-red-500 tracking-wider uppercase text-center drop-shadow-sm group-hover:text-red-400 transition-colors"
            sx={{
              fontFamily: '"ITC Benguiat", serif', // Fallback to serif
              fontWeight: 700,
              fontSize: '1.25rem',
              lineHeight: 1.2,
            }}
          >
            {eventName}
          </Typography>
          <div className="flex justify-center mt-2 opacity-50">
            {/* Tiny decorative squares */}
            <div className="w-1 h-1 bg-red-600 mx-1"></div>
            <div className="w-1 h-1 bg-red-600 mx-1"></div>
            <div className="w-1 h-1 bg-red-600 mx-1"></div>
          </div>
        </div>

        {/* --- BODY: COORDINATORS --- */}
        <div className="flex-grow flex flex-col justify-center gap-5">
          {coordinators.map((coord, index) => (
            <Box key={index} className="flex flex-col items-center relative">
              {/* Name */}
              <Typography className="text-gray-200 font-bold tracking-wide uppercase text-sm mb-1">
                {coord.name}
              </Typography>

              {/* Phone (Terminal Style) */}
              <Box
                onClick={() => handleCopy(coord.phone)}
                className="
                  flex items-center gap-2 px-3 py-1 
                  bg-black/50 border border-red-900/30 rounded-full
                  group-hover:border-red-600/50 transition-colors duration-300
                  cursor-pointer hover:bg-black/70 active:scale-95 transition-transform
                "
                title="Click to copy"
              >
                <LocalPhoneIcon sx={{ fontSize: 14 }} className="text-red-500" />
                <Typography className="text-red-100/70 font-mono text-xs tracking-widest">
                  {coord.phone}
                </Typography>
                <ContentCopyIcon sx={{ fontSize: 12 }} className="text-red-500/70 ml-1" />
              </Box>
            </Box>
          ))}
        </div>

        {/* --- FOOTER: DECORATIVE BARCODE --- */}
        <div className="mt-4 flex justify-between items-end opacity-30">
          <div className="text-[0.5rem] text-red-500 font-mono">HAWKINS LAB</div>
          {/* CSS Fake Barcode */}
          <div className="flex h-3 items-end gap-[1px]">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`bg-red-600 w-[2px] ${Math.random() > 0.5 ? 'h-full' : 'h-1/2'}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
