import { AfterViewInit, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown91, faArrowUp19, faCommentDollar, faEye, faFloppyDisk, faImage, faMinus, faPlus, faTimes, faTrash, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from '../../../core';
import { ToastrService } from 'ngx-toastr';
import { DolarDataService } from '../../../core/services/dolar.data.service';
import { DataService } from '../../../core/services/data.service';
import { Card, CardList, CardListService } from '../../../backend';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map } from 'rxjs';
import _ from 'lodash';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportImgComponent } from '../../../components/cards/modals/export-img/export-img.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardInfoComponent } from '../../../components/cards/card-info/card-info.component';
import { cardsStorage } from '../../../utils/type-safe-localstorage/card-storage';
import { UserService } from '../../../core/services/user.service';
import { ConfirmComponent } from '../../../shared/modals/confirm/confirm.component';

@Component({
  selector: 'app-card-lists-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, CurrencyPipe, AsyncPipe, NgbDropdownModule, CardInfoComponent],
  templateUrl: './card-lists-edit.component.html',
  styleUrl: './card-lists-edit.component.scss'
})
export class CardListsEditComponent implements OnInit, AfterViewInit, OnDestroy {
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
  maximizeIcon = faUpRightAndDownLeftFromCenter;

  cards = computed(() => this.dataService.cards());
  total = computed(() => this.dataService.totals());

  form = this.buildForm();

  readonly: boolean = false;
  editMode: boolean = false;
  showDetails: boolean = false;

  customDolarInput = new FormControl();
  customDolar$!: Subscription;
  showCustomDolar: boolean = false;

  title: string = '';
  id: string = '';

  dolarService = inject(DolarDataService);
  dataService = inject(DataService);
  cardList$!: Observable<CardList>;
  
  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private service: CardListService,
    private userService: UserService
  ) {
  }

  get noData() {
    return this.cards().length == 0;
  }

  ngOnInit(): void {
    this.cardList$ = this.activatedRoute.data
      .pipe(
        map(data => {
          const cardList = data['entity'];
          this.readonly = data['readonly'];
          this.editMode = data['editMode'];
          this.showDetails = this.editMode;
          this.title = data['title'];
          if (cardList.id) {
            this.dataService.set(cardList.cards);
            this.dataService.updateMode = true;
            this.id = cardList.id;
            this.form.patchValue(cardList);
          } else {
            if (!this.dataService.cardsLength()) {
              const tmpCards = cardsStorage.getItems() as Card[]
              this.dataService.set(tmpCards);
            }
            setTimeout(() => {
              cardList.cards = _.clone(this.cards());
            }, 1000);
          }
          return cardList;
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
    const onModalSuccess = (reason: string) => {
      if (reason == 'close') {
        return;
      }
  
      this.loaderService.show();
      setTimeout(() => {
        switch(reason) {
          case 'download':
            this.toastr.success('Se ha exportado la imagen con éxito!', 'Exportar 💾');
            break;
          case 'screenshot':
            this.toastr.success('Se ha copiado la imagen con éxito. Revisa tu portapapeles.', 'Capturar 📸');
            break;
        }
        this.loaderService.hide();
      }, 2000);
    };

    const onError = () => { };

		const modalInstance = this.modalService.open(ExportImgComponent, { fullscreen: true });
    modalInstance.componentInstance.cards = this.cards;
    modalInstance.result.then(onModalSuccess, onError);
  }

  buildForm() {
    return this.formBuilder.group({
      id: '',
      name: { value: '', required: Validators.required, disabled: this.readonly },
      description: { value: '', required: Validators.required, disabled: this.readonly },
      createdAt: '',
      updatedAt: '',
    })
  }

  toggleDolar() {
    this.dolarService.setUserCurrency(
      this.dolarService.userCurrency() == 'ARS' ? 'USD' : 'ARS'
    );
  }

  toggleInfoReduced(card: Card) {
    card.infoReduced = !card.infoReduced;
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
    if (this.form.invalid) {
      this.toastr.error('Por favor, completa los campos requeridos.', 'Error');
      return;
    }

    const onSuccess = () => {
      this.toastr.success('El registro fue guardado.', 'Guardar');
      this.router.navigate(['card-lists']);
    }
  
    const onError = (err: Error) => {
      console.log(err);
      this.toastr.error('Ha ocurrido un error', 'Error');
    }

    try {
      let formRawValue = this.form.getRawValue();
      let entity: CardList = {
        id: this.id,
        name: formRawValue.name ?? '',
        description: formRawValue.description ?? '',
        createdAt: formRawValue?.createdAt ?? '',
        updatedAt: formRawValue?.updatedAt ?? '',
        cards: _.map(this.cards(), card => { return { tcgPlayerId: card.tcg_player_id ?? 0, qty: card.multiplier } })
      };

      if (this.id) {
        entity.updatedAt = new Date().toISOString(),
        this.service.update(entity).then(onSuccess, onError);
      } else {
        entity.createdAt = new Date().toISOString(),
        this.service.create(entity).then(onSuccess, onError);  
      }
    } catch (error) {
      this.toastr.error('Ha ocurrido un problema', 'Error');
    }
  }

  isLoggedIn() {
    return this.userService.isLoggedIn()
  }

  openConfirmClear() {
    const onModalSuccess = (result: string) => {
      if (result == 'cancel') {
        return;
      }
      try {
        cardsStorage.clearItems();
        this.dataService.clear();
      } catch (error) {
        this.toastr.error('Ha ocurrido un problema', 'Error');
      }
    }
    
    const onError = () => {
      this.toastr.error('Ha ocurrido un error', 'Error');
    }
  
    const modalInstance = this.modalService.open(ConfirmComponent);
    modalInstance.componentInstance.title = `Eliminar`;
    modalInstance.componentInstance.message = `¿Estás seguro que querés limpiar la lista?`;
    modalInstance.result.then(onModalSuccess, onError);
  }

  toggleDetails() {
    this.showDetails = !this.showDetails
  }

  ngOnDestroy(): void {
    this.dataService.updateMode = false;
    this.dataService.clear();
    if (this.id) {
      cardsStorage.clearItems();
    }
  }
}
