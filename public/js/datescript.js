$(function() {

    // Set the default dates, uses sugarjs' methods
    var startDate   = Date.create().addDays(-6),    // 6 days ago
        endDate     = Date.create();                // today

    var range = $('#range');

    // Show the dates in the range input
    range.val(startDate.format('{MM}/{dd}/{yyyy}') + ' - ' + endDate.format('{MM}/{dd}/{yyyy}'));

    range.daterangepicker({

        startDate: startDate,
        endDate: endDate,

        ranges: {
            'Today': ['today', 'today'],
            'Yesterday': ['yesterday', 'yesterday'],
        }
    });

});
