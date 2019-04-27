import { Injectable } from '@angular/core'
import { IpcRenderer,dialog } from 'electron'


@Injectable({
  providedIn: 'root',
})
export class FileService {
  private ipc: IpcRenderer
  public projects: Array<{file:string,data:Object}> = []
  public currentModule:string;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer
      } catch (error) {
        throw error
      }
    } else {
      console.warn('Could not load electron ipc')
    }
  }

  async getFiles() {
    return new Promise<string[]>((resolve, reject) => {
      this.ipc.once("getFilesResponse", (event, arg) => {
        if(arg){
          this.projects.push(arg)
          resolve(arg)
        } else{
          reject()
        }
      });
      this.ipc.send("getFiles");
    });
  }

  copyCode(data){
    return this.ipc.send('copyCode',data)
  }

  noFileError(error){
    return this.ipc.send('onFileError',error)
  }
}
