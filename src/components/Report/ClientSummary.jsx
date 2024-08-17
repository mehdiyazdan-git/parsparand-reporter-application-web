import React, {useCallback, useEffect, useState} from 'react';


import styled from 'styled-components';
import PaymentsModal from "../Payment/paymentsModal";
import AdjustmentsModal from "../Adjustment/AdjustmentsModal";
import InvoicesModal from "../Invoice/InvoicesModal";
import WarehouseReceiptsModal from "../WarehouseReceipt/WarehouseReceiptsModal";
import useHttp from "../contexts/useHttp";
import AsyncSelectSearch from "../table/AsyncSelectSearch";
import TotalsSummary from "./TotalsSummary";


const Container = styled.div`
    font-family: IRANSans, sans-serif;
    font-size: 0.75rem;
    width: 100%;
    height: calc(100vh - 100px);
    background-color: rgba(120, 120, 120, 0.2);
    padding: 2rem;
    margin-top: 1rem;
`;

const Header = styled.th`
    background-color: rgba(220, 240, 240, 0.2);
    font-size: 0.75rem;
    font-weight: bold;
    color: #333;
    text-align: center;
    padding: 0.5rem;
    border: 1px #95a3b3 solid;
    width: 14.30%; /* Adjust the width to ensure alignment */
`;

const Row = styled.td`
    font-size: 0.75rem;
    color: #333;
    text-align: center;
    padding: 0.5rem;
    border: 1px #95a3b3 solid;
    font-family: IRANSans, sans-serif;
    width: 14.30%; /* Adjust the width to ensure alignment */
    background-color: rgba(240, 240, 240, 0.9);
`;

const Footer = styled.td`
    background-color: rgba(220, 220, 220, 0.3);
    font-size: 0.75rem;
    color: #333;
    text-align: center;
    padding: 0.5rem;
    border: 1px #95a3b3 solid;
    font-family: IRANSans, sans-serif;
    font-weight: bold;
    width: 14.30%; /* Adjust the width to ensure alignment */
`;

const TableContainer = styled.div`
    border: 1px #989898 solid;
    margin-top: 1rem;
`;

const Table = styled.table`
    border: 1px #989898 solid;
    border-collapse: collapse;
    text-align: center;
    width: 100%;
`;

const Thead = styled.thead`
    background-color: rgba(220, 240, 240, 0.2);
`;

const Tbody = styled.tbody`
    background-color: rgba(240, 240, 240, 0.9);
`;

const Tfoot = styled.tfoot`
    background-color: rgba(225, 225, 240, 0.3);
    border: 1px #989898 solid;
`;

function toPersianFormat(number) {
    if (isNaN(parseFloat(number)) || number == null || number === 'undefined') {
        number = 0;
    }
    const isNegative = number < 0;
    const absoluteValue = Math.abs(number);
    const formattedValue = new Intl.NumberFormat('fa-IR').format(absoluteValue);
    return isNegative ? `(${formattedValue})` : formattedValue;
}

const date = new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(new Date());

const defaultData = {
    clientSummaryList: [
        {
            contractNumber: '',
            advancedPayment: '',
            performanceBound: '',
            insuranceDeposit: '',
            salesAmount: '',
            salesQuantity: '',
            vat: ''
        }
    ],
    notInvoicedReportDto: {
        amount: '',
        vat: '',
        insurance: '',
        performance: ''
    },
    returnedByCustomerId: '',
    adjustmentReportDto: {
        amount: '',
        vat: '',
        insurance: '',
        performance: ''
    },
    totalPaymentByCustomerId: {
        productPayment: '',
        insuranceDepositPayment: '',
        performanceBoundPayment: '',
        advancedPayment: ''
    },
    remainingInsuranceDeposit: '',
    remainingPerformanceBound: '',
}

