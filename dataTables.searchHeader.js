$(document).on('init.dt', function (e, settings, json) {
    var $table = $(settings.nTable);

    if (!$table.hasClass('search-header')) {
        return;
    }

    // Copy thead to tfoot
    $tfoot = $('<tfoot/>');

    // Append fields
    for (k in settings.aoColumns) {
        var column = settings.aoColumns[k];
        var $th = $('<th/>');
        
        $tfoot.append($th);
        
        if (!column.bSearchable) {
            $th.html('');
        } else if (column.searchType == 'select' && Object.keys(column.searchOptions).length > 0) {
            $th.html('<select style="width: 100%" class="datatable-search-field simple-search-field select-search-field" name="' + column.data + '"></select>');
            $th.find('select').append('<option value=""></option>');

            for (var i in column.searchOptions) {
                $th.find('select').append('<option value="' + column.searchOptions[i].key + '">' + column.searchOptions[i].value + '</option>');
            }
        } else if (column.searchType == 'date') {
            $th.html('<input type="text" class="datatable-search-field simple-search-field date-search-field datepicker" name="' + column.data + '"/>');
        } else if (column.searchType == 'date-range') {
            $th.html('<input type="text" placeholder="From" class="datatable-search-field date-range-search-field datepicker datatable-filter" name="' + column.data + '_from"/><input type="text" placeholder="To" class="date-range-search-field datepicker datatable-filter" name="' + column.data + '_to"/>');
        } else if (column.searchType == 'datetime') {
            $th.html('<input type="text" class="datatable-search-field simple-search-field datetime-search-field datetimepicker"/>');
        } else if (column.searchType == 'datetime-range') {
            $th.html('<input type="text" placeholder="From" class="datatable-search-field datetime-range-search-field datetimepicker datatable-filter" name="' + column.data + '_from"/><input type="text" placeholder="To" class="datetime-range-search-field datetimepicker datatable-filter" name="' + column.data + '_to"/>');
        } else {
            $th.html('<input type="text" class="datatable-search-field simple-search-field text-search-field" name="' + column.data + '"/>');
        }

        // Hide column if not visible
        if (!column.bVisible) {
            $th.hide();
        }
    };
    
    $table.append($tfoot);

    var dt = $table.dataTable().api();

    // Handle Field Changes
    dt.columns().every(function () {
        var that = this;
        var $header = $table.find('tfoot th:nth-child(' + parseInt(this.index() + 1) + ')');
        var $input = $header.find('input.simple-search-field, select.simple-search-field');

        $input
            .off()
            .on('keyup.DT change', function () {
                if (that.search() !== this.value) {
                    that.search(this.value).draw();
                }
            })
            .on('keypress.DT', function (e) {
                /* Prevent form submission */
                if (e.keyCode == 13) {
                    return false;
                }
            });
    });

    // Responsive Table
    dt.on('responsive-resize', function (e, datatable, columns) {
        for (var i in columns) {
            if (columns[i] === true)
                $table.find('tfoot th:nth-child(' + (parseInt(i) + 1) + ')').show();
            else
                $table.find('tfoot th:nth-child(' + (parseInt(i) + 1) + ')').hide();
        }
    });

    // Column visibility
    dt.on('column-visibility', function (e, datatable, column, visible) {
        if (visible === true)
            $table.find('tfoot th:nth-child(' + column + ')').show();
        else
            $table.find('tfoot th:nth-child(' + column + ')').hide();
    });
});