import { Inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(
    public spinner: NgxSpinnerService,
  ) {
  }

  spinnerTextLocale: string[] = [];

  // text displayed under the spinner image
  spinnerText = 'Loading...';
  //spinnerText = spinnerText[Math.floor(Math.random() * 4)];

  // index of the text/audio
  index: number = 0;

  // for checking whether a spinner is active on the page
  isActive: boolean = false;

  // get a random index that is not the same as previous index
  getRand() {
    var index = Math.floor(Math.random() * 4);
    if (index == this.index) {
      index = index + 1 % 5;
    }
    return index;
  }

  // change the displayed text
  changeText(text: string) {
    this.spinnerText = text;
  }

  // change the text of spinner
  rotate() {
    var index = this.getRand();
    //console.log('rotate', index);
    this.index = index;
    this.spinnerText = this.spinnerTextLocale[index];
  }

  // change the text and play the audio
  trigger() {
    this.rotate();
  }

  // show the spinner
  show(name = '') {
    this.isActive = true;
    if (name) {
      this.spinner.show(name);
    } else {
      this.spinner.show("global");
    }
  }

  // hide the spinner
  hide(name = '') {
    this.isActive = false;
    if (name) {
      this.spinner.hide(name);
    } else {
      this.spinner.hide("global");
    }

    // reset text (only show text on click, so that it doesn't flicker for short tasks and doesn't distract user)
    this.spinnerText = '';
  }

}
