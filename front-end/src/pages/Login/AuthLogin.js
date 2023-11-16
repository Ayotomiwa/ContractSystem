import React, {useContext, useState} from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Button,
  FormHelperText,
  Grid,
  Link,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography, Card
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import AnimateButton from "../../components/AnimateButton";
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import {useNavigate} from "react-router-dom";



const AuthLogin = () => {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login} = useContext(UserContext);



  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
      <div style={{display: "grid", placeItems: "center", minHeight: "100vh", padding:"20px"}}>
        {/*<Card sx={{maxWidth: "400px",*/}
        {/*  backgroundImage: "linear-gradient(to bottom right, #fff, #f5f5f5, #d5d5d5)}}"}}>*/}
          <Card className="form-container" sx={{maxWidth: "400px", raised: true,
          }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
          try {
            console.log("Signing IN")

            const logInResponse = await axios({
              "method": 'POST',
              "url": 'http://localhost:8080/api/authenticate',
              "data": {
                username: values.email,
                password: values.password
              }
            });
            const path= '/user'
            login(logInResponse.data, path)
            console.log("Signing IN")
            setStatus({success: true})
            console.log("Status is successful")

            // navigate('/user', { replace: true })
          } catch (err) {
            console.error(err);
            if (err.response) {
              setErrors({submit: err.response.data});
            } else if (err.response) {
              setErrors({submit: err.message});
            } else if (err.request) {
              console.error(err.request);
              setErrors({submit: "No response from server"})
            }
            setStatus({success: false});
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} style={{padding: "16px"}}>
            <Grid>
              <Typography variant="h4" sx={{
                mb: "50px", backgroundImage:"", textAlign: "center", fontWeight: "bold",
                // color:"RGB(176, 196, 222, 1)"
              }}>
                Log-in
              </Typography>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    // endAdornment={
                    //   <InputAdornment position="end"  sx={{color: "RGB(176, 196, 222, 0.4)"}}>
                    //     <IconButton
                    //       aria-label="toggle password visibility"
                    //       onClick={handleClickShowPassword}
                    //       onMouseDown={handleMouseDownPassword}
                    //       edge="end"
                    //       size="large"
                    //       sx={{backgroundColor: "RGB(176, 196, 222, 0.4)"}}
                    //     >
                    //
                    //       {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    //     </IconButton>
                    //   </InputAdornment>
                    // }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={10}>
                  {/*<FormControlLabel*/}
                  {/*  control={*/}
                  {/*    <Checkbox*/}
                  {/*      checked={checked}*/}
                  {/*      onChange={(event) => setChecked(event.target.checked)}*/}
                  {/*      name="checked"*/}
                  {/*      color="primary"*/}
                  {/*      size="small"*/}
                  {/*    />*/}
                  {/*  }*/}
                  {/*  label={<Typography variant="h6">Keep me sign in</Typography>}*/}
                  {/*/>*/}
                  <Link variant="string" component={RouterLink} to="" color="rgb(99, 102, 241)">
                    Forgot Password?
                  </Link>
                  <Link variant="string" component={RouterLink}
                        to="/register"
                        color="rgb(99, 102, 241)"
                        sx={{textAlign:"right"}}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" sx={{backgroundColor:"rgb(99, 102, 241)"}}>
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
        </Card>
        </div>
  );
};

export default AuthLogin;