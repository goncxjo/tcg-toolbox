import {Location} from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs';
import * as _ from 'lodash';
import { Card, Dolar } from '../backend/models';
import { CryptoService, DolarService, TcgPlayerService } from '../backend/services';
import { style, transition, trigger, animate } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportImgComponent } from '../cards/modals/export-img/export-img.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../backend/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {

  @ViewChild('qr') qrModal!: ElementRef;

  id: string = '0';
  importData: string = '';
  cards: Card[] = [];
  selectedCard?: Card;
  dolar!: Dolar;
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
    private tcgPlayerService: TcgPlayerService,
    private dolarService: DolarService,
    private cryptoService: CryptoService,
    private clipboard: Clipboard,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private loaderService: LoaderService
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
    return this.cards.length == 0;
  }

  ngOnInit(): void {
    this.getDolar();

    setTimeout(() => {
      this.mostrarAyuda = true;
    }, 5000);

    // if (this.id) {
    //   this.tcgPlayerService.getDigimonCardById(parseInt(this.id))
    //   .pipe(take(1))
    //   .subscribe(res => {
    //     if (res['id']) {
    //       this.selectedCard = res;
    //     }
    //     else {
    //       this.router.navigate(['/'])
    //     }
    //   });
    // }

    if (this.importData) {
      let res = this.cryptoService.decryptJsonUriFriendly(this.importData);
      res.forEach((c: string) => {
        setTimeout(() => {
          const card = new Card();
          card.mapExportToEntity(c);
          this.addCard(card);
        }, 10);
      });
      this.router.navigate([], { queryParams: {} });
    }

  }
  getDolar() {
    this.dolarService.getDolarBlue()
    .pipe(take(1))
    .subscribe(res => {
      this.dolar = res;
    });
  }
  
  onCardAdded($event: any) {
    let card = $event;
    this.addCard(card);
    this.mostrarAyuda = false;
  }

  addCard(card: Card) {
    let foundCard =_.find(this.cards, (c) => {
      return c.tcg_player_id == card.tcg_player_id;
    });
    if(!foundCard) {
      setTimeout(() => {
        try {
          this.getById(card);
        } catch (error) {
          console.log(`error al importar #${card.tcg_player_id}`)
        }
      }, 0);
    }
  }
  
  getById(card: Card) {
    this.tcgPlayerService.getDigimonCardById(card.tcg_player_id || 0)
    .pipe(take(1))
    .subscribe(res => {
      res.multiplier = card.multiplier;
      res.prices.set('custom', card.prices.get('custom') || null);

      this.cards.push(res);
      this.calcularPrecioTotal();
    });
  }

  getCardMiniInfo(card: Card) {
    return `${card.fullName} # ${card.rarity_code}`
  }

  removeCard(card: Card) {
    _.remove(this.cards, (c) => {
      return c.tcg_player_id == card.tcg_player_id;
    });
    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    setTimeout(() => {
      this.precioTotal = _.sumBy(this.cards, (c) => {
        return c.price.currency_value * c.multiplier;
      });
      
    }, 10);
  }

  getPrecioTotalUSD() {
    return Math.round(this.precioTotal / this.dolar.venta * 100) / 100;
  }

  changeMultiplier(card: Card, i: number) {
    card.changeMultiplier(i);
    this.calcularPrecioTotal();
  }

  generateUrl() {
    const result = this.cards.map(c => c.exportString());
    var data = this.cryptoService.encryptJsonUriFriendly(result);
    const baseUrl = window.document.baseURI;
    return `${baseUrl}?importData=${data}`;
  }

  copyUrl() {
    const result = this.generateUrl();
    this.clipboard.copy(result);
  }

  ordenar(metodo: string, valor: string) {
    switch (metodo) {
      case 'precio':
        this.cards.sort((a: Card, b: Card) => {
          if (valor == 'asc') {
            return a.price.currency_value * a.multiplier - b.price.currency_value * b.multiplier
          }
          return b.price.currency_value * b.multiplier - a.price.currency_value * a.multiplier
        });
        break;
    
      default:
        break;
    }
  }

  onPriceChanged($event: any) {
    this.calcularPrecioTotal();
  }

  onMultiplierChanged($event: any) {
    this.calcularPrecioTotal();
  }

  onCardRemoved(id: number) {
    this.removeCard({ tcg_player_id: id } as Card)
  }

  getFechaActualizacionDolar() {
    return (new Date(this.dolar.fechaActualizacion)).toLocaleString('es-AR')
  }

  toggleEditDolarMode() {
    this.editDolarMode = !this.editDolarMode;

    if (!this.editDolarMode) {
      this.getDolar();
    }
  }

	openExportImg() {
		const modalInstance = this.modalService.open(ExportImgComponent, { fullscreen: true });

    modalInstance.componentInstance.cards = this.cards;
    modalInstance.componentInstance.dolar = this.dolar;
    modalInstance.componentInstance.precioTotal = this.precioTotal;
    modalInstance.componentInstance.precioTotalUSD = this.getPrecioTotalUSD();

    modalInstance.result.then(this.onModalSuccess, onError);

    function onError() { }
  }

  onModalSuccess = (reason: string) => {
    if (reason == 'close') {
      return;
    }
    
    this.loaderService.setHttpProgressStatus(true);
    setTimeout(() => {
      switch(reason) {
        case 'download':
          this.toastr.success('Se ha exportado la imagen con éxito!', 'Exportar 💾');
          break;
        case 'screenshot':
          this.toastr.success('Se ha copiado la imagen con éxito. Revisa tu portapapeles.', 'Capturar 📸');
          break;
      }
    this.loaderService.setHttpProgressStatus(false);
    }, 2000);
  }

	generateQR() {
    this.loaderService.setHttpProgressStatus(true);
    setTimeout(() => {
      this.importData = this.generateUrl();
      this.modalService.open(this.qrModal);
    this.loaderService.setHttpProgressStatus(false);
    }, 2000);
  }
}
