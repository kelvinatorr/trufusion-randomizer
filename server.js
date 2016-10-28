/**
 * Created by Kelvin on 10/27/2016.
 */
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var moment = require('moment');

app.use(express.static('app'));

app.get('/schedule.json', function(req, res){

    const locationHash = {
        'EASTERN': 'e919035038f',
        'BLUE DIAMOND': 'e931487038f',
        'SUMMERLIN': 'e931486038f'
    };

    var startDate = req.query.startDate ? req.query.startDate : moment().format('YYYY-MM-DD');
    var location = req.query.location ? req.query.location : 'EASTERN';

    var url = `https://widgets.healcode.com/widgets/mb/schedules/${locationHash[location.toUpperCase()]}.json?options%5
        Bstart_date%5D=${startDate}`;

    console.log(url);

    var classes = [];

    fs.readFile('output.html', function(err, data) {
        var $ = cheerio.load(data);
        $('table').filter(function () {
            var data = $(this);

            var trs = data.children().slice(1);

            console.log('Number of classes: ', trs.length);

            for(var i = 0; i < trs.length; i++) {
                var cheerioTr = $(trs[i]);
                var fitnessClass = {};
                // get class time
                var startTime = cheerioTr.find('.hc_starttime').text().trim();
                var endTime = cheerioTr.find('.hc_endtime').text().trim();
                fitnessClass.time = startTime + ' ' + endTime;
                // get class name
                fitnessClass.name = cheerioTr.find('.classname').children().first().text().trim();
                // get instructor
                var tDTrainerSpan = cheerioTr.find('td.trainer').children();
                var mainInstructor = tDTrainerSpan.first().children().first().text().trim();
                var subInstructor = '';
                if(tDTrainerSpan.children().length > 1) {
                    subInstructor = ' (sub for ' + tDTrainerSpan.children().last().children().first().text().trim() + ')';
                }
                fitnessClass.instructor = mainInstructor + subInstructor;
                classes.push(fitnessClass);
            }

            res.send(JSON.stringify(classes));
        });
    });



    //request(url, function(error, response, responsePayload){
    //    if(!error) {
    //        var responseJSON = JSON.parse(responsePayload);
    //        //console.log(responseJSON.contents);
    //        var $ = cheerio.load(responseJSON.contents);
    //        $('table').filter(function () {
    //            var data = $(this);
    //
    //            var trs = data.children().slice(1);
    //
    //            console.log('Number of classes: ', trs.length);
    //
    //            for(var i = 0; i < trs.length; i++) {
    //                var cheerioTr = $(trs[i]);
    //                var fitnessClass = {};
    //                // get class time
    //                var startTime = cheerioTr.find('.hc_starttime').text().trim();
    //                var endTime = cheerioTr.find('.hc_endtime').text().trim();
    //                fitnessClass.time = startTime + ' ' + endTime;
    //                // get class name
    //                fitnessClass.name = cheerioTr.find('.classname').children().first().text().trim();
    //                // get instructor
    //                var tDTrainerSpan = cheerioTr.find('td.trainer').children();
    //                var mainInstructor = tDTrainerSpan.first().children().first().text().trim();
    //                var subInstructor = '';
    //                if(tDTrainerSpan.children().length > 1) {
    //                    subInstructor = ' (sub for ' + tDTrainerSpan.children().last().children().first().text().trim() + ')';
    //                }
    //                fitnessClass.instructor = mainInstructor + subInstructor;
    //                classes.push(fitnessClass);
    //            }
    //
    //            res.send(JSON.stringify(classes, null, 4));
    //        });
    //
    //
    //
    //    }
    //    //fs.writeFile('output.html', responseJSON.contents, function(err){
    //    //    console.log('File successfully written! - Check your project directory for the output.json file');
    //    //});
    //
    //
    //});
});

app.listen(8081);
exports = module.exports = app;