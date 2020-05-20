let categories = [];
let data = [];
bills.map((bill, index) => {
    categories.push(bill.date);
    data.push(bill.total_price);
});
$(function () {
    Highcharts.chart('chart1', {
        title: {text: 'Doanh thu 10 ngày gần nhất'},
        xAxis: {categories: categories},
        yAxis: {title: {text: 'Tổng tiền'}},
        series: [
            {data: data}
        ]
    });
});

$('input[name="month"]').on('change', function () {
    let month = $(this).val();
    $.ajax({
        url: urlStatisticBillInMonth,
        method: 'get',
        dataType: 'json',
        data: {
            month: month,
        }
    }).done((data) => {
        let xhtml = '';
        let total = 0;
        data.bills.map((bill, index) => {
            total += bill.total_price;
            xhtml += `<tr><td class="text-center">${++index}</td><td>${bill.employee_name}</td><td class="text-center">${addCommaInNumber(bill.total_price)}</td></tr>`;
        });
        $('._statistic-bill-in-month tbody').html(xhtml);
        $('._statistic-bill-in-month .header').text(`Tổng tiền: ${addCommaInNumber(total)} VNĐ`)
    });
});
