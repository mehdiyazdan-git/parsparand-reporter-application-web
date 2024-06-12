// listNames: "products", "reports", "customers", "warehouseReceipts"
// year: "jalaliYear" is global
// each list has: search, page, pageSize, totalPages, totalElements
// but search is different for each list
//functions :
// addFilter(listName,filterName,filterValue)
// clearFilter(listName,filterName)
// addSearch(listName,searchName,searchValue)
// clearSearch(listName,searchName)
// addFilterToSearch(listName,filterName,searchName,searchValue)
// removeFilterFromSearch(listName,filterName,searchName)
// excludeFilterFromSearch(listName,filterName,searchName,searchValue)
// doFilterWithoutYear(listName)
// setYears(year)
// getYears()
export const filters = {
    "products": {
        "page": 0,
        "pageSize": 10,
        "totalPages": 38,
        "totalElements": 378,
        "search": {}
    },
    "reports": {
        "page": 0,
        "pageSize": 10,
        "totalPages": 0,
        "totalElements": 0,
        "search": {
            "reportName": "",
            "reportDescription": "",
            "reportDate": "2024-04-07"
        }
    },
    "customers": {
        "page": 0,
        "pageSize": 10,
        "totalPages": 28,
        "totalElements": 275,
        "search": {
            "customerName": "",
            "customerDescription": "",
            "customerNumber": ""
        }
    },
    "warehouseReceipts": {
        "page": 0,
        "pageSize": 10,
        "totalPages": 32,
        "totalElements": 319,
        "search": {
            "customerName": "",
            "totalPrice": "",
            "totalQuantity": "",
            "warehouseReceiptDate": "2024-04-07",
            "warehouseReceiptDescription": "",
            "warehouseReceiptNumber": ""
        }
    },
    "years": {
        "jalaliYear": {
            "label": 1403,
            "value": 4
        }
    }
}
