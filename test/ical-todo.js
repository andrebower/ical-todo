var should = require('chai').should(),
    ical = require('../index');

var ics = 'BEGIN:VCALENDAR \r\n'+
'VERSION:2.0\r\n'+
'PRODID:http://www.example.com/calendarapplication/\r\n'+
'METHOD:PUBLISH\r\n'+
'BEGIN:VEVENT\r\n'+
'UID:461092315540\r\n'+
'ORGANIZER;CN="Alice Balder, Example Inc.":MAILTO:alice@example.com\r\n'+
'LOCATION:Somewhere\r\n'+
'SUMMARY:Eine Kurzinfo\r\n'+
'DESCRIPTION:Beschreibung des Termines geht hier noch weiter\r\n'+
'CLASS:PUBLIC\r\n'+
'RRULE:FREQ=WEEKLY;COUNT=10\r\n'+
'DTSTART:20060910T220000Z\r\n'+
'DTEND:20060919T215900Z\r\n'+
'DTSTAMP:20060812T125900Z\r\n'+
'CUSTOM-FIELD:Should work\r\n'+
'END:VEVENT\r\n'+
'BEGIN:VEVENT\r\n'+
'UID:461092315540\r\n'+
'ORGANIZER;CN="Alice Balder, Example Inc.":MAILTO:alice@example.com\r\n'+
'LOCATION:Somewhere\r\n'+
'SUMMARY:Eine Kurzinfo 2\r\n'+
'DESCRIPTION:Beschreibung des Termines geht hier noch weiter\r\n'+
'CLASS:PUBLIC\r\n'+
'DTSTART:20060910T220000Z\r\n'+
'DTEND:20060919T215900Z\r\n'+
'DTSTAMP:20060812T125900Z\r\n'+
'CUSTOM-FIELD:Should work\r\n'+
'END:VEVENT\r\n'+
'END:VCALENDAR ';

var util = require('util');



describe('Test ical parsing', function() {
  it('uid should be set correctly', function() {
    (new ical.Component(ical.parse(ics))).toString().should.equal(ics);
    
  });
  it('Custom fields should work', function() {
    var comp = new ical.Component(ical.parse(ics));
    var vevent = comp.getFirstSubcomponent("vevent");
    var summary = vevent.getFirstPropertyValue("custom-field");
    summary.should.equal('Should work');
  });
  it('RRule 2 iterations should compute next Date correctly', function() {
    var comp = new ical.Component(ical.parse(ics));
    var vevent = comp.getFirstSubcomponent("vevent");
    var rrule = vevent.getFirstPropertyValue("rrule");
    var dtstart = vevent.getFirstPropertyValue("dtstart");
    var iter = rrule.iterator(dtstart);
    iter.next();
    var date = iter.next().toICALString();
    date.should.equal('20060917T220000Z');
  });
  it('Vevent 2 should not have RRule', function() {
  	var comp = new ical.Component(ical.parse(ics));
    var vevent = comp.getAllSubcomponents("vevent");
    var rrule = vevent[1].getFirstPropertyValue("rrule");
    should.not.exist(rrule);
  });
  it('Vevent 2 should have correct description', function() {
  	var comp = new ical.Component(ical.parse(ics));
    var vevent = comp.getAllSubcomponents("vevent");
    var summary = vevent[1].getFirstPropertyValue('summary');
    summary.should.equal('Eine Kurzinfo 2');
  });
});
