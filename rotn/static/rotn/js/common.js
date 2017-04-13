google.charts.load('current', {'packages': ['corechart']});
$(function () {

    $('#text').keyup(function () {
        var isEnglish = function (text) {
        return /[a-z]/i.test(text);
    };
        var message = $(this).val();
        if (!isEnglish(message)){
            $('#result').text('Only english letters support')
        }
        else {
            if ($('input#decode').is(':checked')) {
                var decode = 1
            }
            var rot_number = $('#number').val();

            $.ajax({
                type: "POST",
                url: "enter/",
                data: {
                    'message': message,
                    'rot_number': rot_number,
                    'decode': decode,
                    'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
                },
                success: function (json) {
                    google.charts.setOnLoadCallback(drawChart(json['freq']));
                    $('#result').text(json['result-text']);
                    $('#possible-answer').text('Possible decoded text(if not enter bigger text): '+ ' '+ json['possible-answer'])
                },

                error: function () {
                    console.log("error");
                }

            });
        };
    });
});


// Load the Visualization API and the corechart package.
//google.charts.load('current', {'packages': ['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
// google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(list_data) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Letters');
    data.addColumn('number', 'Frequency');
    data.addRows(list_data);

    // Set chart options
    var options = {
        'title': 'Letters variation',
        'width': 1200,
        'height': 500,
        'colors': ['#72b9ff']
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

