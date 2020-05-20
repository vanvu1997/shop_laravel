$(document).on('change', 'input[name="is_sub_cate"]', function () {
    $('.parent-cate-container').toggleClass('hidden');
});
$(document).on('change', 'select[name="parent_id"]', function () {
    let isHasDetail = (parseInt($(this).children(':selected').data('has-detail')) === 1);
    $('input[name="has_detail"]').prop('checked', isHasDetail);
});
