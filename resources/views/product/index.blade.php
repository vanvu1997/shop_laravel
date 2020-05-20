<!DOCTYPE html>
<?php
use App\Model\Product;
?>
<html>
<head>
    <meta charset="utf-8">
    <title>Danh sach san pham</title>
</head>
<body>

    <table  border="1">
        <caption> Danh sách</caption>
        <thead>
            <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th> Ngày tạo</th>
                <th>sửa</th>
                <th>xóa</th>
            </tr>
        </thead>
        <tbody>
<?php $product = Product::get();
foreach ($product as $value):?>
        <tr>
            <td>{{$value[name]}}</td>
            <td>data1</td>
            <td>data1</td>
            <td>data1</td>
            <td>data1</td>
            <td>data1</td>
        </tr>
<?php endforeach;?>
        </tbody>
    </table>
</body>
</html>
