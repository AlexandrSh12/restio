import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import SuccessPage from './pages/SuccessPage';
import {OrderProvider} from "./context/OrderContext.jsx";

function App() {
    return (
        <OrderProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MenuPage />} />
                    <Route path="/confirm" element={<ConfirmOrderPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                </Routes>
            </Router>
        </OrderProvider>
    );
}
export default App;

