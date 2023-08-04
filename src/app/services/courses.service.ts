import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PageResponse} from "../model/page.response.model";
import {Course} from "../model/course.model";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  public searchCourses(keyword:string,currentPage:number,pageSize:number):Observable<PageResponse<Course>> {
    return this.http.get<PageResponse<Course>>(environment.backendHost +"/course?keyword=" + keyword + "&page=" + currentPage+"&size="+pageSize);
  }

  public deleteCourse(courseId:number){
    return this.http.delete(environment.backendHost + "/course/"+ courseId);
  }

  public saveCourse(course:Course): Observable<Course>{
    return this.http.post<Course>(environment.backendHost + "/course",course);
  }

  public updateCourse(course:Course,courseId:number): Observable<Course>{
    console.log(course);
    return this.http.put<Course>(environment.backendHost + "/course/"+ courseId,course);
  }
}
