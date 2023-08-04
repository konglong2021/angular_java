import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup,Validators} from "@angular/forms";
import {CoursesService} from "../../services/courses.service";
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Course} from "../../model/course.model";
import {InstructorsService} from "../../services/instructors.service";
import {Instructor} from "../../model/instructor.model";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {

   searchFormGroup!:FormGroup;
   courseFormGroup!:FormGroup;
   updateCourseFormGroup!:FormGroup;
   pageCourses$!: Observable<PageResponse<Course>>;
   instructors$!: Observable<Array<Instructor>>
   currentPage:number = 0;
   pageSize:number = 10;
   errorMessage!:string;
   errorInstructorMessage!:string;
   submitted:boolean = false;
   defaultInstructor!: Instructor;

  constructor(private modalService: NgbModal,private fb:FormBuilder,
              private courseService:CoursesService,
              private instructorService:InstructorsService) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.courseFormGroup = this.fb.group({
      courseName:["", Validators.required],
      courseDuration:["",Validators.required],
      courseDescription:["",Validators.required],
      instructor:[null,Validators.required],
    })
    this.handleSearchCourses()
  }


  getModal(content: any) {
    this.fetchInstructors();
    this.modalService.open(content, {size: 'xl'})
    // console.log("Hello world")
  }


  handleSearchCourses() {
    // console.log(this.searchFormGroup.value.keyword);
    let keyword = this.searchFormGroup.value.keyword;
    this.pageCourses$ = this.courseService.searchCourses(keyword,this.currentPage,this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchCourses();
  }

  handleDeleteCourse(c: Course) {
    let conf = confirm("Are you sure?")
    if(!conf) return;
    this.courseService.deleteCourse(c.courseId).subscribe({
      next:() => {
        this.handleSearchCourses();
      },
      error:err => {
        alert(err.message)
        console.log(err)
      }
    })
  }

  fetchInstructors() {
  this.instructors$ = this.instructorService.findAllInstructors().pipe(
    catchError(err => {
      this.errorInstructorMessage = err.message;
      return throwError(err);
    })
  );

  }

  onCloseMadal(modal: any) {
    this.courseFormGroup.reset();
    modal.close();
  }

  onSaveCourse(modal: any) {
    this.submitted = true;
    if(this.courseFormGroup.invalid) return;
    this.courseService.saveCourse(this.courseFormGroup.value).subscribe({
      next:() =>{
        alert("success Saving Course");
        this.handleSearchCourses();
        this.courseFormGroup.reset();
        this.submitted = false;
        modal.close();
      },error: error =>{
        alert(error.message);
      }
    })

  }

  getUpdateModel(c: Course, updateContent: any) {
    this.fetchInstructors();
    this.updateCourseFormGroup = this.fb.group({
      courseId:[c.courseId,Validators.required],
      courseName:[c.courseName,Validators.required],
      courseDuration:[c.courseDuration,Validators.required],
      courseDescription:[c.courseDescription,Validators.required],
      instructor:[c.instructor,Validators.required],
    })
      this.defaultInstructor = this.updateCourseFormGroup.controls['instructor'].value;
      this.modalService.open(updateContent,{size:'xl'})

  }

  onUpdateCourse(updateModal: any) {
    this.submitted = true;
    if (this.updateCourseFormGroup.invalid) return;
    this.courseService.updateCourse(this.updateCourseFormGroup.value,this.updateCourseFormGroup.controls['courseId'].value).subscribe({
      next: () =>{
        alert("Update success");
        this.handleSearchCourses();
        this.updateCourseFormGroup.reset();
        this.submitted = false;
        updateModal.close();
      },error: err => {
        alert(err.message);
      }
    })
  }
}
