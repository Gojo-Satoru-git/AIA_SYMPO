import { TextField, Button } from '@mui/material';

function TeamForm({ onclose, teamSize }) {
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
  return (
    <>
      <button className="absolute top-2 right-4 text-primary text-xl font-bold" onClick={onclose}>
        ✕
      </button>

      <div className="flex items-center flex-col gap-4 p-8 md:border border-primary md:shadow-stGlow rounded-md max-h-[90vh] max-w-3xl mx-auto mt-10 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="text-primary font-bold border border-primary shadow-stGlow rounded-md p-2">
          Team details
        </h1>
        <form className="flex flex-col gap-6">
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
                  required
                  fullWidth // Ensures it fills the grid cell
                  sx={inputStyle}
                />

                <TextField
                  name={`member_${index}_phone`}
                  label="Phone number"
                  required
                  fullWidth
                  sx={inputStyle}
                />

                <TextField
                  name={`member_${index}_email`}
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  sx={inputStyle}
                />
              </div>
            </div>
          ))}
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
        </form>
      </div>
    </>
  );
}

export default TeamForm;
