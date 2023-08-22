import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private quickChartApiUrl = 'https://quickchart.io/chart';
  constructor(private http: HttpClient) { }

  // generateChart(type:string,labels: string[],dataSetsLabel: string,backgroundColor: string[],sellingData: number, repairedData: number) {
  //   const chartData = {
  //     type: type,
  //     data: {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: dataSetsLabel,
  //           data: [sellingData, repairedData],
  //           backgroundColor: backgroundColor,
  //         },
  //       ],
  //     },
  //   };

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   };

  //   return this.http.get<{ url: string }>(`${this.quickChartApiUrl}width=500&height=300&chart=${JSON.stringify(chartData)}`, httpOptions);
  // }

  generateChart(type: string,labels: string[],dataSetsLabel: string,backgroundColor: string[],sellingData: number,repairedData: number) {
    const chartData = {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: dataSetsLabel,
            data: [sellingData, repairedData],
            backgroundColor: backgroundColor,
          },
        ],
      },
    };

    const encodedChartData = encodeURIComponent(JSON.stringify(chartData));
    const encodedUrl = `${this.quickChartApiUrl}?width=500&height=300&chart=${encodedChartData}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return encodedUrl;
    // return this.http.get<{ url: string }>(encodedUrl, httpOptions);
  }
}
