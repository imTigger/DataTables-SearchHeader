$(document).on( 'init.dt', function (e, settings, json) {
    var $table = $(settings.nTable);

    if (!$table.hasClass('search-header') && !$table.hasClass('search-header')) {
        return;
    }

    // Copy thead to tfoot
    $table.append($('<tfoot/>').append($($table.find("thead tr").clone())));

    // Append fields
    $table.find("tfoot th").each( function (k, v) {
        if (settings.aoColumns[k].bSearchable) {
            $(this).html('<input type="text" class="simple-search-field"/>');
        } else {
            $(this).html('');
        }
    });

    var dt = $table.dataTable().api();

    dt.columns().every( function () {
        var that = this;

        $('input', 'tfoot th:nth-child(' + parseInt(this.index() + 1) + ')').on('keyup change', function () {
            that.search(this.value).draw();
        });
    } );
});