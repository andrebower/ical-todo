var should = require('chai').should(),
    caldav = require('../index');

var ics = 'BEGIN:VCALENDAR \r\n'+
'VERSION:2.0\r\n'+
'PRODID:http://www.example.com/calendarapplication/\r\n'+
'METHOD:PUBLISH\r\n'+
'BEGIN:VEVENT\r\n'+
'UID:461092315540\r\n'+
'ORGANIZER;CN="Alice Balder, Example Inc.":MAILTO:alice@example.com\r\n'+
'LOCATION:Somewhere\r\n'+
'SUMMARY:Eine Kurzinfo\r\n'+
'DESCRIPTION:Beschreibung des Termines\r\n'+
'CLASS:PUBLIC\r\n'+
'RRULE:FREQ=DAILY;COUNT=10\r\n'+
'DTSTART:20060910T220000Z\r\n'+
'DTEND:20060919T215900Z\r\n'+
'DTSTAMP:20060812T125900Z\r\n'+
'CUSTOM-FIELD:Should work\r\n'+
'END:VEVENT\r\n'+
'END:VCALENDAR\r\n';

describe('Test parsing', function() {
  it('uid should be set correctly', function() {
    caldav.parseICS(ics)['461092315540'].uid.should.equal('461092315540');
  });
  it('Custom fields should work', function() {
    caldav.parseICS(ics)['461092315540']['custom-field'].should.equal('Should work');
  });
  it('RRule should be array', function() {
    caldav.parseICS(ics)['461092315540'].rrule.all().should.be.instanceof(Array);
  });
  it('RRule should include 10 dates', function() {
    caldav.parseICS(ics)['461092315540'].rrule.all().should.have.length(10);
  });
});
