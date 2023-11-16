import {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider, Stack,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const ProfileDetails = () => {


  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    BusinessName: '',
  });

  useEffect(() => {




  }, []);






  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Client Profile"
        />
        <CardContent>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
              sx={{p:"16px"}}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  value={values.phoneNumber}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  onChange={handleChange}
                  required
                  value={values.BusinessName}
                />
              </Grid>
              {/*<Grid*/}
              {/*  xs={12}*/}
              {/*  md={6}*/}
              {/*>*/}
              {/*  <TextField*/}
              {/*    fullWidth*/}
              {/*    label="Select State"*/}
              {/*    name="state"*/}
              {/*    onChange={handleChange}*/}
              {/*    required*/}
              {/*    select*/}
              {/*    SelectProps={{ native: true }}*/}
              {/*    value={values.state}*/}
              {/*  >*/}
              {/*    {states.map((option) => (*/}
              {/*      <option*/}
              {/*        key={option.value}*/}
              {/*        value={option.value}*/}
              {/*      >*/}
              {/*        {option.label}*/}
              {/*      </option>*/}
              {/*    ))}*/}
              {/*  </TextField>*/}
              {/*</Grid>*/}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={3}>
            <Button variant="contained" color="error"
            sx={{ width:"75px"}}
            >
                Cancel
            </Button>
            <Button variant="contained"
                    sx={{
                      backgroundColor:"rgb(99, 102, 241)",
                      "&:hover, &:focus": {
                        backgroundColor: "rgb(99, 102, 241)"},
                      width:"75px"

            }}
            >
              Save
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </form>
  );
};
