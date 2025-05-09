export const mainData = [
  {
    id: 1,
    airlineName: '国航',
    flightCode: 'CA961',
    flightDate: '2024-3-3',
    BoardNumber: '1LD 5.7',
    destinationPort: 'MUC',
    departurePort: 'PEK',
    totalCabinSpaceWeight: 3000,
    totalCabinSpaceVolume: 11,
    alreadyNum: 123,
    alreadyWeight: 2725,
    alreadyVolume: 11.6,
    remainingWeight: 275,
    remainingVolume: -0.6,
    totalCostWeight: 2936,
    totalReceivables: 42846.5,
    totalOperations: 2936,
    totalTruckFees: 4191,
    profit: 5719.5,
    remark: '不能超重',
    children: [
      {
        id: 465,
        pid: 1,
        flightDate: '2024-05-25',
        entrustingClients: '欧华',
        mainOrderNumber: '999-04246675',
        businessNumber: 'JBJAAE24050050',
        destinationPort: 'FRA',
        num: 7,
        grossWeight: 123,
        volume: 1.45,
        costWeight: 546,
        size: '122*82*55/3',
        proportion: 123,
        sellingPrice: 15.5,
        truckFees: 1.5,
        operatingFee: 7,
        mucPrice: 12,
        totalReceivables: 12445,
        totalOperations: 334,
        totalTruckFees: 1322,
        profit: 3567
      },
      {
        id: 1,
        pid: 1,
        flightDate: '2024-05-25',
        entrustingClients: '欧华',
        mainOrderNumber: '999-04246675',
        businessNumber: 'JBJAAE24050051',
        destinationPort: 'FRA',
        num: 3,
        grossWeight: 343,
        volume: 1.34,
        costWeight: 925,
        size: '122*82*55/3',
        proportion: 456,
        sellingPrice: 13.5,
        truckFees: 0.5,
        operatingFee: 8,
        mucPrice: 87,
        totalReceivables: 67889,
        totalOperations: 778,
        totalTruckFees: 1466,
        profit: 1236
      },
      {
        id: 2,
        pid: 1,
        flightDate: '2024-05-25',
        entrustingClients: '天序',
        mainOrderNumber: '999-04451123',
        businessNumber: 'JBJAAE24050052',
        destinationPort: 'FRA',
        num: 4,
        grossWeight: 549,
        volume: 3.15,
        costWeight: 549,
        size: '141*81*90/2',
        proportion: 174,
        sellingPrice: 17,
        truckFees: 2.5,
        operatingFee: 2,
        mucPrice: 12.5,
        totalReceivables: 8784,
        totalOperations: 549,
        totalTruckFees: 1372.5,
        profit: 6862.5
      },
      {
        id: 4,
        pid: 2,
        flightDate: '2024-05-25',
        entrustingClients: '宏盛',
        mainOrderNumber: '999-04451171',
        businessNumber: 'JBJAAE24050053',
        destinationPort: 'MUC',
        num: 98,
        grossWeight: 439,
        volume: 3.9,
        costWeight: 650,
        size: ' ',
        proportion: 113,
        sellingPrice: 16,
        truckFees: 0,
        operatingFee: 9,
        mucPrice: 15,
        totalReceivables: 10400,
        totalOperations: 650,
        totalTruckFees: 0,
        profit: 9750
      }
    ]
  },
  {
    id: 2,
    airlineName: '国航',
    flightCode: 'CA961',
    flightDate: '2024-3-6',
    BoardNumber: '2LD 4W',
    destinationPort: 'FRA',
    departurePort: 'PEK',
    totalCabinSpaceWeight: 6000,
    totalCabinSpaceVolume: 22,
    alreadyNum: 76,
    alreadyWeight: 6000,
    alreadyVolume: 21.9,
    remainingWeight: 0,
    remainingVolume: 0.1,
    totalCostWeight: 6066,
    totalReceivables: 85680.5,
    totalOperations: 3580,
    totalTruckFees: 4191,
    profit: 11438,
    remark: '',
    children: [
      {
        id: 3,
        pid: 2,
        flightDate: '2024-05-25',
        entrustingClients: '易呈',
        mainOrderNumber: '999-04246583',
        businessNumber: 'JBJAAE24050054',
        destinationPort: 'MUC',
        num: 23,
        grossWeight: 308,
        volume: 0.92,
        costWeight: 335,
        size: '141*81*90/2',
        proportion: 439,
        sellingPrice: 12,
        truckFees: 0,
        operatingFee: 9,
        mucPrice: 21,
        totalReceivables: 3696,
        totalOperations: 308,
        totalTruckFees: 0,
        profit: 3388
      },
      {
        id: 5,
        pid: 2,
        flightDate: '2024-05-25',
        entrustingClients: '洛豪',
        mainOrderNumber: '999-04451156',
        businessNumber: 'JBJAAE24050055',
        destinationPort: 'MUC',
        num: 2,
        grossWeight: 675,
        volume: 1.98,
        costWeight: 675,
        size: '120*80*103/2',
        proportion: 341,
        sellingPrice: 14.5,
        truckFees: 2.5,
        operatingFee: 7,
        mucPrice: 68,
        totalReceivables: 9787.5,
        totalOperations: 675,
        totalTruckFees: 1687.5,
        profit: 7425
      }
    ]
  }
]

