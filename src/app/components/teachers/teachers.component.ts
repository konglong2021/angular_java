import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Instructor} from "../../model/instructor.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InstructorsService} from "../../services/instructors.service";
import {User} from "../../model/user.model";
import {EmailExistsValidator} from "../../validators/emailexists.validator";
import {UsersService} from "../../services/users.service";
import {Course} from "../../model/course.model";
import {CoursesService} from "../../services/courses.service";

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})


export class TeachersComponent implements OnInit {

  searchFormGroup!:FormGroup;
  createFormGroup!:FormGroup;
  updateFormGroup!:FormGroup;
  pageInstructor$!: Observable<PageResponse<Instructor>>;
  saveInstructor$!: Observable<PageResponse<Instructor>>;
  instructorCourse$!: Observable<PageResponse<Course>>;
  instructorSaveId!: Instructor;
  currentPage:number = 0;
  instructorCourseCurrentPage:number = 0;
  pageSize:number = 10;
  errorMessage!:string;
  submmited:boolean = false;

  constructor(private modalService: NgbModal,private fb:FormBuilder,
              private instructorService:InstructorsService,
              private usersService:UsersService,
              private courseService:CoursesService) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.createFormGroup = this.fb.group({
      firstName:["",Validators.required],
      lastName:["",Validators.required],
      summary:["",Validators.required],
      user: this.fb.group({
        email:["",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],[EmailExistsValidator.validate(this.usersService)]],
        password:["",Validators.required],
      })
    })

    this.handleSearchInstructors();

  }


  getModal(content: any){
    this.modalService.open(content, { size: 'xl' })
  }

  handleSearchInstructors()
  {
    let keyword = this.searchFormGroup.value.keyword;
    this.pageInstructor$ = this.instructorService.searchInstructors(keyword,this.currentPage,this.pageSize).pipe(
      catchError( err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );

  }

  gotoPage(page:number) {
    this.currentPage = page;
    this.handleSearchInstructors();
  }

  onCloseMedal(modal: any) {

  }

  onSaveMedal(modal: any) {
    this.submmited = true;
    if (this.createFormGroup.invalid) return;

    this.instructorService.saveInstructor(this.createFormGroup.value).subscribe({
      next:() => {
        alert("successfull save instructor");
        this.createFormGroup.reset();
        this.submmited = false;
        modal.close();
      },
      error: err => {
        alert(err.message);
      }
    });
  }

  handleDeleteInstructor(i: Instructor) {
    let conf = confirm("Are you sure?")
    if(!conf) return;
    this.instructorService.deleteInstructor(i.instructorId).subscribe({
      next:() =>{
        alert("Instructor has been deleted!");
        this.handleSearchInstructors();
      },error: err => {
        alert(err.message);
      }
    });
  }

  onUpdateMedal(updateModal: any) {
    this.submmited = true;
    if (this.updateFormGroup.invalid) return;
    this.instructorService.updateInstructor(this.updateFormGroup.value,this.updateFormGroup.value.instructorId).subscribe({
      next:() =>{
        alert("update successfull");
        this.submmited = false;
        this.handleSearchInstructors();
        this.updateFormGroup.reset();
        updateModal.close();
      },error:err => {
        alert(err.message);
      }
    });

  }

  updateInstructor(i: Instructor, updateContent: any) {
    this.updateFormGroup = this.fb.group({
      instructorId:[i.instructorId,Validators.required],
      firstName:[i.firstName,Validators.required],
      lastName:[i.lastName,Validators.required],
      summary:[i.summary,Validators.required],
    })
    this.modalService.open(updateContent,{size:'xl'})
  }


  InstructorCourses(i: Instructor, instructorCourses: any) {
    this.instructorSaveId = i;
    this.getInstructorCourses(this.instructorSaveId);
    this.modalService.open(instructorCourses,{size:'xl'})
  }

  getInstructorCourses(instructor:Instructor){
    this.instructorCourse$ = this.instructorService.getCoursesByInstructor(instructor.instructorId,this.instructorCourseCurrentPage,this.pageSize).pipe(
      catchError ( err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }


  gotoCoursePage(page: number) {
    this.instructorCourseCurrentPage = page;
    this.getInstructorCourses(this.instructorSaveId);
  }
}

