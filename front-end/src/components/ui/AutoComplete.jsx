import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

export default function Playground() {
  const defaultProps = {
    options: agendaStatus,
    getOptionLabel: (option) => option.title,
  };
  const flatProps = {
    options: agendaStatus.map((option) => option.title),
  };
  const [value, setValue] = React.useState(null);

  return (
    <Stack spacing={1} sx={{ width: 300 }}>
      
      <Autocomplete
        {...defaultProps}
        id="clear-on-escape"
        clearOnEscape
        renderInput={(params) => (
          <TextField {...params} label="Status" variant="standard" />
        )}
      />
    </Stack>
  );
}

const agendaStatus = [
  { title: 'Agendado' }
  
];
