import { AfterViewInit, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown91, faArrowUp19, faCommentDollar, faEye, faFloppyDisk, faImage, faMinus, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { DolarDataService } from '../../../core/services/dolar.data.service';
import { DataService } from '../../../core/services/data.service';
import { Card, Post } from '../../../backend';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map } from 'rxjs';
import _ from 'lodash';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportImgComponent } from '../../../components/cards/modals/export-img/export-img.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, CurrencyPipe, AsyncPipe, NgbDropdownModule],
  templateUrl: './posts-edit.component.html',
  styleUrl: './posts-edit.component.scss'
})
export class PostsEditComponent implements OnInit, AfterViewInit, OnDestroy {
  sortUpIcon = faArrowUp19;
  sortDownIcon = faArrowDown91;
  imageIcon = faImage;
  closeIcon = faTimes;
  trashIcon = faTrash;
  plusIcon = faPlus;
  minusIcon = faMinus;
  viewIcon = faEye;
  saveIcon = faFloppyDisk;
  dolarIcon = faCommentDollar;

  cards = computed(() => this.dataService.cards());
  total = computed(() => this.dataService.totals());

  form = this.buildForm();

  readonly: boolean = false;
  editMode: boolean = false;
  enableCreateMode: boolean = false;

  customDolarInput = new FormControl();
  customDolar$!: Subscription;
  showCustomDolar: boolean = false;

  title: string = '';
  id: string = '';

  dolarService = inject(DolarDataService);
  dataService = inject(DataService);
  post$!: Observable<Post>;
  
  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
  }

  get noData() {
    return this.cards().length == 0;
  }

  ngOnInit(): void {
    this.post$ = this.activatedRoute.data
      .pipe(
        map(data => {
          const post = data['entity'];
          this.readonly = data['readonly'];
          this.editMode = data['editMode'];
          this.title = data['title'];
          if (post.id) {
            this.dataService.set(post.cards);
            this.dataService.updateMode = true;
            this.id = post.id;
            this.form.patchValue(post);
          } else {
            post.cards = _.clone(this.cards());
          }
          return post;
        })
      );
  }
  
  ngAfterViewInit(): void {
    this.customDolar$ = this.customDolarInput.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(price => {
      this.dolarService.updateVenta(price);
    });
  }

  getPrice(card: Card) {
    return this.dataService.getPrice(card);
  }
  
  removeCard(card: Card) {
    this.dataService.remove(card);
  }

  changeMultiplier(card: Card, i: number) {
    this.dataService.updateCardMultiplier(card, i);
  }


  sort(metodo: string, valor: string) {
    switch (metodo) {
      case 'precio':
        this.cards().sort((a: Card, b: Card) => {
          if (valor == 'asc') {
            return this.getPrice(a) * a.multiplier - this.getPrice(b) * b.multiplier;
          }
          return this.getPrice(b) * b.multiplier - this.getPrice(a) * a.multiplier;
        });
        break;
    
      default:
        break;
    }
  }

	openExportImg() {
		const modalInstance = this.modalService.open(ExportImgComponent, { fullscreen: true });

    modalInstance.componentInstance.cards = this.cards;

    modalInstance.result.then(this.onModalSuccess, onError);

    function onError() { }
  }

  onModalSuccess = (reason: string) => {
    this.loaderService.setHttpProgressStatus(true);
    switch(reason) {
      case 'download':
        this.toastr.success('Se ha exportado la imagen con éxito!', 'Exportar 💾');
        break;
      case 'screenshot':
        this.toastr.success('Se ha copiado la imagen con éxito. Revisa tu portapapeles.', 'Capturar 📸');
        break;
      default:
        this.loaderService.setHttpProgressStatus(false);
        break;
    }

    setTimeout(() => {
      this.loaderService.setHttpProgressStatus(false);
    }, 2000);
  }

  buildForm() {
    return this.formBuilder.group({
      name: '',
      description: '',
    })
  }

  toggleDolar() {
    this.dolarService.setUserCurrency(
      this.dolarService.userCurrency() == 'ARS' ? 'USD' : 'ARS'
    );
  }

  toggleCustomDolar() {
    this.showCustomDolar = !this.showCustomDolar;
    if (!this.showCustomDolar) {
      this.dolarService.reset();
    }
    else {
      this.customDolarInput.setValue(this.dolarService.venta);
    }
  }

  save() {
    console.log('pending save')
  }

  ngOnDestroy(): void {
    this.dataService.updateMode = false;
    this.dataService.clear();
  }
}
