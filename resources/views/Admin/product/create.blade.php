<p><a class="btn btn-primary" href="/{{ url('/product/index') }}">back</a></p>
    <div class="col-xs-4 col-xs-offset-4">
        <h4>Them san pham</h4>
        <form action="{{ url('/product/create') }}" method="post">
            <input type="hidden" id="_token" name="_token" value="{{ csrf_token() }}"/>
            <div class="form-group">
                <label for="name">Ten san pham</label>
                <input type="text" class="form-control" id="name" name="name" placeholder="Ten san pham" maxlength="255" required />
            </div>
            <div class="form-group">
                <label for="price">gia</label>
                <input type="text" class="form-control" id="price"  name="price" placeholder="gia" maxlength="20" required />
            </div>
            <button type="submit" class="btn btn-primary">Them san pham</button>
        </form>
    </div>
