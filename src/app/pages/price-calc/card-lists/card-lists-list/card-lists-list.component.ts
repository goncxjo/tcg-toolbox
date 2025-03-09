import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { CardListList, CardListService } from '../../../../backend';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { faPlus, faSearch, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import _ from 'lodash';
import { ActionButtonComponent } from '../../../../shared/ag-grid/action-button/action-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../../shared/modals/confirm/confirm.component';
import { ToastrService } from 'ngx-toastr';
import { AgGridService } from '../../../../core/services/ag-grid.service';
import { CardListFiltersComponent } from '../card-list-filters/card-list-filters.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-lists-list',
  standalone: true,
  imports: [CardListFiltersComponent, FontAwesomeModule, AgGridAngular, AsyncPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './card-lists-list.component.html',
  styleUrl: './card-lists-list.component.scss'
})
export class CardListsListComponent implements AfterViewInit {
  @ViewChild('cardListFilters') filters!: CardListFiltersComponent;

  plusIcon = faPlus;
  searchIcon = faSearch;
  warningIcon = faWarning;

  rowData$!: Observable<CardListList[]>;
  colDefs: ColDef[] = [
    {
      field: "actions",
      headerName: "Acciones",
      cellRenderer: ActionButtonComponent,
      cellRendererParams: {
        onView: this.onViewBtnClick.bind(this),
        onEdit: this.onEditBtnClick.bind(this),
        onDelete: this.onDeleteBtnClick.bind(this),
      }
    },
    { field: "id", hide: true },
    { field: "name", headerName: "Nombre" },
    {
      field: "qty", headerName: "Cant. Cartas (Total)",
      valueGetter: params => {
        return `${params.data.cards.length} (${_.sumBy(params.data.cards, 'qty')})`;
      }
    },
    { field: "createdAt", headerName: "Fecha creación", sort: "desc", cellRenderer: (data: any) => { return data.value ? (new Date(data.value)).toLocaleString() : '' } },
    { field: "updatedAt", headerName: "Fecha modif.", sort: "desc", cellRenderer: (data: any) => { return data.value ? (new Date(data.value)).toLocaleString() : '' } }
  ];
 
  onEditBtnClick(e: any) {
    const id = e.rowData.id;
    this.router.navigate(['/price-calc','card-lists', id, 'edit']);
  }
  
  onViewBtnClick(e: any) {
    const id = e.rowData.id;
    this.router.navigate(['/price-calc','card-lists', id]);
  }
  
  onDeleteBtnClick(e: any) {
    const entity = e.rowData;
    this.openConfirm(entity);
  }

  openConfirm(entity: CardListList) {
    const onSuccess = () => {
      this.toastr.success('El registro ha sido eliminado.', 'Eliminado');
      this.applyFilter();
    }

    const onModalSuccess = (result: string) => {
      if (result === 'cancel') {
        return;
      }
      try {
        this.service.delete(entity.id).then(onSuccess, onError);
      } catch (error) {
        this.toastr.error('Ha ocurrido un problema', 'Error');
      }
    }
    
    const onError = () => {
      this.toastr.error('Ha ocurrido un error', 'Error');
    }
  
    const modalInstance = this.modalService.open(ConfirmComponent);
    modalInstance.componentInstance.title = `Eliminar`;
    modalInstance.componentInstance.message = `¿Estás seguro que querés eliminar la lista de cartas '${entity.name}'?`;
    modalInstance.result.then(onModalSuccess, onError);
  }

  form = this.buildForm();
  
  private buildForm(): FormGroup {
    return this.formBuilder.group({});
  }

  constructor(
    private router: Router,
    private service: CardListService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public agGridService: AgGridService,
    private formBuilder: FormBuilder,
  ) { }

  applyFilter() {
    this.rowData$ = this.service.getAll(this.filters.value());
  }

  ngAfterViewInit(): void {
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.rowData$.subscribe().unsubscribe();
  }
}
