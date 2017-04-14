google.charts.load('current', {'packages': ['corechart']});
function isEnglish(text) {
    return /[a-z]/i.test(text);
}
$(function () {
    // when enter text, rotate text
    $('#text').keyup(function () {
        var message = $(this).val();
        if (!isEnglish(message)){
            $('#result').text('Only english letters support')
        }
        else {
            if ($('input#decode').is(':checked')) {
                var decode = 1
            }
            var rot_number = $('#number').val();
            getRotn(message,rot_number,decode);
        }
    });
    // when select number, rotate text
    $('#number').change(function () {
        var message = $('#text').val();
        if ($('input#decode').is(':checked')) {
                var decode = 1
        }
        var rot_number = $(this).val();
        getRotn(message,rot_number,decode);
    });
});


function getRotn(msg,num,dec) {
    $.ajax({
    type: "POST",
    url: "enter/",
    data: {
        'message': msg,
        'rot_number': num,
        'decode': dec,
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
}

function drawChart(list_data) {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Letters');
    data.addColumn('number', 'Frequency');
    data.addRows(list_data);

    var options = {
        'title': 'Letters variation',
        'width': 1100,
        'height': 400,
        'colors': ['#72b9ff']
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

