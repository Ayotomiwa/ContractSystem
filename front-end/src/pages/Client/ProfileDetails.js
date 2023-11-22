import {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider, IconButton, Slide, Snackbar, Stack, SvgIcon,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import {useLocation} from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import axios from "axios";
import {useNavigate} from "react-router-dom";


const ProfileDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const businessId = queryParams.get('businessId');
  const clientId = queryParams.get('clientId');
  const [saved, setSaved] = useState(false);
  // const [clientId, setClientId] = useState(null);



  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
  });

  useEffect( () => {
    if(clientId){
      fetchClient().then(r => console.log("Client fetched"));
    }
  }, []);


  const fetchClient = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:8080/api/business/${clientId}`,
    }).then((response) => {
      if(response.status === 200){
        setValues({
          firstName: response.data.userRecipient.firstName? response.data.userRecipient.firstName : "",
          lastName: response.data.userRecipient.lastName? response.data.userRecipient.lastName : "",
          email: response.data.userRecipient.email,
          phoneNumber: response.data.userRecipient.phoneNumber? response.data.userRecipient.phoneNumber : "",
          businessName: response.data.userRecipient.business?.companyName? response.data.userRecipient.business.companyName : "",
        });
      }
    }).
    catch((error) => {
      console.log(error);
    });
  }

  const handleSubmit = async ()=>{
    console.log(values);
    await axios({
      method: "POST",
      url: `http://localhost:8080/api/business/${businessId}/clients`,
      data: {
        id: clientId,
        userRecipient: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          business: {
            companyName: values.businessName
          },
        },
        businessUser: {
          id: businessId
        }
      }
    }).then((response) => {
      if(response.status === 200){
        setSaved(true);
      }
    }).
    catch((error) => {
        console.log(error);
    });
  };


  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  // const handleSubmit = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //   },
  //   []
  // );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title={(clientId && values.firstName)? values.firstName +"'s Client Profile" : "New Client Profile"}
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
                  name="phoneNumber"
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
                  value={values.businessName}
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
                    sx={{fontSize:"1rem", width:"120px"}}
                startIcon={
                  <SvgIcon style={{ fontSize: 30}}>
                  <CancelSharpIcon color="white"/>
                   </SvgIcon>
                }
                onClick={() => {
                  window.location.href = '/clients';
                }}
            >
              Cancel
            </Button>

            <Button variant="contained"
                    sx={{backgroundColor:"rgb(99, 102, 241)", fontSize:"1rem",
                      "&:hover, &:focus, &:active": {
                        backgroundColor: "rgb(99, 102, 241)"
                      }
            }}
                startIcon={(
                    <SvgIcon style={{ fontSize: 30}}>
                      <SaveIcon color="white"></SaveIcon>
                    </SvgIcon>
                )}
                    onClick={handleSubmit}
            >
              SAVE
            </Button>
          </Stack>
        </CardActions>
        <Slide direction="left">
        <Snackbar
            open={saved}
            message="Client Saved"
        />
        </Slide>
      </Card>
    </form>
  );
};
export default ProfileDetails;