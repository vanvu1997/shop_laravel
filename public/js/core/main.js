let _token = $('meta[name="_token"]').attr('content');
var hideMessage;

// ẩn thông báo lỗi/thành công
let hideNotificationMessage = (time = 5000) => {
    if (hideMessage) {
        clearTimeout(hideMessage);
    }
    hideMessage = setTimeout(function() {
        let notifyContainer = $('.notification-message');
        if (notifyContainer.length !== 0) {
            notifyContainer.remove();
        }
    }, time);
};

// hiển thị tin nhắn thông báo
let showNotificationMessage = (message = '', type = 'error', time = 5000) => {
    type = type === 'success' ? 'success' : 'error';
    let notificationMessageDom = $('.notification-message');
    if (notificationMessageDom.length === 1) {
        notificationMessageDom.html(`
            <div class="${type}">${message}</div>
            <span class="close-icon">&times</span>
        `);
    } else {
        $('body').append(`
            <div class="notification-message">
                <div class="${type}">${message}</div>
                <span class="close-icon">&times</span>
            </div>
        `);
    }
    hideNotificationMessage(time);
};

// hàm gọi api server
let callApi = (url, method = 'GET', data = {}, headers = {}, type = null) => {
    if (method.toLowerCase() === 'get' || type === null) {
        method.toLowerCase() === 'get' && (delete data.method);
        return $.ajax({
            url: url,
            method: method,
            dataType: 'json',
            data: data,
            headers: headers,
        }).catch(function() {
            showNotificationMessage('Đã có lỗi tại máy chủ!');
        });
    }

    let formData = new FormData();
    Array.from(Object.keys(data), key => {
        if (key !== 'undefined') {
            formData.append(key, data[key] ? data[key] : '');
        }
    });
    if (method.toLowerCase() === 'put') {
        formData.append('_method', method);
        method = 'post';
    }
    return $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        headers: headers,
    }).catch(function() {
        showNotificationMessage('Đã có lỗi tại máy chủ!');
    });
};

// xóa dữ liệu input form
let clearInput = (form) => {
    form.find('input').map((key, inputDom) => {
        // các trường hợp không xóa input: input hidden, input disable, input chứa class except
        if (($(inputDom).attr('type') === 'hidden' && ['_token', '_method'].indexOf($(inputDom).attr('name')) !== -1) ||
            $(inputDom).prop('disabled') !== false ||
            ($(inputDom).attr('class') && $(inputDom).attr('class').match(/except/i))
        ) {
            return;
        }
        $(inputDom).val('');
        $(inputDom).attr('type') === 'file' && form.find('.upload_file').html('');
        $(inputDom).attr('type') === 'checkbox' && $(inputDom).is(':checked') && $(inputDom).click();
    });
    form.find('select').map((key, selectDom) => {
        let firstOption = $(selectDom).children('option:first');
        $(selectDom).val(firstOption.val());
        firstOption.change();
    });
    form.find('textarea').map((key, textareaDom) => {
        $(textareaDom).val('');
        if ($(textareaDom).attr('class').match(/ck-editor/i)) {
            myEditor.setData('');
        }
    });
};

// xóa dữ liệu lỗi input
let clearErrorInput = (form) => {
    form.find('.error-input').map((key, errorInputDom) => {
        $(errorInputDom).remove();
    });
};

// hiển thị lỗi input trong form
let showErrorForm = (form, errors = {}) => {
    $('.error-input').text('');
    $hasError = false;
    Array.from(Object.keys(errors), key => {
        if (errors[key]) {
            $hasError = true;
            let input = form.find(`input[name="${key}"]`);
            // select
            if (input.length === 0) {
                input = form.find(`select[name="${key}"]`);
            }
            // textarea
            if (input.length === 0) {
                input = form.find(`textarea[name="${key}"]`);
            }

            let errorInput = input.siblings('span.error-input');
            let message = Array.isArray(errors[key]) ? errors[key][0] : errors[key];

            if (errorInput.length === 1) {
                errorInput.text(message);
            } else {
                input.after(`<span class="error-input">${message}</span>`);
            }
        }
    });

    return $hasError;
};

