const colors = [
    '#d9480f', '#e8590c', '#f76707', '#fd7e14', '#ff922b', '#ffa94d',
    '#ffc078', '#ffd8a8', '#ffe8cc', '#fff4e6'
]

function drawBestsellerBarChart(series) {

    // Highcharts 구성 업데이트
    Highcharts.chart('bestseller-container', {
        chart: {
            type: 'column'
        },
        title: {
            text: '베스트셀러 10'
        },
        xAxis: {
            categories: [name]
        },
        yAxis: {
            min: 0,
            title: {
                text: '판매량'
            }
        },
        legend: {
            enabled: true
        },
        tooltip: {
            pointFormat: '<b>{point.y}</b> 건'
        },
        series, // [{name: "aa", data: [6]}, ...],

    })
}

function drawJoinRoutePieChart(series) {
    const oddColors = colors.filter((color, index) => index % 2 == 1)

    Highcharts.chart('join-route-container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '가입 경로 분석 그래프',
            align: 'center'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: oddColors,
                borderRadius: 5,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                    distance: -50,
                    filter: {
                        property: 'percentage',
                        operator: '>',
                        value: 4
                    },
                    style: {
                        textOutline: 'none'
                    }
                }
            }
        },
        series //
    })
}

function drawResultOfSalesLineChart(inputData) {
    const oddColors = colors.filter((color, index) => index % 2 == 1);

    let categories = inputData.categories;
    let series = inputData.series;


    Highcharts.chart('sales-container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: '일별 거래 건수 집계 그래프'
        },
        colors: oddColors,
        subtitle: {
            text: '구매/취소/환불/교환'
        },
        xAxis: {
            categories
        },
        yAxis: {
            title: {
                text: 'Temperature'
            },
            labels: {
                format: '{value}°'
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#fff4e6',
                    lineWidth: 1
                }
            }
        },
        series
    });
}

// 판매량 top 10 차트
fetch('/api/stats/best-seller')
    .then(response => response.json())
    .then(data => {
        chartData = data.map((item, index) => ({
            name: item.prettyName,  // 상품 이름
            data: [item.count],     // 상품의 판매량
            color: colors[index % colors.length]
        }));

        drawBestsellerBarChart(chartData);
    }).catch(error => {
        console.error('데이터 가져오는 중 오류 발생:', error);
    });

// 회원 가입 경로 집계 차트
fetch('/api/stats/join-route')
    .then(response => response.json())
    .then(data => {
        chartData = data.map(item => ({
            name: item.name,        // 유입 경로명
            y: item.count           // 유입 수치
        }));

        const series = [{ name: "점유율", data: chartData }]

        drawJoinRoutePieChart(series);
    }).catch(error => {
    console.error('데이터 가져오는 중 오류 발생:', error);
});

// 일별 구매/취소/환불/교환 건수 집계 차트
fetch('/api/stats/calculate-sales')
    .then(response => response.json())
    .then(data => {
        data = parseOrderChartData(data);
        drawResultOfSalesLineChart(data);
    }).catch(error => {
    console.error('데이터 가져오는 중 오류 발생:', error);
});

// 하루 중에 발생한 구매/취소/환불/교환 건수가 없을 경우, 없는 데이터를 0으로 맞춰주기 위한 작업중
function parseOrderChartData(data) {
    // xAxis.categories = ['2024-01-20', '2024-02-04', ...]
    let categories = [ ...new Set(data.map(e => e.date.slice(0,10)))];

    // series[][name] = ['주문건수', '취소건수', '환불건수', '교환건수']
    let labels = [ ...new Set(data.map(e => e.category)) ];

    let series = []
    for (let label of labels) {
        // [{"DATE":"2024-02-04","CATEGORY":"취소건수","COUNT":2},{"DATE":"2024-05-22","CATEGORY":"취소건수","COUNT":1}]
        let labelData = data.filter(e => e.category == label);
        series.push({
            data: categories
                    .map(date => labelData.find(e => e.date.slice(0,10) == date)) // date == '2024-02-04'
                    .map(e => e && e.count || 0), // [0, 2, 0, 0, 0, 0, 0, 1, 0, 0]
            name: label
        })
    }

    return {
        categories,
        series
    };
}