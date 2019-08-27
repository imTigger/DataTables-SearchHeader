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
        var fieldName = column.name ? column.name : column.data;

        $tfoot.append($th);

        if (!column.bSearchable) {
            $th.html('');
        } else if (column.searchType == 'select') {
            $th.html('<select style="width: 100%" class="search-field" name="' + fieldName + '"></select>');
            $th.find('select').append('<option value=""></option>');

            // Check if searchOptions is array/object
            if (column.searchOptions && Object.keys(column.searchOptions).length > 0) {
                for (var i in column.searchOptions) {
                    if (column.searchOptions[i].key && column.searchOptions[i].value) { // Is searchOptions key-value pair?
                        $th.find('select').append('<option value="' + column.searchOptions[i].key + '">' + column.searchOptions[i].value + '</option>');
                    } else if (!Array.isArray(column.searchOptions)) { // Is searchOptions object?
                        $th.find('select').append('<option value="' + i + '">' + column.searchOptions[i] + '</option>');
                    } else { // Is searchOptions string array?
                        $th.find('select').append('<option value="' + column.searchOptions[i] + '">' + column.searchOptions[i] + '</option>');
                    }
                }
            }
        } else if (column.searchType == 'date') {
            $th.html('<input type="text" class="search-field show-date-picker" name="' + fieldName + '"/>');
        } else if (column.searchType == 'date-range') {
            $th.html('<input type="text" class="search-field show-date-range-picker"/>');
        } else if (column.searchType == 'datetime') {
            $th.html('<input type="text" class="search-field show-datetime-picker"/>');
        } else if (column.searchType == 'datetime-range') {
            $th.html('<input type="text" class="search-field show-datetime-range-picker"/>');
        } else {
            $th.html('<input type="text" class="search-field" name="' + fieldName + '"/>');
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
        var column = settings.aoColumns[that.index()];
        
        var $header = $table.find('tfoot th:nth-child(' + parseInt(this.index() + 1) + ')');
        var $input = $header.find('input.search-field, select.search-field');
        var throttleSearch = $.fn.dataTable.util.throttle(
            function (val) {
                that.search(val).draw();
            },
            settings.searchDelay
        );

        $input
            .off()
            .on('keyup.DT change', function () {
                if (that.search() !== this.value && (!column.searchMinLength || this.value.length === 0 || this.value.length >= column.searchMinLength)) {
                    throttleSearch(this.value);
                }
            })
            .on('keypress.DT', function (e) {
                /* Prevent form submission */
                if (e.keyCode == 13) {
                    return false;
                }
            });
    });

    var render = function () {
        dt.columns().every(function () {
            var index = this.index() + 1;
            var responsiveVisibility = typeof dt.responsive === 'undefined' || !dt.responsive.hasHidden() || this.responsiveHidden();
            var visibility = this.visible() && responsiveVisibility;

            $table.find('tfoot th:nth-child(' + index + ')').toggle(visibility);
        });
    }

    // Responsive Table
    dt.on('responsive-resize', function (e, datatable, columns) {
        render();
    });

    // Column visibility
    dt.on('column-visibility', function (e, datatable, column, visible) {
        render();
    });

    render();
});