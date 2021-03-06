function Select() {
    $.ajax({
        url: "./api/shop",
        headers: {
            "Api": $.cookie("BSK_API"),
            "Key": $.cookie("BSK_KEY"),
            "Accept": "application/json"
        },
        method: "GET",
        dataType: "JSON",
        data: "packet",
        success: function (response) {
            $.each(response.data, function (i, val) {
                $('#packet').append('<option value="' + val.id + '" data-price="' + val.value + '">' + val.name + '</option>');
            });
        }
    });
    $('#packet').change(function () {
        $('#total').val(1);
        $('#price, #values').val($(this).find(':selected').data('price'));
    });
    $('#total').change(function () {
        var price = $('#values').val();
        $('#price').val(price * $(this).val());
    });
};

function Tables() {
    var Table = $('#tables').DataTable({
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: "./api/shop?data",
            headers: {
                "Api": $.cookie("BSK_API"),
                "Key": $.cookie("BSK_KEY"),
                "Accept": "application/json"
            },
            method: "POST"
        },
        "columns": [{
                "data": "packet",
            },
            {
                "data": "total"
            },
            {
                "data": "price"
            },
            {
                "data": "date"
            },
            {
                "data": "id",
                className: 'dt-body-right',
                render: function (data, type, row) {
                    return (row.status == 1 || row.status == 'true' ?
                        '<button class="btn btn-success btn-sm" title="Approve"><i class="fa fa-check"></i> Approve</button>' :
                        '<div class="btn-group">' +
                        '<button class="btn btn-warning btn-sm" title="Pending"><i class="fa fa-hourglass-half"></i></button>' +
                        '<button data-toggle="dropdown" class="btn btn-primary btn-sm"><i class="fa fa-cog"></i></button>' +
                        '<div role="menu" class="dropdown-menu dropdown-menu-right">' +
                        '<a class="dropdown-item" data-toggle="modal" href="#add-data" data-value="' + row.id + '" title="Edit"><i class="fa fa-edit"></i> Edit</a>' +
                        '<a class="dropdown-item" data-toggle="modal"  href="#delete" data-value="' + row.id + '" data-target="shop" title="Delete"><i class="fa fa-trash"></i> Delete</a>' +
                        '</div>' +
                        '</div>'
                    );
                }
            }
        ],
        oLanguage: {
            sLengthMenu: "_MENU_",
            sSearch: "",
            sSearchPlaceholder: "Search...",
            oPaginate: {
                sPrevious: "<i class='fa fa-backward'></i>",
                sNext: "<i class='fa fa-forward'></i>"
            }
        },
        aLengthMenu: [
            [5, 10, 15, 20, 50, 75, -1],
            [5, 10, 15, 20, 50, 75, "All"]
        ],
        order: [
            [4, 'desc']
        ],
        iDisplayLength: 10
    });
};

function Action() {
    $('body').on('click', 'a[href="#add-data"]', function () {
        var id_data = $(this).data('value');
        $('#id').val(id_data);
        $('#form-data').trigger('reset');
        $.ajax({
            url: "./api/shop",
            headers: {
                "Api": $.cookie("BSK_API"),
                "Key": $.cookie("BSK_KEY"),
                "Accept": "application/json"
            },
            method: "GET",
            dataType: "JSON",
            data: {
                "detail": id_data
            },
            success: function (detail) {
                if (detail.status) {
                    $.each(detail.data, function (i, show) {
                        $('#' + i).val(show);
                    });
                }
                $('#values').val($('#packet').find(':selected').data('price'));
            }
        });
    });
};

(function () {
    'use strict';
    Select();
    Tables();
    Action();
})();