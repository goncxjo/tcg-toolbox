import {CommonModule, CurrencyPipe} from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs';
import * as _ from 'lodash';
import { Card, Dolar } from '../../backend/models';
import { CryptoService } from '../../backend/services';
import { style, transition, trigger, animate } from '@angular/animations';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ExportImgComponent } from '../cards/modals/export-img/export-img.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../core/services/loader.service';
import { QrCodeComponent } from '../../shared/qr-code/qr-code.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardInfoComponent } from '../cards/card-info/card-info.component';
import { CardSearcherComponent } from '../cards/card-searcher/card-searcher.component';
import { FormsModule } from '@angular/forms';
import { faArrowDown91, faArrowUp19, faImage, faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../../core/services/data.service';
import { DolarDataService } from '../../core/services/dolar.data.service';
import { TotalComponent } from '../cards/total/total.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, QrCodeComponent, FontAwesomeModule, NgbTooltip, CurrencyPipe, CardInfoComponent, CardSearcherComponent, ExportImgComponent, TotalComponent],
  templateUrl: './home_old.component.html',
  styleUrls: ['./home_old.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class OldHomeComponent implements OnInit {
  sortUpIcon = faArrowUp19;
  sortDownIcon = faArrowDown91;
  imageIcon = faImage;
  closeIcon = faTimes;
  plusIcon = faPlus;
  minusIcon = faMinus;

  @ViewChild('qr') qrModal!: ElementRef;

  id: string = '0';
  importData: string = '';
  cards = computed(() => this.dataService.cards());
  selectedCard?: Card;
  dolar!: Dolar | null;
  activeIds: any[] = [];
  precioTotal: number = 0;
  priceSelected: any;
  mostrarAyuda: boolean = false;
  mostrarBotonesCompartir: boolean = false;
  editDolarMode: boolean = false;
  mostrarQR = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dolarService: DolarDataService,
    private cryptoService: CryptoService,
    private clipboard: Clipboard,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private dataService: DataService
  ) {
    this.route.params.pipe(
      take(1),
    ).subscribe((params) => {
      this.id = params['id'];
    });
    
    this.route.queryParamMap.subscribe((params) => {
      this.importData = params.get('importData') || '';
    });
  }

  get noData() {
    return this.cards().length == 0;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.mostrarAyuda = true;
    }, 5000);

    // if (this.importData) {
    //   let res = this.cryptoService.decryptJsonUriFriendly(this.importData);
    //   res.forEach((c: string) => {
    //     setTimeout(() => {
    //       const card = new Card();
    //       card.mapExportToEntity(c);
    //       this.addCard(card);
    //     }, 10);
    //   });
    //   this.router.navigate([], { queryParams: {} });
    // }
  }
  

  getCardMiniInfo(card: Card) {
    return `${card.fullName} # ${card.rarity_code}`
  }

  removeCard(card: Card) {
    this.dataService.remove(card);
  }

  changeMultiplier(card: Card, i: number) {
    this.dataService.updateCardMultiplier(card, i);
  }

  generateUrl() {
    const result = this.cards().map(c => c.exportString());
    var data = this.cryptoService.encryptJsonUriFriendly(result);
    const baseUrl = window.document.baseURI;
    return `${baseUrl}?importData=${data}`;
  }

  copyUrl() {
    const result = this.generateUrl();
    this.clipboard.copy(result);
  }

  ordenar(metodo: string, valor: string) {
    // switch (metodo) {
    //   case 'precio':
    //     this.cards.sort((a: Card, b: Card) => {
    //       if (valor == 'asc') {
    //         return a.price.currency_value * a.multiplier - b.price.currency_value * b.multiplier
    //       }
    //       return b.price.currency_value * b.multiplier - a.price.currency_value * a.multiplier
    //     });
    //     break;
    
    //   default:
    //     break;
    // }
  }

  onCardRemoved(id: number) {
    this.removeCard({ tcg_player_id: id } as Card)
  }

  getFechaActualizacionDolar() {
    const fechaActualizacion = this.dolarService.dolar()?.fechaActualizacion;
    if (fechaActualizacion) {
      return (new Date()).toLocaleString('es-AR')
    }
    return null;
  }

	openExportImg() {
		const modalInstance = this.modalService.open(ExportImgComponent, { fullscreen: true });

    modalInstance.componentInstance.cards = this.cards;
    modalInstance.componentInstance.dolar = this.dolar;
    modalInstance.componentInstance.precioTotal = this.precioTotal;
    // modalInstance.componentInstance.precioTotalUSD = this.getPrecioTotalUSD();

    modalInstance.result.then(this.onModalSuccess, onError);

    function onError() { }
  }

  onModalSuccess = (reason: string) => {
    // this.loaderService.setHttpProgressStatus(true);
    setTimeout(() => {
      switch(reason) {
        case 'download':
          this.toastr.success('Se ha exportado la imagen con éxito!', 'Exportar 💾');
          break;
        case 'screenshot':
          this.toastr.success('Se ha copiado la imagen con éxito. Revisa tu portapapeles.', 'Capturar 📸');
          break;
      }
    // this.loaderService.setHttpProgressStatus(false);
    }, 2000);
  }

	generateQR() {
    // this.loaderService.setHttpProgressStatus(true);
    setTimeout(() => {
      this.importData = this.generateUrl();
      this.modalService.open(this.qrModal);
    // this.loaderService.setHttpProgressStatus(false);
    }, 2000);
  }
}
