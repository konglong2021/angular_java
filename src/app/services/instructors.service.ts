import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Instructor} from "../model/instructor.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  constructor(private  http:HttpClient) { }

  public findAllInstructors(): Observable<Array<Instructor>>{
    return this.http.get<Array<Instructor>>(environment.backendHost + "/instructors/all");
  }
}
