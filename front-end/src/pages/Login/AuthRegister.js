import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';

import {
    Box,
    Button,
    Card,
    Checkbox, Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel, Link,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import AnimateButton from "../../components/AnimateButton";
import axios from "axios";
import UserContext from "../../hooks/UserProvider";
import "../pages.css"
import {useNavigate} from "react-router-dom";



const AuthRegister = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isBusiness, setIsBusiness] = useState(false);
    const {login} = useContext(UserContext);
    const Navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {

    };

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <div style={{display: "grid", placeItems: "center", minHeight: "100vh", padding:"20px"}}>
            {/*<Card sx={{maxWidth: "500px", raised: true,*/}
            {/*    backgroundColor: "#f8f8f8",*/}
            {/*    backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)",*/}
            {/*    backgroundSize: "100% 28px",*/}
            {/*    // backgroundImage: "linear-gradient(to bottom right, #fff9e6, #fff2cc, #ffe6b3)"*/}
            {/*}}>*/}
                <Card className="form-container" sx={{maxWidth: "500px", raised: true,
                }}>

                <Formik
                    initialValues={{
                        firstname: '',
                        lastname: '',
                        email: '',
                        phoneNumber: '',
                        business: {
                            companyName: null,
                            industry: null,
                            address: null,
                            phoneNumber: null
                        },
                        password: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        firstname: Yup.string().max(255).required('First Name is required'),
                        lastname: Yup.string().max(255).required('Last Name is required'),
                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                        password: Yup.string().max(255).required('Password is required'),
                      phoneNumber: Yup.string().required('Phone Number is required'),
                        business: isBusiness ? Yup.object().shape({
                            companyName:  Yup.string().required('Business Name is required'),
                            industry: Yup.string().required('Industry is required'),
                            address: Yup.string().required('Address is required'),
                            // phoneNumber: Yup.string().required('Phone Number is required'),
                        }) : Yup.object().nullable(),
                    })}
                    onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                        try {
                            console.log("Signing UP")
                            const signUpResponse = await axios({
                                "method": 'POST',
                                "url": 'http://localhost:8080/api/users/sign-up',
                                "data": values
                            });

                            const logInResponse = await axios({
                                "method": 'POST',
                                "url": 'http://localhost:8080/api/authenticate',
                                "data": {
                                    username: values.email,
                                    password: values.password
                                }
                            });
                            login(logInResponse.data)
                            console.log("Signing UP")
                            setStatus({success: true})
                            console.log("Status is successful")
                            Navigate('/user', { replace: true })
                        } catch (err) {
                            console.error(err);
                            if (err.response) {
                                setErrors({submit: err.response.data.message});
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
                    {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                        <form noValidate onSubmit={handleSubmit} style={{padding: "16px"}}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: "50px"}}>
                                <Typography variant="h4" sx={{fontWeight: "bold"}}>
                                    Sign Up Form
                                </Typography>
                                <Button type="link"
                                        component={RouterLink}
                                        to={`/login`}
                                        sx={{color:"rgb(99, 102, 241)"}}
                                > Have an Account? Log in</Button>
                            </Stack>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                                        <OutlinedInput
                                            id="firstname-login"
                                            type="firstname"
                                            value={values.firstname}
                                            name="firstname"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="John"
                                            fullWidth
                                            error={Boolean(touched.firstname && errors.firstname)}
                                        />
                                        {touched.firstname && errors.firstname && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.firstname}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.lastname && errors.lastname)}
                                            id="lastname-signup"
                                            type="lastname"
                                            value={values.lastname}
                                            name="lastname"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            inputProps={{}}
                                        />
                                        {touched.lastname && errors.lastname && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.lastname}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                              <Grid item xs={12}>
                                <Stack spacing={1}>
                                  <InputLabel htmlFor="phone-signup">Phone Number*</InputLabel>
                                  <OutlinedInput
                                      id="phone-signup"
                                      type="tel"
                                      value={values.phoneNumber}
                                      name="phoneNumber"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      placeholder="07123455567"
                                      fullWidth
                                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                  />
                                  {touched.phoneNumber && errors.phoneNumber && (
                                      <FormHelperText error id="helper-text-phone-signup">
                                        {errors.phoneNumber}
                                      </FormHelperText>
                                  )}
                                </Stack>
                              </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                            id="email-login"
                                            type="email"
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="demo@email.com"
                                            inputProps={{}}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="password-signup">Password</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            id="password-signup"
                                            type={showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            name="password"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                handleChange(e);
                                                changePassword(e.target.value);
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                    >
                                                        {showPassword ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="******"
                                            inputProps={{}}
                                        />
                                        {touched.password && errors.password && (
                                            <FormHelperText error id="helper-text-password-signup">
                                                {errors.password}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item>
                                    <FormControlLabel
                                        control={<Checkbox color="success"
                                                           onChange={() => setIsBusiness(!isBusiness)}
                                                           sx={{color: "primary"}}/>}
                                        label="Are you a business?"
                                    />
                                </Grid>
                                {isBusiness && (
                                    <>
                                      <Grid item xs={12}>
                                        <Divider>
                                          <Typography variant="Business Form">Business Form</Typography>
                                        </Divider>
                                      </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="companyName-signup">Company Name*</InputLabel>
                                                <OutlinedInput
                                                    id="companyName-signup"
                                                    type="text"
                                                    value={values.business.companyName}
                                                    name="business.companyName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="XYZ Corp"
                                                    fullWidth
                                                    error={Boolean(touched.business?.companyName && errors.business?.companyName)}
                                                />
                                                {touched.business?.companyName && errors.business?.companyName && (
                                                    <FormHelperText error id="helper-text-companyName-signup">
                                                        {errors.business.companyName}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="industry-signup">Industry*</InputLabel>
                                                <OutlinedInput
                                                    id="industry-signup"
                                                    type="text"
                                                    value={values.business.industry}
                                                    name="business.industry"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder="Food & Beverages"
                                                    fullWidth
                                                    error={Boolean(touched.business?.industry && errors.business?.industry)}
                                                />
                                                {touched.business?.industry && errors.business?.industry && (
                                                    <FormHelperText error id="helper-text-industry-signup">
                                                        {errors.business.industry}
                                                    </FormHelperText>
                                                )}
                                            </Stack>
                                        </Grid>

                                      <Grid item xs={12}>
                                        <Stack spacing={1}>
                                          <InputLabel htmlFor="address-signup">Company Address*</InputLabel>
                                          <OutlinedInput
                                              id="address-signup"
                                              type="text"
                                              value={values.business.address}
                                              name="business.address"
                                              onBlur={handleBlur}
                                              onChange={handleChange}
                                              placeholder="123 Market Street, London, WC27 8YH"
                                              fullWidth
                                              error={Boolean(touched.business?.address && errors.business?.address)}
                                          />
                                            {touched.business?.address && errors.business?.address && (
                                                <FormHelperText error id="helper-text-address-signup">
                                                    {errors.business.address}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                      </Grid>
                                    </>
                                )}


                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        {/*{isBusiness ?*/}
                                        {/*    (<Button*/}
                                        {/*            component={RouterLink} // Use RouterLink as the component for the Button*/}
                                        {/*            to={`/auth/business-form`}*/}
                                        {/*            disableElevation*/}
                                        {/*            disabled={isSubmitting}*/}
                                        {/*            fullWidth*/}
                                        {/*            size="large"*/}
                                        {/*            type="submit"*/}
                                        {/*            variant="contained"*/}
                                        {/*            color="primary"*/}
                                        {/*        >*/}
                                        {/*            Next: Business Form*/}
                                        {/*        </Button>*/}
                                        {/*    ) : (*/}
                                                <Button
                                                    disableElevation
                                                    disabled={isSubmitting}
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{backgroundColor:"rgb(99, 102, 241)", borderRadius:"10px"}}
                                                >
                                                    Create Account
                                                </Button>
                                            {/*)}*/}
                                    </AnimateButton>
                                </Grid>
                                <Grid item xs={12}>

                                </Grid>
                                <Grid item xs={12}>
                                    {/*<FirebaseSocial />*/}
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default AuthRegister;
