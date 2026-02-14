import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode, applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';
// Added InputAdornment and IconButton
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
// Added Visibility Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
  const mode = searchParams.get('mode');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('loading');

  // --- New State for Visibility ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passValid, setPassValid] = useState({
    upper: false,
    lower: false,
    num: false,
    special: false,
    length: false,
  });
  const [match, setMatch] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid');
      return;
    }

    if (mode === 'verifyEmail') {
      applyActionCode(auth, oobCode)
        .then(() => {
          setStatus('success');
          showToast('Email verified successfully!', 'success');
          setTimeout(() => navigate('/signin'), 3000);
        })
        .catch((error) => {
          console.error('Verification Error:', error);
          setStatus('invalid');
          showToast('Invalid or expired verification link.', 'error');
        });
    } else if (mode === 'resetPassword') {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {
          setStatus('valid');
        })
        .catch((error) => {
          console.error('Reset Code Error:', error);
          setStatus('invalid');
          showToast('Invalid or expired password reset link.', 'error');
        });
    } else {
      setStatus('invalid');
    }
  }, [oobCode, mode, navigate, showToast]);

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
      {valid ? (
        <CheckCircleIcon sx={{ color: '#e50914', fontSize: 16 }} />
      ) : (
        <CancelIcon sx={{ color: '#333', fontSize: 16 }} />
      )}
      <Typography
        sx={{ color: valid ? '#ffffff' : '#555', fontSize: '0.75rem', transition: 'all 0.3s ease' }}
      >
        {text}
      </Typography>
    </Box>
  );

  // Status screens (Loading/Invalid/Success) remain unchanged...
  if (status === 'loading')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <CircularProgress sx={{ color: '#e50914' }} />
        <Typography sx={{ color: '#aaa' }}>Processing request...</Typography>
      </div>
    );
  if (status === 'invalid')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <CancelIcon sx={{ color: '#e50914', fontSize: 60 }} />
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
          Invalid Link
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/signin')}
          sx={{ mt: 2, color: 'white', borderColor: '#444', '&:hover': { borderColor: '#e50914' } }}
        >
          Return to Login
        </Button>
      </div>
    );
  if (mode === 'verifyEmail' && status === 'success')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <CheckCircleIcon sx={{ color: '#00e676', fontSize: 80 }} />
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
          Email Verified!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/signin')}
          sx={{ mt: 2, bgcolor: '#e50914', '&:hover': { bgcolor: '#ff1a1a' } }}
        >
          Login Now
        </Button>
      </div>
    );

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-md">
      <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Create New Password
      </Typography>

      <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
        <TextField
          label="New Password"
          // Toggle type between password and text
          type={showPassword ? 'text' : 'password'}
          required
          fullWidth
          sx={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
          // Added Eye Icon Logic
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: '#e50914' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {password.length > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'rgba(229,9,20,0.05)',
              borderRadius: '12px',
              border: `1px solid rgba(229,9,20,0.4)`,
            }}
          >
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
          // Toggle type between password and text
          type={showConfirmPassword ? 'text' : 'password'}
          required
          fullWidth
          sx={inputStyle}
          onChange={(e) => setConfirmPassword(e.target.value)}
          // Added Eye Icon Logic
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: '#e50914' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {confirmPassword && (
          <Typography
            sx={{ fontSize: '0.8rem', textAlign: 'right', color: match ? '#e50914' : '#555' }}
          >
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
