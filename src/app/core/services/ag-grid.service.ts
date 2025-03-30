import { Injectable } from '@angular/core';
import { FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, GridSizeChangedEvent, RowHeightParams, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class AgGridService {
  public gridOptions: GridOptions = {
    alwaysShowHorizontalScroll: true,
    columnDefs: [],
  };

  minRowHeight = 25;
  currentRowHeight!: number;
  updateRowHeight = (params: { api: GridApi }) => {
    // get the height of the grid body - this excludes the height of the headers
    const bodyViewport = document.querySelector(".ag-body-viewport");
    if (!bodyViewport) {
      return;
    }
    const gridHeight = bodyViewport.clientHeight;
    // get the rendered rows
    const renderedRowCount = params.api.getDisplayedRowCount();
    // if the rendered rows * min height is greater than available height, just just set the height
    // to the min and let the scrollbar do its thing
    if (renderedRowCount * this.minRowHeight >= gridHeight) {
      if (this.currentRowHeight !== this.minRowHeight) {
        this.currentRowHeight = this.minRowHeight;
        params.api.resetRowHeights();
      }
    } else {
      // set the height of the row to the grid height / number of rows available
      this.currentRowHeight = Math.floor(gridHeight / renderedRowCount);
      params.api.resetRowHeights();
    }
  };


  autoSizeStrategy:
  | SizeColumnsToFitGridStrategy
  | SizeColumnsToFitProvidedWidthStrategy
  | SizeColumnsToContentStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 175,
  };
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    return this.currentRowHeight;
  };

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    this.updateRowHeight(params);
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    this.updateRowHeight(params);
  }

  onGridReady(params: GridReadyEvent) {
    this.minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    this.currentRowHeight = this.minRowHeight;
  }
}
