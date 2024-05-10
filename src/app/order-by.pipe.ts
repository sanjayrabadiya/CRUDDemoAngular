import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], sortBy: string, sortDirection: number): any[] {
    if (!Array.isArray(array) || !sortBy || !sortDirection) {
      return array;
    }

    return array.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * sortDirection;
      } else {
        return (valueA - valueB) * sortDirection;
      }
    });
  }
}