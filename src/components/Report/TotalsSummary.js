const TotalsSummary = ({ data }) => {
    const subtotals = data.clientSummaryList.reduce(
        (acc, item) => {
            Object.keys(item).forEach((key) => {
                if (!isNaN(parseFloat(item[key]))) {
                    acc[key] += parseFloat(item[key]);
                }
            });
            return acc;
        },
        {
            salesQuantity: 0,
            salesAmount: 0,
            advancedPayment: 0,
            performanceBound: 0,
            insuranceDeposit: 0,
            vat: 0,
        }
    );

    const totalSalesQuantity = subtotals.salesQuantity + data.notInvoicedReportDto.quantity;
    const totalSalesAmount = subtotals.salesAmount + data.notInvoicedReportDto.amount + data.adjustmentReportDto.amount;
    const totalAdvancedPayment = subtotals.advancedPayment;
    const totalPerformanceBound = subtotals.performanceBound + data.notInvoicedReportDto.performance + data.adjustmentReportDto.performance;
    const totalInsuranceDeposit = subtotals.insuranceDeposit + data.notInvoicedReportDto.insurance + data.adjustmentReportDto.insurance;
    const totalGrossSales = subtotals.salesAmount + subtotals.vat + data.notInvoicedReportDto.amount + data.adjustmentReportDto.amount + data.notInvoicedReportDto.vat + data.adjustmentReportDto.vat;
    const totalPayment = data.totalPaymentByCustomerId.productPayment + data.totalPaymentByCustomerId.performanceBoundPayment + data.totalPaymentByCustomerId.insuranceDepositPayment + data.totalPaymentByCustomerId.advancedPayment;
    const remainingClaimable = subtotals.salesAmount + subtotals.vat - subtotals.insuranceDeposit - subtotals.performanceBound + data.notInvoicedReportDto.amount + data.notInvoicedReportDto.vat - data.notInvoicedReportDto.insurance - data.notInvoicedReportDto.performance + data.adjustmentReportDto.amount + data.adjustmentReportDto.vat - data.adjustmentReportDto.insurance - data.adjustmentReportDto.performance - data.totalPaymentByCustomerId.productPayment - data.totalPaymentByCustomerId.advancedPayment;
    const remainingAdvancedPayment = data.totalPaymentByCustomerId.advancedPayment - subtotals.advancedPayment;
    const remainingPerformanceBound = subtotals.performanceBound + data.notInvoicedReportDto.performance + data.adjustmentReportDto.performance - data.totalPaymentByCustomerId.performanceBoundPayment;
    const remainingInsuranceDeposit = subtotals.insuranceDeposit + data.notInvoicedReportDto.insurance + data.adjustmentReportDto.insurance - data.totalPaymentByCustomerId.insuranceDepositPayment;

    return {
        totalSalesQuantity,
        totalSalesAmount,
        totalAdvancedPayment,
        totalPerformanceBound,
        totalInsuranceDeposit,
        totalGrossSales,
        totalPayment,
        remainingClaimable,
        remainingAdvancedPayment,
        remainingPerformanceBound,
        remainingInsuranceDeposit,
        subtotals
    };
};

export default TotalsSummary;


/***
 totalSalesQuantity,
 totalSalesAmount,
 totalAdvancedPayment,
 totalPerformanceBound,
 totalInsuranceDeposit,
 totalGrossSales,
 totalPayment,
 remainingClaimable,
 remainingAdvancedPayment,
 remainingPerformanceBound,
 remainingInsuranceDeposit
 ***/


/***
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
 ***/