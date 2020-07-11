import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// asynchronous control returns a JS object with an error code wrapped in a promise or observable
//   instead of returning a plain JS object with an error code (like synchronous)
// <{[key: string]: any}> for a generic type.  The [] do not indicate an array, rather they designate a dynamic value
export const mimeType = (control: AbstractControl):
  Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {

    if (typeof(control.value) === 'string') {
      // create an observable that returns data immediately
      return of(null);  // returns this as valid
    }

    const file = control.value as File;
    const fileReader = new FileReader();

    // synchronous code which just registers a function - won't work
    // fileReader.onloadend = () => {}

    // using rxjs to create our own observable, since fileReader.onloadend won't work
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {
      fileReader.addEventListener("loadend", () => {
        // don't believe the file-type header, peek inside to make sure
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;

        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        switch (header) {
          case "89504e47":  // image/png
            isValid = true;
            break;
          case "ffd8ffe0":  // image/jpeg
          case "ffd8ffe1":  // image/jpeg
          case "ffd8ffe2":  // image/jpeg
          case "ffd8ffe3":  // image/jpeg
          case "ffd8ffe8":  // image/jpeg
            isValid = true;
            break;
          default:            // non-image or unknown
            isValid = false;  // Or you can use the blob.type as fallback
            break;
        }

        if (isValid) {
          observer.next(null);  // return/emit that the file is valid
        } else {
          observer.next({ invalidMimeType: true }); // return/emit that the file is *not* valid
        }

        observer.complete();  // all done
      });
      fileReader.readAsArrayBuffer(file);
    });
    return frObs;
  };
