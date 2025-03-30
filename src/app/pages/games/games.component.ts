import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ExpansionTcgPlayer, TcgPlayerService } from '../../backend';
import { map, Observable, take, tap } from 'rxjs';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { NgbCollapseModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GameSelectComponent } from '../../components/games/game-select/game-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { GamesFiltersComponent } from './games-filters/games-filters.component';
import _ from 'lodash';
import { ExpansionsComponent } from './expansions/expansions.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    GameSelectComponent,
    AsyncPipe,
    SlicePipe,
    NgbCollapseModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GamesFiltersComponent,
    ExpansionsComponent
  ],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent implements AfterViewInit {
  @ViewChild('gamesFilters') gamesFilters!: GamesFiltersComponent;

  data$!: Observable<ExpansionTcgPlayer[]>;
  
  searchIcon = faSearch;
  isCollapsed: boolean[] = [];
  items: any[] = [];
  pageSize = 5;
  page = 1;

  form = this.buildForm();

  constructor(
    private tcgPlayerService: TcgPlayerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }
  
  ngAfterViewInit() {
    const url = this.route.snapshot.url[0]
    this.form.controls['game'].setValue(url?.path ?? '');
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedGame) {
      this.data$ = this.tcgPlayerService.getExpansions(this.selectedGame).pipe(
        take(1),
        map((expansions: ExpansionTcgPlayer[]) => {
          this.items = _.filter(expansions, (e) => this.filterData(e));
          return this.items
        }),
        tap(() => this.isCollapsed = _.fill(Array(this.items.length), true))
      )
    }
  }

  get selectedGame() {
    return this.gamesFilters?.value()?.game ?? '';
  }

  private filterData(e: ExpansionTcgPlayer): boolean {
    let result = true;
    const filters = this.gamesFilters.value();
   
    if (filters.expansion) {
      var regex = new RegExp(`${filters.expansion}`, 'gi');
      result = result && regex.test(e.name);
    }

    if (!filters.showPreRelease) {
      result = result && !(/pre.release|celebration.event/gi.test(e.name));
    }

    return result;
  }
  
  private buildForm(): FormGroup {
    return this.formBuilder.group({});
  }

  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  getExpansionImage(expansion: ExpansionTcgPlayer): string {
    return this.tcgPlayerService.getDigimonImageExpansionURL(expansion);
  }

  getBackgroundImage(expansion: ExpansionTcgPlayer) {
    const image_url = this.getExpansionImage(expansion);
    return `linear-gradient(to left, transparent, RGBA(var(--bs-dark-rgb)) 90%), url('${image_url}')`
  }
}