var numberFormat = (val) => {
    return (val + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
var revertNumber = (val) => {
    let number = (val + '').replace(/,/g, "");
    return parseInt(number);
};

// lấy dữ liệu form
let getFormData = (form) => {
    let data = {};
    data.method = form.attr('method') ? form.attr('method') : 'get';
    // input
    form.find('input').map((i, e) => {
        if ($(e).is(':disabled')) {
            return;
        }
        let type = $(e).attr('type');
        let name = $(e).attr('name');
        if (type === 'file') {
            data[name] = e.files[0];
            return;
        }
        let value = $(e).attr('data-value') ? $(e).attr('data-value') : $(e).val();

        if ((type === 'radio' || type === 'checkbox')) {
            if ($(e).is(':checked')) {
                data[name] = value;
            }
        } else {
            if (name === '_method') {
                data.method = value;
            } else {
                data[name] = value;
            }
        }
    });
    // select
    form.find('select').map((i, e) => {
        let name = $(e).attr('name');
        let value = '';
        $(e).children('option').map((i, child) => {
            if ($(child).is(':checked')) {
                value = $(child).val();
            }
        });
        data[name] = value;
    });
    // textarea
    form.find('textarea').map((i, e) => {
        let name = $(e).attr('name');
        let value = $(e).attr('class').match(/ck-editor/i) ? myEditor.getData() : $(e).val();
        data[name] = value;
    });

    return data;
};

$(document).ready(function() {
    // tắt tin nhắn thông báo khi load lại trang web
    hideNotificationMessage();

    // tắt tin nhắn thông báo sau khi click vào x
    $(document).on('click', '.close-icon', function() {
        hideNotificationMessage(0);
    });

    // hiển thị menu con
    $(document).on('click', '#sidebar-collapse .nav>li>a', function() {
        $(this).siblings().toggle();
    });

    // show modal
    $(document).on('click', '.open-modal', function () {
        $('.modal').show();
    });

    // đóng modal
    $(document).mouseup(function(e) {
        let modal = $('.modal');
        if (modal.length > 0 && modal.is(e.target)) {
            modal.data('remove') === false ? modal.hide() : modal.remove();
        }
    });
    $(document).on('click', '.close-modal', function () {
        let modal = $(this).closest('.modal');
        modal.data('remove') === false ? modal.hide() : modal.remove();
    });

    $(document).on('click', '.btn-clear-filter', function () {
        clearInput($('.form-filter'));
        $('.btn-search').click();
    });

    // submit form
    $(document).on('click', 'button.btn', function (event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        // đóng modal
        if ($(this).attr('class').match(/btn-close/i)) {
            return $(this).closest('.modal').remove();
        }

        // nếu có container chứa button thì tìm container, nếu không thì tìm form
        let container = $(this).data('container') ? $(this).data('container') : 'form';
        let form = $(this).closest(container);
        if (form.length === 0) {
            let tagA = $(this).closest('a');
            if (tagA.length === 0) {
                return;
            } else {
                window.location.href = tagA.attr('href');
            }
        }
        let item = $(this).closest('.item');
        if (form.data('is-ajax') === true) {
            let data = getFormData(form);
            let url = $(this).data('url') ? $(this).data('url') : form.attr('action');

            if (data.method === 'delete' && !confirm('Bạn có chắc chắn muốn xóa?')) {
                return;
            }

            let headers = {};
            let type = null;
            if (form.data('form-file') === true) {
                headers = {'X-CSRF-TOKEN': csrfToken};
                type = 'form-data';
            }

            callApi(url, data.method, data, headers, type).then((data) => {
                if (typeof data !== 'object') {
                    return;
                }
                if (data.status === ERROR_STATUS) {
                    if (data.message) {
                        showNotificationMessage(data.message);
                    }
                    if (data.errors) {
                        clearErrorInput(form);
                        showErrorForm(form, data.errors);
                    }
                } else if (data.status === SUCCESS_STATUS) {
                    if (data.message) {
                        showNotificationMessage(data.message, 'success');
                    }
                    if (data.class && data.domHtml) {
                        $(data.class).append(data.domHtml);
                    }
                    if (data.type) {
                        switch (data.type) {
                            // xóa phần tử
                            case TYPE_DELETE_ITEM:
                                item.remove();
                                break;

                            // xóa lỗi validate, xóa value trong input
                            case TYPE_CLEAN_FORM_INPUT:
                                clearErrorInput(form);
                                clearInput(form);
                                break;

                            // xóa lỗi validate
                            case TYPE_CLEAN_ERROR_INPUT:
                                clearErrorInput(form);
                                break;

                            // chuyển hướng đến url khác
                            case TYPE_GET_URL:
                                location.href = data.route;
                                break;

                            // xóa lỗi validate, xóa value trong input và reset form
                            case TYPE_RESET_FORM_CREATE_BILL:
                                clearErrorInput(form);
                                clearInput(form);
                                $('.product-container').html('');
                                $('input[name="total"]').val('');
                                break;

                            // xem chi tiết
                            case TYPE_VIEW_DETAIL:
                                $('body').prepend(data.domHtml);
                                break;

                            // lọc
                            case TYPE_SEARCH:
                                $('.table tbody tr').map((i, e) => {
                                    if (i > 0) {
                                        $(e).remove();
                                    }
                                });
                                $('.table tbody').append(data.domHtml);
                                $('.main nav').remove();
                                break;

                            case TYPE_RESET_FORM_CREATE_CHECKOUT:
                                $('.pay-history tbody').append(data.domHtml);
                                let stt = $('.pay-history tbody tr').length - 1;
                                $('.pay-history tr:last td:first').text(stt);
                                let domCashGive = $('._cash-give');
                                let domeCashDebt = $('._cash-debt');
                                domCashGive.html(numberFormat(parseInt(revertNumber(domCashGive.text())) + parseInt(data.money)));
                                domeCashDebt.html(numberFormat(parseInt(revertNumber(domeCashDebt.text())) - parseInt(data.money)));
                                if (parseInt(data.bill.status) === 1) {
                                    $(`[data-status-bill-id=${data.bill.id}] button`).text('Đang xử lý')
                                        .attr('class', 'btn btn-warning min-w-80');
                                    $('.container-checkout').html('<button class="btn btn-primary btn-add-checkout">Thanh toán</button>');
                                } else {
                                    $(`[data-status-bill-id=${data.bill.id}] button`).text('Hoàn thành')
                                        .attr('class', 'btn btn-success min-w-80');
                                    $('.container-checkout').remove();
                                }
                                break;
                        }
                    }
                }
            });
        } else if (form.data('is-ajax') !== 'custom') {
            form.submit();
        } else {
            // nothing
        }

        // chặn click liên tiếp nhiều lần
        $(this).attr('disabled', 'disabled');
        setTimeout(() => $(this).removeAttr('disabled'), 1500);
    });
    // định dạng số hàng nghìn, triệu, tỷ,...
    $(document).on('input', 'input[data-number]', function () {
        let number = $(this).val().replace(/,/g, '');
        $(this).attr('data-value', number);
        $(this).val(number.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    $(document).on('input', 'input[data-type="number"]', function () {
        let number = $(this).val().replace(/,/g, '');
        $(this).attr('data-value', number);
        $(this).val(number.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    // toggle menu
    $(document).on('change', '._header-left .switch input', function () {
        let status = $(this).is(':checked') ? 'on' : 'off';
        callApi(urlSetToggleMenu, 'post', {_token: csrfToken, status: status}).then((data) => {
            if (data && data.status === SUCCESS_STATUS) {
                if ($(this).is(':checked')) {
                    $('._menu').removeClass('hidden');
                    $('.main').addClass('m-l-245');
                } else {
                    $('._menu').addClass('hidden');
                    $('.main').removeClass('m-l-245');
                }
            }
        });
    });
    // xóa row sản phẩm trong hóa đơn, nhập hàng
    $(document).on('click', '.label-close', function () {
        $(this).closest('.row').remove();
        let total = 0;
        $('.product-container .row').map((i, e) => {
            let quantity = parseInt($(e).find('.quantity').val());
            let price = revertNumber($(e).find('.price').val());
            total += quantity * price;
        });
        $('input[name="total"]').val(numberFormat(total));
    });
});
// đọc thông báo
function readNotify(notificationLink) {
    callApi(notificationLink).then((data) => {
        if (data && data.status === 1) {
            window.location.href = data.link;
        }
    });
}
// cập nhật tổng tiền hóa đơn
let updateTotalPrice = () => {
    let totalPrice = 0;
    $('.product-container .row').map((i, e) => {
        let quantity = $(e).find('.quantity').val();
        quantity = quantity ? parseInt(quantity) : 0;
        let price = $(e).find('.price').val();
        price = price ? parseInt(revertNumber(price)) : 0;
        totalPrice += quantity * price;
    });
    $('input[name="total"]').val(numberFormat(totalPrice));
};
// kiểm tra sản phẩm đã tồn tại ở hóa đơn hoặc không chọn sản phẩm nào
let checkExistProduct = (productId, selector = '.product-container .row') => {
    if (productId === 0) {
        return true;
    }
    let isExist = false;
    $(selector).map((i, e) => {
        if (parseInt($(e).data('product-id')) === productId) {
            isExist = true;
        }
    });
    return isExist;
};

$(document).on('focusin', '[data-type="number-separate"]', function (event) {
    let value = $(this).val();
    let number = removeCommaInNumber(value);
    $(this).attr('data-value', value).val(number);
});
$(document).on('focusout', '[data-type="number-separate"]', function (event) {
    let value = parseInt($(this).val() ? $(this).val() : 0);
    let number = addCommaInNumber(value);
    $(this).attr('data-value', value).val(number);
});
$(document).on('input', '[data-type="string-slug"]', function (event) {
    $('input[name="slug"]').val(slug($(this).val()));
});
