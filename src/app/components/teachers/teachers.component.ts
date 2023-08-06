import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Instructor} from "../../model/instructor.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {InstructorsService} from "../../services/instructors.service";

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})


export class TeachersComponent implements OnInit {

  searchFormGroup!:FormGroup;
  pageInstructor$!: Observable<PageResponse<Instructor>>;
  currentPage:number = 0;
  pageSize:number = 10;
  errorMessage!:string;


  constructor(private modalService: NgbModal,private fb:FormBuilder,
              private instructorService:InstructorsService) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })

    this.handleSearchInstructors();

  }


  getModal(content: any){
    this.modalService.open(content, { size: 'xl' })
    console.log("Hello world")
  }

  handleSearchInstructors()
  {
    let keyword = this.searchFormGroup.value.keyword;
    this.pageInstructor$ = this.instructorService.searchCourse(keyword,this.currentPage,this.pageSize).pipe(
      catchError( err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );

    console.log(this.pageInstructor$);
  }

}

