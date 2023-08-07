import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {Instructor} from "../model/instructor.model";
import {environment} from "../../environments/environment";
import {PageResponse} from "../model/page.response.model";
import {runCommand} from "@angular/cli/src/command-builder/command-runner";

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  base_url:String =  environment.backendHost;
  constructor(private  http:HttpClient) { }

  public findAllInstructors(): Observable<Array<Instructor>>{
    return this.http.get<Array<Instructor>>(this.base_url + "/instructors/all");
  }

  public searchInstructors(keyword:string ,currentPage:number ,pageSize:number,): Observable<PageResponse<Instructor>>{
    return this.http.get<PageResponse<Instructor>>(this.base_url + "/instructors?keyword="+keyword+"&page="+currentPage+"&size="+pageSize);
  }

  public saveInstructor(instructor:Instructor): Observable<PageResponse<Instructor>>{
    return this.http.post<PageResponse<Instructor>>(this.base_url + "/instructors",instructor);
  }

  public deleteInstructor(instructorId:number){
    return this.http.delete(this.base_url + "/instructors/"+ instructorId);
  }

  public updateInstructor(instructor:Instructor,instructorId:number):Observable<PageResponse<Instructor>>{
    return this.http.put<PageResponse<Instructor>>(this.base_url + "/instructors/"+instructorId,instructor);
  }
}
