import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'tipCalculatorApp';
  bill: number | null = 0;
  billStyle: boolean = false;
  peopleStyle: boolean = false;
  people: number | null = 0;
  tip!: string;
  tipPerc: number = 0;
  total!: string;
  warnBill = false;
  warnPeople = false;

  tipPercentageClick: { [key: string]: boolean } = {
    five: false,
    ten: false,
    fifteen: false,
    twentyfive: false,
    fifty: false,
    custom: false,
  };

  readonly tipCheck: { [key: string]: number } = {
    five: 5,
    ten: 10,
    fifteen: 15,
    twentyfive: 25,
    fifty: 50,
  };
  reset: boolean = false;
  custom!: number | null;
  mobileView!: boolean;

  ngOnInit(): void {
    this.onResize();
    this.tip = this.formatNumberWithTwoDecimals(0);
    this.total = this.formatNumberWithTwoDecimals(0);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log(window.innerWidth);
    if (window.innerWidth < 678) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }

  formatNumberWithTwoDecimals = (number: number): string => {
    return number.toFixed(2).replace(/\.(\d)$/, '.$10');
  };

  handleInputBlur = () => {
    console.log('Input blur');
    this.bill = this.bill ?? 0;
    if (this.bill > 0) {
      this.billStyle = true;
      this.warnBill = false;
    } else {
      this.billStyle = false;
      this.warnBill = true;
    }
  };

  handleInputClick = () => {
    if (this.bill === 0) {
      this.bill = null;
    }
  };

  handlePeopleBlur = () => {
    this.people = this.people ?? 0;
    if (this.people > 0) {
      this.peopleStyle = true;
      this.warnPeople = false;
    } else {
      this.peopleStyle = false;
      this.warnPeople = true;
    }
  };

  handlePeopleClick = () => {
    if (this.people === 0) {
      this.people = null;
    }
  };

  onClickTip = (event: MouseEvent) => {
    const id = (event.target as HTMLDivElement).id;
    console.log(typeof id);
    this.tipPercentageClick[id] = !this.tipPercentageClick[id];
    if (id !== 'custom') this.tipPerc = this.tipCheck[id];
    for (const key in this.tipPercentageClick) {
      if (this.tipPercentageClick.hasOwnProperty(key) && key !== id) {
        this.tipPercentageClick[key] = false;
      }
    }
    this.totalBillCalculation();
    console.log(this.tipPercentageClick);
  };

  onInputChange = (newValue: number) => {
    this.totalBillCalculation();
  };

  onPeopleChange = (newValue: number) => {
    this.totalBillCalculation();
  };

  totalBillCalculation = () => {
    if (this.bill && this.people) {
      this.tip = this.formatNumberWithTwoDecimals(
        (this.tipPerc * (this.bill / 100)) / this.people
      );
      this.total = this.formatNumberWithTwoDecimals(
        (this.bill + this.tipPerc * (this.bill / 100)) / this.people
      );
      this.reset = true;
    } else {
      this.tip = this.formatNumberWithTwoDecimals(0);
      this.total = this.formatNumberWithTwoDecimals(0);
      this.reset = false;
    }
  };

  onClickReset = () => {
    console.log('clicked');
    this.bill = null;
    this.people = null;
    this.custom = null;
    for (const key in this.tipPercentageClick) {
      if (this.tipPercentageClick.hasOwnProperty(key)) {
        this.tipPercentageClick[key] = false;
      }
    }
    this.totalBillCalculation();
  };

  onCustomTipChange = (customTip: number) => {
    if (customTip) {
      this.tipPerc = customTip;
    } else {
      this.tipPerc = 0;
    }
    this.totalBillCalculation();
  };
}
