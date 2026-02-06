import { TextField, Button, MenuItem } from '@mui/material';
import useToast from '../context/useToast';
import { useEffect, useState } from 'react';

function TeamForm({ title, onclose, teamSize, mini, setShowAdd, isDisabledAll }) {
  const { showToast } = useToast();

  const [savedData, setSavedData] = useState({});
  const [domain, setDomain] = useState('');

  const menuPaperStyle = {
    backgroundColor: '#0b0b0b',
    borderRadius: '14px',
    border: '1px solid #2a2a2a',
    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
  };
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

  useEffect(() => {
    const data = localStorage.getItem(`${title}-teamData`);
    if (data) {
      setSavedData(JSON.parse(data));
    }
  }, [title]);

  const validateTeamForm = (formData, teamSize, mini) => {
    const emails = new Set();
    const phones = new Set();

    for (let i = 0; i < teamSize; i++) {
      const name = formData[`member_${i}_name`];
      const email = formData[`member_${i}_email`];
      const phone = formData[`member_${i}_phone`];

      if (i < mini) {
        if (!name || !email || !phone) {
          return `All fields are required for member ${i + 1}`;
        }
      }

      if (!email && !phone) continue;

      if (emails.has(email)) {
        return `Duplicate email found: ${email}`;
      }

      if (phones.has(phone)) {
        return `Duplicate phone number found: ${phone}`;
      }

      emails.add(email);
      phones.add(phone);
    }

    return null;
  };

  const inputStyle = {
    label: {
      color: '#b0b0b0',
      fontWeight: 500,
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },

    '& label.Mui-focused': {
      color: '#e50914',
    },

    '& label .MuiFormLabel-asterisk': {
      color: '#e50914',
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
  return (
    <>
      <button className="absolute top-2 right-4 text-primary text-xl font-bold" onClick={onclose}>
        ✕
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = Object.fromEntries(new FormData(e.target));

          const validationError = validateTeamForm(formData, teamSize, mini);
          if (validationError) {
            showToast(validationError, 'error');
            return;
          }

          localStorage.setItem(`${title}-teamData`, JSON.stringify(formData));

          showToast('Team details submitted successfully!', 'success');
          setShowAdd(false);
        }}
        className="flex items-center flex-col gap-4 p-8 md:border border-primary md:shadow-stGlow rounded-md max-h-[90vh] max-w-3xl mx-auto mt-10 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {title === 'Hackathon' && (
          <>
            <h1 className="text-primary font-bold border border-primary shadow-stGlow rounded-md p-2">
              Problem domain
            </h1>
            <TextField
              select
              name="Domain"
              label="Problem domain"
              fullWidth
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
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
                Generative AI
              </MenuItem>
              <MenuItem value="2" sx={menuItemStyle}>
                Healthcare Technology
              </MenuItem>
              <MenuItem value="3" sx={menuItemStyle}>
                FinTech
              </MenuItem>
              <MenuItem value="4" sx={menuItemStyle}>
                Agriculture
              </MenuItem>
              <MenuItem value="5" sx={menuItemStyle}>
                Logistics
              </MenuItem>
            </TextField>
            <h1 className="text-primary font-bold border border-primary shadow-stGlow rounded-md p-2">
              Problem statement
            </h1>
            <TextField
              name="problem_statement"
              label="Explain your problem"
              multiline
              type="text"
              rows={4}
              required
              fullWidth
              sx={inputStyle}
              defaultValue={savedData.problem_statement || ''}
              InputProps={{
                readOnly: isDisabledAll,
              }}
            />
          </>
        )}

        <h1 className="text-primary font-bold border border-primary shadow-stGlow rounded-md p-2">
          Team details
        </h1>
        <div className="flex flex-col gap-6">
          {Array.from({ length: teamSize }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 pb-6 border-b border-gray-800 last:border-0 last:pb-0"
            >
              <h2 className="text-primary">Team member {index + 1}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  name={`member_${index}_name`}
                  label="Name"
                  type="text"
                  required={index < mini}
                  fullWidth
                  sx={inputStyle}
                  defaultValue={savedData[`member_${index}_name`] || ''}
                  InputProps={{
                    readOnly: isDisabledAll,
                  }}
                />

                <TextField
                  name={`member_${index}_phone`}
                  label="Phone number"
                  required={index < mini}
                  fullWidth
                  sx={inputStyle}
                  defaultValue={savedData[`member_${index}_phone`] || ''}
                  InputProps={{
                    readOnly: isDisabledAll,
                  }}
                />

                <TextField
                  name={`member_${index}_email`}
                  label="Email"
                  type="email"
                  required={index < mini}
                  fullWidth
                  sx={inputStyle}
                  defaultValue={savedData[`member_${index}_email`] || ''}
                  InputProps={{
                    readOnly: isDisabledAll,
                  }}
                />
              </div>
            </div>
          ))}
          {isDisabledAll ? null : (
            <Button
              type="submit"
              name="Submit"
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
              Submit
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

export default TeamForm;
