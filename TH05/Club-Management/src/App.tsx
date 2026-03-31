import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Registrations from './pages/Registrations';
import Members from './pages/Members';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/members" element={<Members />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
