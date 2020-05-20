$(document).ready(function () {
    // thay đổi giá nhập hoặc số lượng => cập nhật tổng tiền hóa đơn
    $(document).on('input', '.price, .quantity', function () {
        updateTotalPrice();
    });
    $(document).on('change', 'select[name="product_id"]', function () {
        let name = $(this).children('option:selected').text();
        let productId = $(this).val() ? parseInt($(this).val()): 0;
        let price = $('select[name="product_id"] option:selected').data('price');
        price = price ? parseInt(price) : 0;
        if (checkExistProduct(productId, '.product-container .row')) {
            return;
        }
        let productRow = `
                <div class="form-group-sm row" data-product-id="${productId}">
                    <div class="col-md-6 col-sm-6">
                        <label class="btn-danger label-close">&times;</label>
                        <input type="text" class="form-control" value="${name}" disabled>
                        <input type="hidden" name="products[${productId}]" value="${productId}">
                    </div>
                    <div class="col-md-3 col-sm-3">
                        <label>Giá nhập</label>
                        <input name="price_ins[${productId}]"
                               class="form-control price"
                               value="${addCommaInNumber(price)}"
                               data-value="${price}"
                               data-type="number-separate">
                    </div>
                    <div class="col-md-3 col-sm-3">
                        <label>Số lượng</label>
                        <input type="number" name="quantities[${productId}]" value="1" min="0" class="form-control quantity">
                    </div>
                </div>
            `;
        $('.product-container').append(productRow);
        updateTotalPrice();
    });

    // lấy các sản phẩm của công ty cung cấp
    $(document).on('change', 'select[name="supplier_id"]', function () {
        let id = $(this).val();
        let domSelectProductId = $('select[name="product_id"]');
        let domProductContainer = $('.product-container');
        let domTotalPrice = $('input[name="total"]');

        domProductContainer.html('');
        domSelectProductId.attr('disabled', 'disabled').html('<option value="">-- Chọn sản phẩm --</option>');
        domTotalPrice.val('0');
        if (id === '') {
            return;
        }

        callApi(urlGetProductsOfSupplier, 'get', {id:id}).then((data) => {
            let dom = '';
            if (data && data.products) {
                data.products.map((item, i) => {
                    dom += `<option value="${item.id}" data-price="${item.price_in}">${item.name}</option>`
                });
            }
            domSelectProductId.removeAttr('disabled').append(dom);
        });
    });
});
