import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { TravelProvider } from './context/TravelContext';

import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
import Budget from './pages/Budget';
import Admin from './pages/Admin';

const { Header, Content } = Layout;

export default function App() {
  return (
    <TravelProvider>
      <Router>
        <Layout className="min-h-screen">
          <Header className="bg-emerald-700 flex items-center px-8">
            <div className="text-white text-2xl font-bold flex-1">
              TravelPlan
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              className="bg-emerald-700 border-none"
            >
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Trang chủ</Link>
              </Menu.Item>
              <Menu.Item key="itinerary" icon={<CalendarOutlined />}>
                <Link to="/itinerary">Lịch trình</Link>
              </Menu.Item>
              <Menu.Item key="budget" icon={<DollarOutlined />}>
                <Link to="/budget">Ngân sách</Link>
              </Menu.Item>
              <Menu.Item key="admin" icon={<SettingOutlined />}>
                <Link to="/admin">Quản trị</Link>
              </Menu.Item>
            </Menu>
          </Header>

          <Content>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </TravelProvider>
  );
}