const ClientSummary = () => {
    const { getAll } = useHttp();

    // --- State ---
    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState(() => {
        const storedFilters = JSON.parse(sessionStorage.getItem("clientSummary"));
        return storedFilters ?? { customerId: null };
    });
    const [data, setData] = useState(defaultData);
    const [showModal, setShowModal] = useState(false);

    // --- Helper Functions ---
    const handleFilterChange = useCallback((newFilter) => {
        setFilter((prevFilter) => {
            const updatedFilter = { ...prevFilter, ...newFilter };
            sessionStorage.setItem("clientSummary", JSON.stringify(updatedFilter));
            return updatedFilter;
        });
    }, []);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const fetchCustomers = async () => {
        const customerData = await getAll('customers/select', {});
        const customerOptions = customerData.data.map(item => ({ label: item.name, value: item.id }));
        setCustomers(customerOptions);

        if (!filter.customerId && customerOptions.length > 0) {
            handleFilterChange({ customerId: customerOptions[0].value });
        }
    };

    const fetchData = async () => {
        if (!filter.customerId) return;

        getAll("customers/summary", { customerId: filter.customerId })
            .then(res => setData(res.data))
            .catch(err => console.log(err))
    };

    // --- Effects ---
    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filter]);

    // --- Derived Data ---
    const totals = TotalsSummary({ data });
    const selectedCustomerLabel = customers.find(c => c?.value === filter?.customerId)?.label || '----';

    // --- JSX ---
    if (!data) return <div>Loading...</div>;

    return (
        <Container>
            <div className="row mt-3">
                <AsyncSelectSearch
                    url="customers/select?"
                    value={filter.customerId}
                    onChange={value => handleFilterChange({ customerId: value })}
                />
            </div>

            <div className="row mt-5">
                <span>
                    <strong>{`خلاصه وضعیت مشتری : ${selectedCustomerLabel} در تاریخ : ${date}`}</strong>
                </span>
            </div>
            <TableContainer>
                <Table>
                    <Thead>
                        <tr>
                            <Header>{"شماره قرارداد"}</Header>
                            <Header>{"تعداد"}</Header>
                            <Header>{"فروش (ریال)"}</Header>
                            <Header>{"ارزش افزوده (ریال)"}</Header>
                            <Header>{"فروش خالص (ریال)"}</Header>
                            <Header>{"پیش دریافت (ریال)"}</Header>
                            <Header>{"حسن انجام کار (ریال)"}</Header>
                            <Header>{"سپرده بیمه (ریال)"}</Header>
                            <Header>{"فروش + 9% (ریال)"}</Header>
                            <Header></Header>
                        </tr>
                    </Thead>
                    <Tbody>
                        {data.clientSummaryList.map((item, index) => (
                            <tr key={index}>
                                <Row>{item.contractNumber}</Row>
                                <Row>{toPersianFormat(item.salesQuantity)}</Row>
                                <Row>{toPersianFormat(item.salesAmount)}</Row>
                                <Row>{toPersianFormat(item.vat)}</Row>
                                <Row>{toPersianFormat(item.salesAmount + item.vat - item.advancedPayment - item.performanceBound - item.insuranceDeposit)}</Row>
                                <Row>{toPersianFormat(item.advancedPayment)}</Row>
                                <Row>{toPersianFormat(item.performanceBound)}</Row>
                                <Row>{toPersianFormat(item.insuranceDeposit)}</Row>
                                <Row>{toPersianFormat(item.salesAmount + item.vat)}</Row>
                                <Row>
                                    <InvoicesModal
                                        contractNumber={item.contractNumber}
                                        showModal={showModal}
                                        handleShow={handleShow}
                                        handleClose={handleClose}
                                    />
                                </Row>
                            </tr>
                        ))}
                        <tr>
                            <Row colSpan={1}>{"فاکتور نشده"}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.quantity)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.amount)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.vat)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.amount + data.notInvoicedReportDto.vat - data.notInvoicedReportDto.performance - data.notInvoicedReportDto.insurance)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.advancedPayment)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.performance)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.insurance)}</Row>
                            <Row>{toPersianFormat(data.notInvoicedReportDto.amount + data.notInvoicedReportDto.vat)}</Row>
                            <Row>
                                <WarehouseReceiptsModal
                                    customerId={filter.customerId}
                                    showModal={showModal}
                                    handleShow={handleShow}
                                    handleClose={handleClose}
                                />
                            </Row>
                        </tr>
                        <tr>
                            <Row colSpan={2}>{"تعدیل"}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.amount)}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.vat)}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.amount + data.adjustmentReportDto.vat - data.adjustmentReportDto.performance - data.adjustmentReportDto.insurance)}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.advancedPayment)}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.performance)}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.insurance)}</Row>
                            <Row>{toPersianFormat(data.adjustmentReportDto.amount + data.adjustmentReportDto.vat)}</Row>
                            <Row>
                                <AdjustmentsModal
                                    customerId={filter.customerId}
                                    showModal={showModal}
                                    handleShow={handleShow}
                                    handleClose={handleClose}
                                />
                            </Row>
                        </tr>
                    </Tbody>
                    <Tfoot>
                        <tr className="table-footer">
                            <Footer><strong>{"جمع کل : "}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalSalesQuantity)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalSalesAmount)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.subtotals.vat + data.notInvoicedReportDto.vat + data.adjustmentReportDto.vat)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.subtotals.salesAmount + totals.subtotals.vat - totals.subtotals.insuranceDeposit - totals.subtotals.performanceBound - totals.subtotals.advancedPayment + data.notInvoicedReportDto.amount + data.notInvoicedReportDto.vat - data.notInvoicedReportDto.insurance - data.notInvoicedReportDto.performance + data.adjustmentReportDto.amount + data.adjustmentReportDto.vat - data.adjustmentReportDto.insurance - data.adjustmentReportDto.performance)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalAdvancedPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalPerformanceBound)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalInsuranceDeposit)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalGrossSales)}</strong></Footer>
                            <Footer></Footer>
                        </tr>
                        <tr>
                            <Footer colSpan={4}><strong>{"کسر می شود : جمع پرداختی های مشتری (ریال)"}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.productPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.advancedPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.performanceBoundPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.insuranceDepositPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.totalPayment)}</strong></Footer>
                            <Footer>
                                <PaymentsModal
                                    customerId={filter?.customerId}
                                    showModal={showModal}
                                    handleShow={handleShow}
                                    handleClose={handleClose}
                                />
                            </Footer>
                        </tr>
                        <tr>
                            <Footer colSpan={4}><strong>{"مانده قابل مطالبه (ریال)"}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.remainingClaimable)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.remainingAdvancedPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.remainingPerformanceBound)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.remainingInsuranceDeposit)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(totals.remainingClaimable)}</strong></Footer>
                            <Footer></Footer>
                        </tr>
                    </Tfoot>

                </Table>
            </TableContainer>
        </Container>
    );
};


export default ClientSummary;