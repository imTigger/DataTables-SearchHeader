$(document).on( 'init.dt', function (e, settings, json) {
    var $table = $(settings.nTable);

    if (!$table.hasClass('search-header') && !$table.hasClass('search-header')) {
        return;
    }

    // Copy thead to tfoot
    $table.append($('<tfoot/>').append($($table.find("thead tr").clone())));

    // Append fields
    $table.find("tfoot th").each( function (k, v) {
        var column = settings.aoColumns[k];
        if (!column.bSearchable) {
            $(this).html('');
        } else if (column.searchType == 'date') {
            $(this).html('<input type="text" class="date-search-field datepicker"/>');
        } else if (column.searchType == 'date-range') {
            $(this).html('<input type="text" placeholder="From" class="date-range-search-field datepicker datatable-filter" name="' + column.data + '_from"/><input type="text" placeholder="To" class="date-range-search-field datepicker datatable-filter" name="' + column.data + '_to"/>');
        } else {
            $(this).html('<input type="text" class="text-search-field"/>');
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