export const tableData2 = [
  {
    id: 6,
    pid: 1,
    flightDate: '2024-05-25',
    entrustingClients: '飞天',
    mainOrderNumber: '999-04246583',
    businessNumber: 'JBJAAE24050058',
    destinationPort: 'FRA',
    num: 3,
    grossWeight: 554,
    volume: 1.55,
    costWeight: 456,
    size: '122*82*55/3',
    proportion: 234,
    sellingPrice: 15.3,
    truckFees: 1.6,
    operatingFee: 3,
    mucPrice: 23,
    totalReceivables: 68899,
    totalOperations: 663,
    totalTruckFees: 4521,
    profit: 8996
  },
  {
    id: 7,
    pid: 1,
    flightDate: '2024-05-25',
    entrustingClients: '万达',
    mainOrderNumber: '999-04451123',
    businessNumber: 'JBJAAE24050059',
    destinationPort: 'FRA',
    num: 6,
    grossWeight: 124,
    volume: 1.33,
    costWeight: 657,
    size: '141*87*90/1',
    proportion: 578,
    sellingPrice: 15.3,
    truckFees: 1.3,
    operatingFee: 5,
    mucPrice: 34,
    totalReceivables: 23455,
    totalOperations: 268,
    totalTruckFees: 4566,
    profit: 8294
  }
]
export const summaryData = [
  [
    {
      id: 1,
      pid: 1,
      flightDate: '2024-05-24',
      entrustingClients: '欧华',
      mainOrderNumber: '999-04246583',
      businessNumber: ' ',
      destinationPort: 'FRA',
      num: 7,
      grossWeight: 456,
      volume: 1.35,
      costWeight: 236,
      size: '122*82*55/3',
      proportion: 357,
      sellingPrice: 15.3,
      truckFees: 1.7,
      operatingFee: 6,
      mucPrice: 35,
      totalReceivables: 45345,
      totalOperations: 909,
      totalTruckFees: 5677,
      profit: 3433
    },
    {
      id: 2,
      pid: 1,
      flightDate: '2024-05-24',
      entrustingClients: '天序',
      mainOrderNumber: '999-04451123',
      businessNumber: ' ',
      destinationPort: 'FRA',
      num: 9,
      grossWeight: 123,
      volume: 1.22,
      costWeight: 806,
      size: '141*87*90/1',
      proportion: 345,
      sellingPrice: 15.3,
      truckFees: 1.3,
      operatingFee: 3,
      mucPrice: 21,
      totalReceivables: 34553,
      totalOperations: 667,
      totalTruckFees: 1234,
      profit: 2344
    },
    {
      id: 23,
      pid: 2,
      flightDate: '2024-05-24',
      entrustingClients: '易呈',
      mainOrderNumber: '999-04246675',
      businessNumber: ' ',
      destinationPort: 'FRA',
      num: 1,
      grossWeight: 749,
      volume: 10,
      costWeight: 50,
      size: '141*81*90/2',
      proportion: 367,
      sellingPrice: 15.3,
      truckFees: 1.2,
      operatingFee: 8,
      mucPrice: 25,
      totalReceivables: 10,
      totalOperations: 50,
      totalTruckFees: 1223,
      profit: 23423
    },
    {
      id: 4,
      pid: 2,
      flightDate: '2024-05-24',
      entrustingClients: '宏盛',
      mainOrderNumber: '999-04451123',
      businessNumber: ' ',
      destinationPort: 'FRA',
      num: 4,
      grossWeight: 244,
      volume: 1.58,
      costWeight: 799,
      size: ' ',
      proportion: 898,
      sellingPrice: 15.3,
      truckFees: 1.9,
      operatingFee: 2,
      mucPrice: 25,
      totalReceivables: 24566,
      totalOperations: 457,
      totalTruckFees: 1325,
      profit: 3455
    }
  ],
  [
    {
      id: 5,
      pid: 2,
      flightDate: '2024-05-25',
      entrustingClients: '洛豪',
      mainOrderNumber: '999-04451123',
      businessNumber: 'JBJAAE24050057',
      destinationPort: 'FRA',
      num: 6,
      grossWeight: 754,
      volume: 1.34,
      costWeight: 754,
      size: '122*82*55/3',
      proportion: 124,
      sellingPrice: 15.3,
      truckFees: 1.0,
      operatingFee: 1,
      mucPrice: 28,
      totalReceivables: 35667,
      totalOperations: 456,
      totalTruckFees: 2344,
      profit: 2345
    },
    {
      id: 6,
      pid: 1,
      flightDate: '2024-05-25',
      entrustingClients: '飞天',
      mainOrderNumber: '999-04246583',
      businessNumber: 'JBJAAE24050058',
      destinationPort: 'FRA',
      num: 8,
      grossWeight: 789,
      volume: 1.77,
      costWeight: 235,
      size: '122*82*55/3',
      proportion: 457,
      sellingPrice: 15.3,
      truckFees: 3,
      operatingFee: 2,
      mucPrice: 11,
      totalReceivables: 24566,
      totalOperations: 456,
      totalTruckFees: 1234,
      profit: 7896
    },
    {
      id: 7,
      pid: 1,
      flightDate: '2024-05-25',
      entrustingClients: '万达',
      mainOrderNumber: '999-04451123',
      businessNumber: 'JBJAAE24050059',
      destinationPort: 'FRA',
      num: 7,
      grossWeight: 678,
      volume: 1.65,
      costWeight: 123,
      size: '141*87*90/1',
      proportion: 457,
      sellingPrice: 15.3,
      truckFees: 1.5,
      operatingFee: 5,
      mucPrice: 14,
      totalReceivables: 12322,
      totalOperations: 989,
      totalTruckFees: 1324,
      profit: 7895
    }
  ]
]
