function addCommaInNumber(number) {
    return (number + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommaInNumber(number) {
    return (number + '').replace(/,/g, '');
}

function keys(obj) {
    let arr = [];
    for (let element in obj) {
        arr.push(element);
    }
    return arr;
}

function slug(string) {
    var accents = "áàạãảăắằặẵẳâấầậẫẩ" + "éèẹẽẻêếềệễể" + "đ" + "íìịĩỉ" + "óòọõỏôốồộỗổơớờợỡở" + "úùụũủưứừựữử" + "ýỳỵỹỷ";
    var without = "aaaaaaaaaaaaaaaaa" + "eeeeeeeeeee" + "d" + "iiiii" + "ooooooooooooooooo" + "uuuuuuuuuuu" + "yyyyy";
    var map = {'@':' at ', '\u20ac':' euro ', '$':' dollar ', '\u00a5':' yen ', '\u0026':' and ', '\u00e6':'ae', '\u0153':'oe'};
    return string.toLowerCase()
        .replace(new RegExp('[' + accents + ']', 'g'), c => without.charAt(accents.indexOf(c)))
        .replace(new RegExp('[' + keys(map).join('') + ']', 'g'), c => map[c])
        .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
