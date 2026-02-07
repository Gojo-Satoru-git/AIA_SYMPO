import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';
import { TextField, Button, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import useToast from '../context/useToast';

const inputStyle = {
  input: { color: 'white' },
  label: { color: '#b0b0b0', fontWeight: 500 },
  '& label.Mui-focused': { color: '#e50914' },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#0b0b0b',
    borderRadius: '12px',
    '& fieldset': { borderColor: '#444' },
    '&:hover fieldset': { borderColor: '#e50914' },
    '&.Mui-focused fieldset': { borderColor: '#e50914', boxShadow: '0 0 8px rgba(229,9,20,0.6)' },
  },
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const oobCode = searchParams.get('oobCode');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [checkingCode, setCheckingCode] = useState(true);

  // Validation State
  const [passValid, setPassValid] = useState({
    upper: false, lower: false, num: false, special: false, length: false,
  });
  const [match, setMatch] = useState(false);

  // 1. Verify the link immediately on load
  useEffect(() => {
    if (!oobCode) {
      setIsCodeValid(false);
      setCheckingCode(false);
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        setIsCodeValid(true);
        setCheckingCode(false);
      })
      .catch((error) => {
        console.error(error);
        setIsCodeValid(false);
        setCheckingCode(false);
        showToast('Invalid or expired password reset link.', 'error');
      });
  }, [oobCode, showToast]);

  // 2. Real-time validation
  useEffect(() => {
    setPassValid({
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      num: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      length: password.length >= 8,
    });
    setMatch(password && confirmPassword && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!match || !Object.values(passValid).every(Boolean)) {
       showToast('Please fix password errors', 'error');
       return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      showToast('Password reset successfully! Please login.', 'success');
      navigate('/signin');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ valid, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      {valid ? <CheckCircleIcon sx={{ color: '#e50914', fontSize: 16 }} /> : <CancelIcon sx={{ color: '#333', fontSize: 16 }} />}
      <Typography sx={{ color: valid ? '#ffffff' : '#555', fontSize: '0.75rem', transition: 'all 0.3s ease' }}>
        {text}
      </Typography>
    </Box>
  );

  if (checkingCode) return <div className="text-white text-center mt-20">Verifying link...</div>;

  if (!isCodeValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Typography variant="h5" sx={{ color: '#e50914' }}>Link Expired or Invalid</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/signin')}
          sx={{ color: 'white', borderColor: '#444', '&:hover': { borderColor: '#e50914' } }}
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-black/50 border border-white/10 rounded-2xl backdrop-blur-md">
      <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Create New Password
      </Typography>

      <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
        <TextField
          label="New Password"
          type="password"
          required
          fullWidth
          sx={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Validation Box */}
        {(password.length > 0) && (
          <Box sx={{ p: 2, bgcolor: 'rgba(229,9,20,0.05)', borderRadius: '12px', border: `1px solid rgba(229,9,20,0.4)` }}>
            <div className="grid grid-cols-2 gap-x-2">
              <ValidationItem valid={passValid.length} text="Min 8 Characters" />
              <ValidationItem valid={passValid.upper} text="1 Uppercase" />
              <ValidationItem valid={passValid.lower} text="1 Lowercase" />
              <ValidationItem valid={passValid.num} text="1 Number" />
              <ValidationItem valid={passValid.special} text="1 Special Char" />
            </div>
          </Box>
        )}

        <TextField
          label="Confirm Password"
          type="password"
          required
          fullWidth
          sx={inputStyle}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        {confirmPassword && (
           <Typography sx={{ fontSize: '0.8rem', textAlign: 'right', color: match ? '#e50914' : '#555' }}>
             {match ? 'Passwords Match' : 'Passwords do not match'}
           </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={loading || !match || !Object.values(passValid).every(Boolean)}
          sx={{
            py: 1.5,
            backgroundColor: '#e50914',
            color: 'white',
            fontWeight: 700,
            borderRadius: '999px',
            boxShadow: `0 0 20px rgba(229,9,20,0.4)`,
            '&:hover': { backgroundColor: '#ff1a1a', transform: 'scale(1.02)' },
            '&.Mui-disabled': { backgroundColor: '#333', color: '#666' },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'RESETTING...' : 'RESET PASSWORD'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;