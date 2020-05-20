<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::group(['prefix'=>'product', 'as' => 'product.'],function (){
    Route::get('/index', 'ProductController@index')->name('index');
    Route::get('/create', 'ProductController@create')->name('create');
    Route::post('/create', 'ProductController@store')->name('create');
    Route::get('/detail/{productId}', 'ProductController@detail')->name('detail');
    Route::get('/edit/{productId}', 'ProductController@edit')->name('edit');
    Route::put('/edit/{productId}', 'ProductController@update')->name('edit');
    Route::delete('/delete/{productId}', 'ProductController@delete')->name('delete');
});
