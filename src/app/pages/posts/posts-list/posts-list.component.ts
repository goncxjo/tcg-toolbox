import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { PostList, PostService } from '../../../backend';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { faPlus, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [FontAwesomeModule, AgGridAngular, AsyncPipe, RouterLink],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent implements OnInit {
  plusIcon = faPlus;
  warningIcon = faWarning;

  rowData$!: Observable<PostList[]>;
  colDefs: ColDef[] = [
    {
      field: "id",
      onCellClicked: (event) => {
        const id = event.data.id;
        this.router.navigate(['posts', id]);
      }
    },
    { field: "name" },
    { field: "createdAt" },
    { field: "modifiedAt" }
  ];

  constructor(
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.rowData$ = this.postService.getAll();
  }
}
