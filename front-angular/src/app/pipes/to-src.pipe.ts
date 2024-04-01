import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toSrc',
  standalone: true
})
export class ToSrcPipe implements PipeTransform {
  transform(value: File): string {
    return URL.createObjectURL(value);
  }
}
