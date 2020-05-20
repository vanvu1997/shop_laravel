$(document).on('change', '#image',  function () {
    readURL(this);
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.pop-up-image').html(`<img src="${e.target.result}" class="img-responsive" style="border: 2px solid #cccccc">`);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
