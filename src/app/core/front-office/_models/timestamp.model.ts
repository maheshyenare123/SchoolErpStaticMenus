export class TimestampModel {
   
    date: number;
    day: number;
    hours: number;
    minutes: number;
    month: number;
    nanos: number;
    seconds: number;
    time: number;
    timezoneOffset: number;
    year: number;

    clear() {
        this.date= 0;
        this.day= 0;
        this.hours= 0;
        this.minutes= 0;
        this.month= 0;
        this.nanos= 0;
        this.seconds= 0;
        this.time= 0;
        this.timezoneOffset= 0;
        this.year= 0;
    }
}