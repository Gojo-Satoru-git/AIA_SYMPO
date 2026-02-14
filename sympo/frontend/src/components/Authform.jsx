import { TextField, Button, MenuItem, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { registerUser } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { searchColleges, sendOtpApi, verifyOtpApi } from '../services/api';

import useToast from '../context/useToast';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import debounce from 'lodash/debounce';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import useCart from '../context/useCart';

import api from '../services/api';

const menuItemStyle = {
  color: '#e5e5e5',
  fontSize: '0.95rem',
  fontWeight: 500,
  padding: '12px 18px',
  borderRadius: '8px',
  margin: '4px 6px',
  '&:hover': {
    backgroundColor: 'rgba(229,9,20,0.15)',
  },
  '&.Mui-selected': {
    backgroundColor: '#e50914',
    color: 'white',
    fontWeight: 600,
  },
};

const menuPaperStyle = {
  backgroundColor: '#0b0b0b',
  borderRadius: '14px',
  border: '1px solid #2a2a2a',
  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
};

/* ================= INPUT STYLE ================= */

const inputStyle = {
  input: {
    color: 'white',
  },

  label: {
    color: '#b0b0b0',
    fontWeight: 500,
  },

  '& label.Mui-focused': {
    color: '#e50914', // 🔥 red instead of blue
  },

  '& label .MuiFormLabel-asterisk': {
    color: '#e50914', // 🔥 required *
  },

  '& .MuiOutlinedInput-root': {
    backgroundColor: '#0b0b0b',
    borderRadius: '12px',

    '& fieldset': {
      borderColor: '#444',
    },

    '&:hover fieldset': {
      borderColor: '#e50914',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#e50914',
      boxShadow: '0 0 8px rgba(229,9,20,0.6)',
    },
  },
};

/* ================= COMPONENT ================= */

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { fetchProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [backupMode, setBackupMode] = useState(false);

  const [passValid, setPassValid] = useState({
    upper: false,
    lower: false,
    num: false,
    special: false,
    length: false,
  });

  const [match, setMatch] = useState(false);

  const [collegeOptions, setCollegeOptions] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [manualInstitute, setManualInstitute] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const collegeCache = useRef({});

  const { clearCart } = useCart();

  useEffect(() => {
  // Handle Confirm Password
  if (confirmPasswordInputRef.current) {
    const input = confirmPasswordInputRef.current;
    const len = input.value.length;
    setTimeout(() => {
      input.setSelectionRange(len, len);
    }, 0);
  }
}, [showConfirmPass]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);
  useEffect(() => {
    if (passwordInputRef.current) {
      const input = passwordInputRef.current;

      // This ensures the cursor move happens AFTER the type change is complete
      const timer = setTimeout(() => {
        const len = input.value.length;
        input.setSelectionRange(len, len);
        input.focus();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [showPass]);
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

  const fetchColleges = async (search) => {
    if (!search || search.length < 3) return;

    if (collegeCache.current[search]) {
      setCollegeOptions(collegeCache.current[search]);
      return;
    }

    try {
      setCollegeLoading(true);
      const results = await searchColleges(search);
      collegeCache.current[search] = results;
      setCollegeOptions(results);
    } catch (error) {
      console.error('College search failed:', error);
    } finally {
      setCollegeLoading(false);
    }
  };

  const debouncedFetchColleges = debounce(fetchColleges, 400);

  const handleOtp = async () => {
    if (!emailValue || !canResend) return;

    setIsSendingOtp(true);

    try {
      const response = await sendOtpApi(emailValue);

      if (response.isVerified) {
        setIsEmailVerified(true);
        setShowOtp(false);
        showToast('Email verified (Found in records)', 'success');
        setBackupMode(false);
        return;
      }

      setShowOtp(true);
      setResendTimer(60);
      setBackupMode(false);
    } catch (error) {
      console.error('OTP Request Failed:', error);

      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || '';

      if (errorMessage.toLowerCase().includes('already registered')) {
        showToast(errorMessage, 'error');
      } else if (status === 424 || status === 503 || status === 429 || status >= 500) {
        setBackupMode(true);
        setShowOtp(false);
        showToast('Daily Email Limit Reached. Switched to Link Verification.', 'info');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setVerifyingOtp(true);
    try {
      await verifyOtpApi(emailValue, otp);
      setIsEmailVerified(true);
      setShowOtp(false);
      showToast('Email verified successfully!', 'success');
    } catch (e) {
      showToast(e.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      showToast('please enter your email address', 'error');
      return;
    }
    setResetLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      showToast('Password reset link sent to you email!', 'success');
      setShowReset(false);
      setResetEmail('');
    } catch (error) {
      console.error(error);
      const msg =
        error.code === 'auth/user-not-found'
          ? 'No account found with this email'
          : 'Failed to send reset link';
      showToast(msg, 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || showReset) return;

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      setLoading(true);

      if (mode === 'signup') {
        let finalInstitute;

        if (selectedCollege?.name === 'OTHER') {
          if (!manualInstitute.trim()) {
            showToast('Please enter your institute name', 'error');
            setLoading(false);
            return;
          }
          finalInstitute = manualInstitute.trim();
        } else {
          if (!selectedCollege) {
            showToast('Please select a valid institute', 'error');
            setLoading(false);
            return;
          }
          finalInstitute = selectedCollege.name;
        }

        if (!Object.values(passValid).every(Boolean)) {
          showToast('Password does not meet requirements', 'error');
          setLoading(false);
          return;
        }

        if (!match) {
          showToast('Passwords do not match', 'error');
          setLoading(false);
          return;
        }

        if (!isEmailVerified && !backupMode) {
          showToast('Please verify your email first', 'error');
          setLoading(false);
          return;
        }

        let cred;
        try {
          cred = await createUserWithEmailAndPassword(auth, emailValue, data.password);
          await updateProfile(cred.user, { displayName: data.name });
        } catch (authErr) {
          throw authErr;
        }

        try {
          const token = await cred.user.getIdToken();

          await registerUser(
            {
              uid: cred.user.uid,
              email: emailValue,
              name: data.name,
              phone: data.phone,
              institute: finalInstitute,
              year: year,
            },
            token
          );

          if (backupMode) {
            // 1. Send the Link
            await sendEmailVerification(cred.user, {
              url: `${window.location.origin}/auth-action?mode=verifyEmail`,
              handleCodeInApp: true,
            });

            // 2. FORCE LOGOUT
            await signOut(auth);

            // 3. Show Message
            showToast('Account Created! Check email to verify and login.', 'success');

            // 4. Send them to Sign In page
            navigate('/signin');
          } else {
            localStorage.setItem('authToken', token);
            if (fetchProfile) await fetchProfile();
            showToast('Account created!', 'success');
            navigate('/', { replace: true });
          }
        } catch (backendError) {
          console.error('Backend Registration Failed:', backendError);
          if (cred && cred.user) {
            await cred.user.delete().catch((delErr) => console.error('Rollback failed:', delErr));
          }
          throw new Error(
            backendError.response?.data?.message || 'Registration failed. Please try again.'
          );
        }
      }

      if (mode === 'signin') {
        const cred = await signInWithEmailAndPassword(auth, data.email, data.password);

        await cred.user.reload();
        const res = await api.post('/auth/verifyEmail', { email: data.email }).catch(() => null);
        const isBackendVerified = res?.data?.data?.isVerified;

        if (!cred.user.emailVerified && !isBackendVerified) {
          // 1. Resend Link
          await sendEmailVerification(cred.user, {
            url: `${window.location.origin}/reset-password?mode=verifyEmail`,
            handleCodeInApp: true,
          });

          // 2. Kick them out
          await signOut(auth);

          // 3. Show Error
          showToast('Email not verified. A new verification link has been sent.', 'error');
          setLoading(false);
          return;
        }

        const token = await cred.user.getIdToken();
        localStorage.setItem('authToken', token);

        if (fetchProfile) await fetchProfile();

        showToast('Login successful', 'success');
        clearCart();
        navigate('/', { replace: true });
      }
    } catch (err) {
      const msg =
        err.code === 'auth/invalid-credential'
          ? 'Invalid Credentials'
          : err.code === 'auth/too-many-requests'
            ? 'Too Many REquest Please Try Again !'
            : err.message;

      showToast(msg || 'Something went wrong', 'error');
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
        sx={{
          color: valid ? '#ffffff' : '#555',
          fontSize: '0.75rem',
          letterSpacing: '1px',
          fontFamily: 'StrangerRegular',
          transition: 'all 0.3s ease',
        }}
      >
        {text}
      </Typography>
    </Box>
  );

  if (mode === 'signin' && showReset) {
    return (
      <div className="flex flex-col gap-6">
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ color: '#aaa', textAlign: 'center', mb: 1 }}>
          Enter your email to receive a password reset link.
        </Typography>

        <TextField
          label="Enter your email"
          type="email"
          fullWidth
          sx={inputStyle}
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />

        <Button
          onClick={handlePasswordReset}
          disabled={resetLoading || !resetEmail}
          fullWidth
          sx={{
            py: 1.4,
            backgroundColor: '#e50914',
            color: 'white',
            fontWeight: 700,
            borderRadius: '999px',
            '&:hover': { backgroundColor: '#ff1a1a' },
            '&.Mui-disabled': { backgroundColor: '#555' },
          }}
        >
          {resetLoading ? 'SENDING...' : 'SEND RESET LINK'}
        </Button>

        <Button
          onClick={() => setShowReset(false)}
          sx={{ color: '#bbb', textTransform: 'none', '&:hover': { color: 'white' } }}
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* ================= SIGN UP ================= */}
      {mode === 'signup' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* FULL NAME */}
          <div className="grid grid-cols-1 sm:col-span-2">
            <TextField name="name" label="Full Name" required sx={inputStyle} />
          </div>

          {/* INSTITUTE */}
          <div className="flex flex-col gap-4 sm:col-span-2">
            <Autocomplete
              options={[
                ...collegeOptions,
                { name: 'Other (My college not listed)', isOther: true },
              ]}
              getOptionLabel={(option) => {
                if (!option) return '';
                if (option.isOther) return option.name;
                return `${option.name} (${option.state})`;
              }}
              loading={collegeLoading}
              freeSolo={false}
              onInputChange={(event, value) => {
                debouncedFetchColleges(value);
              }}
              onChange={(event, value) => {
                if (value?.isOther) {
                  setSelectedCollege({ name: 'OTHER' });
                } else {
                  setSelectedCollege(value);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Institute Name"
                  required
                  fullWidth
                  sx={inputStyle}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {collegeLoading && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {selectedCollege?.name === 'OTHER' && (
              <TextField
                label="Enter Your Institute Name"
                required
                fullWidth
                sx={inputStyle}
                value={manualInstitute}
                onChange={(e) => setManualInstitute(e.target.value)}
              />
            )}
          </div>

          {/* PHONE */}
          <TextField name="phone" label="Phone Number" type="tel" required sx={inputStyle} />

          {/* YEAR */}
          <TextField
            select
            name="year"
            label="Year of Study"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{
              ...inputStyle,
              '& .MuiSelect-select': { color: 'white' },
              '& .MuiSelect-icon': { color: '#e50914' },
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: menuPaperStyle,
                },
              },
            }}
          >
            <MenuItem value="1" sx={menuItemStyle}>
              1st Year
            </MenuItem>
            <MenuItem value="2" sx={menuItemStyle}>
              2nd Year
            </MenuItem>
            <MenuItem value="3" sx={menuItemStyle}>
              3rd Year
            </MenuItem>
            <MenuItem value="4" sx={menuItemStyle}>
              4th Year
            </MenuItem>
          </TextField>

          {/* EMAIL */}
          <div className="flex items-center gap-2 sm:col-span-2">
            <TextField
              name="email"
              label="Email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              required
              fullWidth
              InputProps={{
                readOnly: isEmailVerified,
              }}
              sx={inputStyle}
            />

            {isEmailVerified ? (
              <Button
                disabled
                sx={{
                  mb: 0.5,
                  minWidth: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  color: '#e50914 !important',
                  opacity: 1,
                  '&.Mui-disabled': {
                    color: 'white',
                  },
                }}
              >
                <CheckCircleIcon sx={{ fontSize: '1.5rem' }} />
              </Button>
            ) : backupMode ? (
              // --- BACKUP UI ---
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: 'rgba(255, 19, 7, 0.05)', // Very subtle yellow tint
                  borderLeft: '3px solid #ff3907', // Warning indicator
                  borderRadius: '4px',
                  animation: 'fadeIn 0.4s ease-in-out',
                }}
              >
                <Typography sx={{ color: '#e0e0e0', fontSize: '0.75rem', lineHeight: 1.6 }}>
                  Limit reached. Link will be sent (check{' '}
                  <Box component="span" sx={{ color: '#e50914', fontWeight: 800 }}>
                    spam
                  </Box>
                  ).
                </Typography>

                <Typography
                  sx={{
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box component="span" sx={{ color: '#e50914', fontSize: '1rem' }}>
                    ➔
                  </Box>
                  Set your password below first.
                </Typography>
              </Box>
            ) : (
              <Button
                type="button"
                onClick={handleOtp}
                disabled={!isEmailValid || !canResend || isSendingOtp}
                sx={{
                  mt: 0,
                  py: 1.5,
                  px: 1,
                  fontSize: '0.75rem',
                  backgroundColor: '#e50914',
                  color: 'white',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  borderRadius: '999px',
                  boxShadow: `0 0 20px #e50914`,
                  whiteSpace: 'nowrap',
                  '&.Mui-disabled': {
                    backgroundColor: '#555',
                    color: '#aaa',
                  },
                  '&:hover': {
                    backgroundColor: '#ff1a1a',
                    boxShadow: `0 0 30px #e50914`,
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              >
                {isSendingOtp
                  ? 'Sending...'
                  : !showOtp
                    ? 'Verify email'
                    : canResend
                      ? 'Resend'
                      : `Resend in ${resendTimer}s`}
              </Button>
            )}
          </div>
          {showOtp && !isEmailVerified && !backupMode && (
            <div className="flex items-center gap-3 sm:col-span-2">
              <TextField
                name="otp"
                label="Enter OTP"
                required
                fullWidth
                sx={{ ...inputStyle, minWidth: 0 }}
                autoFocus
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />
              <Typography
                sx={{
                  color: backupMode ? '#ffc107' : '#aaa',
                  fontSize: '0.72rem',
                  px: 1,
                  mt: 0.5,
                  fontStyle: 'italic',
                  animation: 'fadeIn 0.5s ease-in-out',
                }}
              >
                {backupMode ? (
                  <>
                    Limit reached. Link will be sent (check{' '}
                    <Box component="span" sx={{ color: '#e50914', fontWeight: 800 }}>
                      spam
                    </Box>
                    ).
                    <Box
                      component="span"
                      sx={{ color: 'white', display: 'block', fontWeight: 600 }}
                    >
                      ➔ Set your password below first.
                    </Box>
                  </>
                ) : (
                  <>
                    📩 OTP sent! Check your inbox/{' '}
                    <Box component="span" sx={{ color: '#e50914', fontWeight: 800 }}>
                      spam
                    </Box>
                    .
                  </>
                )}
              </Typography>
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || verifyingOtp}
                sx={{
                  mt: 0,
                  py: 1.5,
                  px: 1,
                  fontSize: '0.75rem',
                  backgroundColor: '#e50914',
                  color: 'white',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  borderRadius: '999px',
                  boxShadow: `0 0 20px #e50914`,
                  whiteSpace: 'nowrap',
                  '&.Mui-disabled': {
                    backgroundColor: '#555',
                    color: '#aaa',
                  },
                  '&:hover': {
                    backgroundColor: '#ff1a1a',
                    boxShadow: `0 0 30px #e50914`,
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              >
                {verifyingOtp ? 'Checking...' : 'Verify OTP'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ================= SIGN IN ================= */}
      {mode === 'signin' && (
        <TextField name="email" label="Email" type="email" required sx={inputStyle} />
      )}

      {/* PASSWORD */}
      <TextField
        name="password"
        label="Password"
        type={showPass ? 'text' : 'password'}
        required
        inputProps={{ ref: passwordInputRef }}
        sx={inputStyle}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPass(!showPass)}
                onMouseDown={(e) => e.preventDefault()} // Keeps focus on the input
                edge="end"
                sx={{
                  color: '#e50914', // Matches your "Stranger Things" red theme
                  '&:hover': { color: '#ff1a1a' },
                }}
              >
                {showPass ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* FORGOT PASSWORD LINK (NEW) */}
      {mode === 'signin' && (
        <div className="-mt-4 flex justify-end">
          <Button
            onClick={() => setShowReset(true)}
            sx={{
              textTransform: 'none',
              color: '#aaa',
              fontSize: '0.85rem',
              '&:hover': { color: '#e50914', backgroundColor: 'transparent' },
            }}
          >
            Forgot Password?
          </Button>
        </div>
      )}

      {/* PASSWORD STRENGTH INDICATOR (Only on Signup) */}
      {mode === 'signup' && (passwordFocused || password.length > 0) && (
        <Box
          sx={{
            p: 2,
            bgcolor: 'rgba(229,9,20,0.05)',
            borderRadius: '14px',
            border: `1px solid rgba(229,9,20,0.4)`,
            backdropFilter: 'blur(6px)',
            boxShadow: `
            0 0 20px rgba(229,9,20,0.35),
            inset 0 0 25px rgba(229,9,20,0.2)
          `,
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <ValidationItem valid={passValid.length} text="Min 8 Characters" />
            <ValidationItem valid={passValid.upper} text="1 Uppercase (A-Z)" />
            <ValidationItem valid={passValid.lower} text="1 Lowercase (a-z)" />
            <ValidationItem valid={passValid.num} text="1 Number (0-9)" />
            <ValidationItem valid={passValid.special} text="1 Special (!@#...)" />
          </div>
        </Box>
      )}

      {/* CONFIRM PASSWORD */}
      {mode === 'signup' && (
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPass ? 'text' : 'password'}
          required
          inputProps={{ ref: confirmPasswordInputRef }}
          sx={inputStyle}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={confirmPassword.length > 0 && !match}
          helperText={confirmPassword.length > 0 && !match ? 'Passwords do not match' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  edge="end"
                  sx={{ color: '#e50914' }}
                >
                  {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}

      {/* ================= SUBMIT ================= */}
      <Button
        type="submit"
        fullWidth
        disabled={
          loading ||
          (mode === 'signup' &&
            (!match ||
              !Object.values(passValid).every(Boolean) ||
              (!isEmailVerified && !backupMode)))
        }
        sx={{
          mt: 2,
          py: 1.4,
          backgroundColor: '#e50914',
          color: 'white',
          fontWeight: 700,
          letterSpacing: '0.2em',
          borderRadius: '999px',
          boxShadow: `0 0 20px #e50914`,
          '&.Mui-disabled': {
            backgroundColor: '#555',
            color: '#aaa',
          },
          '&:hover': {
            backgroundColor: '#ff1a1a',
            boxShadow: `0 0 30px #e50914`,
            transform: 'scale(1.03)',
          },
          transition: 'all 0.25s ease',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            PROCESSING...
          </span>
        ) : mode === 'signin' ? (
          'SIGN IN'
        ) : (
          'CREATE ACCOUNT'
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
