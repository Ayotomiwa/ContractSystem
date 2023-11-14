import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import {Button,InputAdornment, OutlinedInput, SvgIcon} from "@mui/material";


export const CustomersSearch = () => (

    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search Client"
      endAdornment={(
        <InputAdornment position="end">
          <Button>
              <SvgIcon
                  fontSize="large"
                  sx={{color:"rgb(99, 102, 241)"}}
              >
                  <MagnifyingGlassIcon />
              </SvgIcon>
          </Button>
        </InputAdornment>
      )}
      sx={{ maxWidth: "500px" }}
    />
);
