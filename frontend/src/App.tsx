import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Promotions } from './pages/Promotions';
import { Reports } from './pages/Reports';
import { POS } from './pages/POS';
import { Ventas } from './pages/Ventas';
import { Settings } from './pages/Settings';
import { Clientes } from './pages/Clientes';
import { IA } from './pages/IA';
import { CierreCaja } from './pages/CierreCaja';
import { Compras } from './pages/Compras';
import { CuentasPorCobrar } from './pages/CuentasPorCobrar';
import { Gastos } from './pages/Gastos';
import { Devoluciones } from './pages/Devoluciones';

function LoginRedirect() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <Login />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    if (user?.rol !== 'ADMIN') return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pos" element={<POS />} />
                <Route path="products" element={<Products />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="reports" element={<AdminRoute><Reports /></AdminRoute>} />
                <Route path="ventas" element={<Ventas />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="cierre-caja" element={<CierreCaja />} />
                <Route path="compras" element={<AdminRoute><Compras /></AdminRoute>} />
                <Route path="cuentas-cobrar" element={<CuentasPorCobrar />} />
                <Route path="gastos" element={<AdminRoute><Gastos /></AdminRoute>} />
                <Route path="devoluciones" element={<Devoluciones />} />
                <Route path="settings" element={<Settings />} />
                <Route path="ia" element={<IA />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
