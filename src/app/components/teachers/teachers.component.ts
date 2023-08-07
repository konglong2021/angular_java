import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Instructor} from "../../model/instructor.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InstructorsService} from "../../services/instructors.service";
import {User} from "../../model/user.model";

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
  currentPage:number = 0;
  pageSize:number = 10;
  errorMessage!:string;
  submmited:boolean = false;

  constructor(private modalService: NgbModal,private fb:FormBuilder,
              private instructorService:InstructorsService) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.createFormGroup = this.fb.group({
      firstName:["",Validators.required],
      lastName:["",Validators.required],
      summary:["",Validators.required],
      user: this.fb.group({
        email:["",Validators.required],
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
}

