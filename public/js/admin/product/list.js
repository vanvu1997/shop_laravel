var dataCheckedPublish = [];
var dataUnCheckedPublish = [];
var dataCheckedPublishOrigin = [];
var dataUnCheckedPublishOrigin = [];
var isInit = false;
var btnSavePublish = $('.btn-save-publish');

$(document).on('change', 'input[name="publish"]', function () {
    isInit === false && initDataPublishOrigin();
    let id = $(this).data('id');
    let isChecked = $(this).is(':checked');
    let index;
    if (isChecked) {
        $(this).attr('data-publish', 1);
        dataCheckedPublishOrigin.indexOf(id) === -1 && dataCheckedPublish.push(id);
        index = dataUnCheckedPublish.indexOf(id);
        index !== -1 && dataUnCheckedPublish.splice(index, 1);
    } else {
        $(this).attr('data-publish', 0);
        dataUnCheckedPublishOrigin.indexOf(id) === -1 &&  dataUnCheckedPublish.push(id);
        index = dataCheckedPublish.indexOf(id);
        index !== -1 && dataCheckedPublish.splice(index, 1);
    }
    toggleButtonSave();
});

btnSavePublish.click(function () {
    callApi(urlChangePublish, 'put', {_token:csrfToken, checked: dataCheckedPublish, unchecked: dataUnCheckedPublish})
        .then((data) => {
            if (data && data.status === SUCCESS_STATUS) {
                showNotificationMessage(data.message, 'success');
                resetDataPublish();
                toggleButtonSave();
                initDataPublishOrigin();
            }
        });
});

$('.btn-search').click(function () {
    resetDataPublish();
    toggleButtonSave();
    isInit = false;
});

function toggleButtonSave() {
    if (dataCheckedPublish.length > 0 || dataUnCheckedPublish.length > 0) {
        btnSavePublish.removeClass('hidden');
    } else {
        btnSavePublish.addClass('hidden');
    }
}

function initDataPublishOrigin() {
    dataCheckedPublishOrigin = [];
    dataUnCheckedPublishOrigin = [];
    $('input[name="publish"]').map((i, e) => {
        let id = $(e).data('id');
        let isChecked = $(e).attr('data-publish');
        parseInt(isChecked) === 1 ? dataCheckedPublishOrigin.push(id) : dataUnCheckedPublishOrigin.push(id);
    });
    isInit = true;
}

function resetDataPublish() {
    dataCheckedPublish = [];
    dataUnCheckedPublish = [];
}
