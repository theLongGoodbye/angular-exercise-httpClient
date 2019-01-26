import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';

const log = console.log.bind(console, '**uploaderService')

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private http: HttpClient,) { }

  upload(file: File) {
    if (!file) {return}
    // COULD HAVE WRITTEN:
    // return this.http.post('/upload/file', file, {
    //   reportProgress: true,
    //   observe: 'events'
    // }).pipe(

    //这段英文注解很重要
    // Create the request object that POSTs the file to an upload endpoint.
    // The `reportProgress` option tells HttpClient to listen and return
    // XHR progress events.
    const req = new HttpRequest('POST', 'assets/upload', file, {
      reportProgress: true
    })

    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    return this.http.request(req)
      .pipe(
        map(event => this.getEventMessage(event, file)),
        tap(message => log('message', message)),
        last(),
        catchError(this.handleError(file))
      )

  }

  //根据发送的 req 返回过来的 HttpEventType 类型来返回相应的响应
  private getEventMessage(event: HttpEvent<any>, file) {
    log('执行')
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file '${file.name}' of size ${file.size}`

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total)
        return `File "${file.name}" is ${percentDone}% uploaded`

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  /**
   * Returns a function that handles Http upload failures.
   * @param file - File object for file being uploaded
   *
   * When no `UploadInterceptor` and no server,
   * you'll end up here in the error handler.
   */

  private handleError(file: File) {
    const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof Error) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }

}
