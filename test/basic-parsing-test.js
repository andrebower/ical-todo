var should = require('chai').should(),
    ical = require('../lib/ical'),
    fs = require('fs');

var ics = fs.readFileSync('./test/test-ics/basic-example.ics',{encoding:'utf8'});
ics = ics.replace(/\r\n|\n/g,'\r\n');
var util = require('util');



describe('Test ical parsing', function() {
  it('Parsing and stringifiying should be equal to input', function() {
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
