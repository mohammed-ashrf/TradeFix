import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetdateService {
  constructor() { }

  // getCurrentDate(): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     if (navigator.onLine) {
  //       const ntpServer = 'time.nist.gov';
  //       this.getNTPTime(ntpServer)
  //         .then(ntpDate => {
  //           const dateString = this.formatDate(ntpDate);
  //           resolve(dateString);
  //         })
  //         .catch(ntpError => {
  //           console.error('Error retrieving date from NTP:', ntpError);
  //           this.retrieveTimeZoneDate()
  //             .then(timeZoneDate => {
  //               const dateString = this.formatDate(timeZoneDate);
  //               resolve(dateString);
  //             })
  //             .catch(timeZoneError => {
  //               console.error('Error retrieving date based on user location:', timeZoneError);
  //               // Fallback to system date
  //               const currentDate = new Date();
  //               const dateString = this.formatDate(currentDate);
  //               resolve(dateString);
  //             });
  //         });
  //     } else {
  //       console.log('No network connection');
  //       this.retrieveTimeZoneDate()
  //         .then(timeZoneDate => {
  //           const dateString = this.formatDate(timeZoneDate);
  //           resolve(dateString);
  //         })
  //         .catch(timeZoneError => {
  //           console.error('Error retrieving date based on user location:', timeZoneError);
  //           // Fallback to system date
  //           const currentDate = new Date();
  //           const dateString = this.formatDate(currentDate);
  //           resolve(dateString);
  //         });
  //     }
  //   });
  // }
  getCurrentDate(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (navigator.onLine) {
        this.retrieveTimeZoneDate()
          .then(timeZoneDate => {
            const dateString = this.formatDate(timeZoneDate);
            resolve(dateString);
          })
          .catch(timeZoneError => {
            console.error('Error retrieving date based on user location:', timeZoneError);
            const ntpServer = 'time.nist.gov';
            this.getNTPTime(ntpServer)
              .then(ntpDate => {
                const dateString = this.formatDate(ntpDate);
                resolve(dateString);
              })
              .catch(ntpError => {
                console.error('Error retrieving date from NTP:', ntpError);
                // Fallback to system date
                const currentDate = new Date();
                const dateString = this.formatDate(currentDate);
                resolve(dateString);
              });
          });
      } else {
        console.log('No network connection');
        // Fallback to system date
        const currentDate = new Date();
        const dateString = this.formatDate(currentDate);
        resolve(dateString);
      }
    });
  }

  private getNTPTime(server: string): Promise<Date> {
    return new Promise<Date>((resolve, reject) => {
      const socket = new WebSocket(`wss://${server}`);
      socket.addEventListener('open', () => {
        const request = new Uint8Array(48);
        request[0] = 0x1b;
        socket.send(request.buffer);
      });
      socket.addEventListener('message', (event) => {
        const response = event.data;
        const timestamp = this.parseNTPResponse(response);
        if (timestamp) {
          const ntpDate = new Date(timestamp);
          resolve(ntpDate);
        } else {
          reject(new Error('Invalid NTP response'));
        }
        socket.close();
      });
      socket.addEventListener('error', (error) => {
        reject(error);
        socket.close();
      });
    });
  }

  private parseNTPResponse(response: ArrayBuffer): number | undefined {
    const byteArray = new Uint8Array(response);
    const seconds = this.readUint32(byteArray, 40);
    const fraction = this.readUint32(byteArray, 44);
    if (seconds && fraction) {
      return (seconds - 2208988800) * 1000 + Math.round(fraction / 4294967296 * 1000);
    }
    return undefined;
  }

  private readUint32(buffer: Uint8Array, offset: number): number {
    return (buffer[offset] << 24) +
      (buffer[offset + 1] << 16) +
      (buffer[offset + 2] << 8) +
      buffer[offset + 3];
  }

  private retrieveTimeZoneDate(): Promise<Date> {
    return new Promise<Date>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const timezoneApiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=R8FHEQHB30S6&format=json&by=position&lat=${latitude}&lng=${longitude}`;
            // Make an API call to retrieve the date based on user's location
            // Replace YOUR_API_KEY with your actual API key
            fetch(timezoneApiUrl)
              .then(response => response.json())
              .then(data => {
                const date = new Date(data.formatted);
                resolve(date);
              })
              .catch(error => {
                reject(error);
              });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported'));
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
