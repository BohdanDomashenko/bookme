import { createTheme, MantineProvider } from '@mantine/core';
import { Home } from './pages/Home/Home';
import type { FC } from 'react';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({});

const App: FC = () => {
  return (
    <div>
      <MantineProvider theme={theme}>
        <Home />
      </MantineProvider>
    </div>
  );
};

export default App;
