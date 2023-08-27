import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description'
})
export class DescriptionPipe implements PipeTransform {

  transform(value: string): string {
    return value.length <= 200 ? value : `${value.slice(0, 200)}...`;
  }

}
