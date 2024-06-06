import React, {useEffect, useMemo, useState} from 'react';
import { Link } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import IconEdit from "../assets/icons/IconEdit";
import AsyncSelectSearchInput from "../table/AsyncSelectSearchInput";
import { useFilters } from "../contexts/FilterContext";
import styled from 'styled-components';
import PaymentsModal from "../Payment/paymentsModal";
import Payments from "../Payment/Payments";
import AdjustmentsModal from "../Adjustment/AdjustmentsModal";

const Container = styled.div`
  font-family: IRANSans;
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
`;

const Row = styled.td`
  font-size: 0.75rem;
  color: #333;
  text-align: center;
  padding: 0.5rem;
  border: 1px #95a3b3 solid;
  font-family: IRANSans;
  width: 14.30%;
  background-color: rgba(240, 240, 240, 0.9);
`;

const Footer = styled.td`
  background-color: rgba(220, 220, 220, 0.3);
  font-size: 0.75rem;
  color: #333;
  text-align: center;
  padding: 0.5rem;
  border: 1px #95a3b3 solid;
  font-family: IRANSans;
  font-weight: bold;
  width: 14.30%;
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
    if (isNaN(parseFloat(number)) || number == null || number === 'undifined') {
        number = 0;
    }
    const isNegative = number < 0;
    const absoluteValue = Math.abs(number);
    const formattedValue = new Intl.NumberFormat('fa-IR').format(absoluteValue);
    return isNegative ? `(${formattedValue})` : formattedValue;
}

const date = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'long' }).format(new Date());

const ClientSummary = () => {
    const http = useHttp();
    const { filters, setFilter } = useFilters();
    const listName = "clientSummaryList";
    const [customer, setCustomer] = useState(null);
    const [data, setData] = useState({
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
    });

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const subtotals = useMemo(() => {
        return data.clientSummaryList.reduce(
            (acc, item) => {
                Object.keys(item).forEach((key) => {
                    if (!isNaN(parseFloat(item[key]))) {
                        acc[key] += parseFloat(item[key]);
                    }
                });
                return acc;
            },
            {
                contractNumber: 'Subtotals',
                salesQuantity: 0,
                salesAmount: 0,
                advancedPayment: 0,
                performanceBound: 0,
                insuranceDeposit: 0,
                vat: 0,
            }
        );
    }, [data.clientSummaryList]);

    const totalSalesQuantity = toPersianFormat(subtotals.salesQuantity + data.notInvoicedReportDto.quantity);
    const totalSalesAmount = toPersianFormat(
        subtotals.salesAmount + data.notInvoicedReportDto.amount + data.adjustmentReportDto.amount
    );
    const totalVat = toPersianFormat(subtotals.vat + data.notInvoicedReportDto.vat + data.adjustmentReportDto.vat);
    const totalNetSales = toPersianFormat(
        subtotals.salesAmount + subtotals.vat
        - subtotals.insuranceDeposit
        - subtotals.performanceBound
        - subtotals.advancedPayment
        + data.notInvoicedReportDto.amount + data.notInvoicedReportDto.vat
        - data.notInvoicedReportDto.insurance
        - data.notInvoicedReportDto.performance
        + data.adjustmentReportDto.amount + data.adjustmentReportDto.vat
        - data.adjustmentReportDto.insurance
        - data.adjustmentReportDto.performance
    );
    const totalAdvancedPayment = toPersianFormat(subtotals.advancedPayment);
    const totalPerformanceBound = toPersianFormat(
        subtotals.performanceBound
        + data.notInvoicedReportDto.performance
        + data.adjustmentReportDto.performance
    );
    const totalInsuranceDeposit = toPersianFormat(
        subtotals.insuranceDeposit
        + data.notInvoicedReportDto.insurance
        + data.adjustmentReportDto.insurance
    );
    const totalGrossSales = toPersianFormat(
        subtotals.salesAmount + subtotals.vat
        + data.notInvoicedReportDto.amount
        + data.adjustmentReportDto.amount
        + data.notInvoicedReportDto.vat
        + data.adjustmentReportDto.vat
    );

    const totalPayment = toPersianFormat(
        data.totalPaymentByCustomerId.productPayment +
        data.totalPaymentByCustomerId.performanceBoundPayment +
        data.totalPaymentByCustomerId.insuranceDepositPayment +
        data.totalPaymentByCustomerId.advancedPayment
    );

    const remainingClaimable = toPersianFormat(
        subtotals.salesAmount + subtotals.vat
        - subtotals.insuranceDeposit
        - subtotals.performanceBound
        + data.notInvoicedReportDto.amount + data.notInvoicedReportDto.vat
        - data.notInvoicedReportDto.insurance
        - data.notInvoicedReportDto.performance
        + data.adjustmentReportDto.amount + data.adjustmentReportDto.vat
        - data.adjustmentReportDto.insurance
        - data.adjustmentReportDto.performance
        - data.totalPaymentByCustomerId.productPayment
        - data.totalPaymentByCustomerId.advancedPayment
    );

    const remainingAdvancedPayment = toPersianFormat(
        data.totalPaymentByCustomerId.advancedPayment - subtotals.advancedPayment
    );

    const remainingPerformanceBound = toPersianFormat(
        subtotals.performanceBound +
        data.notInvoicedReportDto.performance +
        data.adjustmentReportDto.performance -
        data.totalPaymentByCustomerId.performanceBoundPayment
    );

    const remainingInsuranceDeposit = toPersianFormat(
        subtotals.insuranceDeposit +
        data.notInvoicedReportDto.insurance +
        data.adjustmentReportDto.insurance -
        data.totalPaymentByCustomerId.insuranceDepositPayment
    );

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }

    const loadData = async () => {

        await http.get(`/customers/${filters[listName]?.search?.customerId}/summary`).then(response => setData(response.data));
        await customerSelect().then(res => setCustomer(res.data.find(item => item.id === filters[listName]?.search?.customerId)));
    }
    useEffect(() => {
        if (!filters[listName]?.search?.customerId ||
            filters[listName]?.search?.customerId === '' ||
            filters[listName]?.search?.customerId === 'undefined') {
             customerSelect().then(res => {
                const newSearch = { ...filters[listName]?.search, customerId: res.data[0].id  };
                setFilter(listName, 'search', newSearch);
            });
        }
    },[])

    useEffect(() => {
        if (filters[listName]?.search?.customerId) {
            loadData()
        }
    }, [filters[listName]?.search?.customerId]);

    return (
        <Container>
            <div className="row mt-3">
                <AsyncSelectSearchInput
                    fetchFunction={customerSelect}
                    onChange={(value) => {
                        const newSearch = { ...filters[listName]?.search, customerId: value };
                        setFilter(listName, 'search', newSearch);
                    }}
                    value={filters[listName]?.search?.customerId}
                />
            </div>

            <div className="row mt-5">
                <span><strong>{`خلاصه وضعیت مشتری : ${customer?.name} در تاریخ : ${date}`}</strong></span>
            </div>
            <TableContainer>
                <Table>
                    <Thead>
                        <tr className="table-header">
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
                                    <Link to={`${filters[listName]?.search?.customerId}/${item.contractNumber}/${customer?.name}`}>
                                        <IconEdit color="green" fontSize={"1rem"} />
                                    </Link>
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
                                <Link to={`${filters[listName]?.search?.customerId}/notInvoiced`}>
                                    <IconEdit color="green" fontSize={"1rem"} />
                                </Link>
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
                                    customerId={filters[listName]?.search?.customerId}
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
                            <Footer><strong>{totalSalesQuantity}</strong></Footer>
                            <Footer><strong>{totalSalesAmount}</strong></Footer>
                            <Footer><strong>{totalVat}</strong></Footer>
                            <Footer><strong>{totalNetSales}</strong></Footer>
                            <Footer><strong>{totalAdvancedPayment}</strong></Footer>
                            <Footer><strong>{totalPerformanceBound}</strong></Footer>
                            <Footer><strong>{totalInsuranceDeposit}</strong></Footer>
                            <Footer><strong>{totalGrossSales}</strong></Footer>
                            <Footer></Footer>
                        </tr>
                        <tr>
                            <Footer colSpan={4}><strong>{"کسر می شود : جمع پرداختی های مشتری (ریال)"}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.productPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.advancedPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.performanceBoundPayment)}</strong></Footer>
                            <Footer><strong>{toPersianFormat(data.totalPaymentByCustomerId.insuranceDepositPayment)}</strong></Footer>
                            <Footer><strong>{totalPayment}</strong></Footer>
                            <Footer>
                                <PaymentsModal
                                    customerId={filters[listName]?.search?.customerId}
                                    showModal={showModal}
                                    handleShow={handleShow}
                                    handleClose={handleClose}
                                />
                            </Footer>
                        </tr>
                        <tr>
                            <Footer colSpan={4}><strong>{"مانده قابل مطالبه (ریال)"}</strong></Footer>
                            <Footer><strong>{remainingClaimable}</strong></Footer>
                            <Footer><strong>{remainingAdvancedPayment}</strong></Footer>
                            <Footer><strong>{remainingPerformanceBound}</strong></Footer>
                            <Footer><strong>{remainingInsuranceDeposit}</strong></Footer>
                            <Footer><strong>{remainingClaimable}</strong></Footer>
                            <Footer></Footer>
                        </tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ClientSummary;
