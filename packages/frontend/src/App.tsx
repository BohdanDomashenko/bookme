import { createTheme, MantineProvider } from '@mantine/core';
import { Anchor, Container, Group } from '@mantine/core';
import { Home } from './pages/Home/Home';
import type { FC } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ROUTES } from './common/constants/route.constants';
import { SignInPage, SignUpPage } from './pages/Auth';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({});

const App: FC = () => {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Container size='xl' py='md'>
          <Group gap='md'>
            <Anchor component={Link} to={ROUTES.HOME}>
              Home
            </Anchor>
            <Anchor component={Link} to={ROUTES.AUTH_SIGN_IN}>
              Sign In
            </Anchor>
            <Anchor component={Link} to={ROUTES.AUTH_SIGN_UP}>
              Sign Up
            </Anchor>
          </Group>
        </Container>

        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.AUTH_SIGN_IN} element={<SignInPage />} />
          <Route path={ROUTES.AUTH_SIGN_UP} element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
