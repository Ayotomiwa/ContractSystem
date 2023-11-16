import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from '../../components/Layout';
import { ProfileDetails } from './ProfileDetails';

const ClientForm = () => (
  <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Client
            </Typography>
          </div>
          <div>
            <Grid
              container
            >
              <Grid
                xs={12}
                md={12}
                lg={12}
              >
                <ProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

ClientForm.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ClientForm;
