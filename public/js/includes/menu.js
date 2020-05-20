$(document).ready(function () {
    $(document).on('click', '._menu ul li a', function (event) {
        event.preventDefault();
        if ($(this).attr('href') !== '#') {
            window.location.href = $(this).attr('href');
        }
        $(this).toggleClass('active');
        $(this).parent().children('ul').toggle()
    });
});
