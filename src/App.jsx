import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from "./hooks/useAuth";
import WarehouseReceipts from "./components/WarehouseReceipt/WarehouseReceipts";
import Products from "./components/Product/Products";
import Reports from "./components/Report/Reports";
import Customers from "./components/Customer/Customers";
import Invoices from "./components/Invoice/Invoices";
import Adjustments from "./components/Adjustment/Adjustments";
import Contracts from "./components/Contract/Contracts";
import Users from "./components/Users/Users";
import Returneds from "./components/Returned/Returneds";
import InvoiceStatuses from "./components/InvoiceStatuses/InvoiceStatuses";
import Years from "./components/Year/Years";
import Payments from "./components/Payment/Payments";
import MonthlyReport from "./components/Report/MonthlyReport";
import AnnualReport from "./components/Report/AnnualReport";
import YearComparisonReport from "./components/Report/YearComparisonReport";
import ClientSummary from "./components/Report/ClientSummary";
import FilterProvider from "./components/contexts/FilterContext";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <FilterProvider>
                        <Routes>
                            <Route path="/" element={<Dashboard />}>
                                <Route path="/warehouseReceipts" element={<WarehouseReceipts />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/monthly-report" element={<MonthlyReport />} />
                                <Route path="/annual-report" element={<AnnualReport />} />
                                <Route path="/year-comparison-report" element={<YearComparisonReport />} />
                                <Route path="/customers" element={<Customers />} />
                                <Route path="/client-summary" element={<ClientSummary />} />
                                <Route path="/invoices" element={<Invoices />} />
                                <Route path="/invoiceStatuses" element={<InvoiceStatuses />} />
                                <Route path="/payments" element={<Payments />} />
                                <Route path="/adjustments" element={<Adjustments />} />
                                <Route path="/contracts" element={<Contracts />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/returneds" element={<Returneds />} />
                                <Route path="/years" element={<Years />} />
                            </Route>
                        </Routes>
                    </FilterProvider>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
