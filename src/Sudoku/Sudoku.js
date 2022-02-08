document.addEventListener('DOMContentLoaded', () => {
  const rows = 9;
  const cols = 9;
  const grid = Array.from(Array(rows).fill(0), () => new Array(cols).fill(0));
  document.getElementById('sudoku').addEventListener('input', (e) => {
    if(e.target.classList.contains('box')){
      validateInput(e);
    };
  });

  init();

  function init(){
    renderGrid();
  }

  function renderGrid(){
    let gridHtml = '';
    new Array(cols).fill(0).forEach((col, index) => {
      gridHtml += '<div class="row">'
      new Array(rows).fill(0).forEach((row, rowIndex) => (
        gridHtml += `<input class="box" id="${rowIndex}-${index}"></input>`
      ))
      gridHtml += "</div>"
    });
    document.getElementById('sudoku').innerHTML = gridHtml;
  }

  function validateInput(e){
    var target = e.target;
    var [rowId, colId] = target.id.split('-');
    const value = target.value;
    let inputError = false;
    if(!/^[0-9]/g.test(value)) {
      inputError = true;
    }
    const inCol = grid[rowId].filter( (row, index) => grid[colId][index] === value).length > 0;
    const inRow = grid.filter( (col, index) => grid[index][parseInt(rowId)] === value).length > 0;
    const inGrid = checkInGrid(rowId, colId, value);
    if ( inCol || inRow || inGrid || inputError) {
      target.classList.add('error');
      setTimeout(() => {
        target.classList.remove('error');
        target.value = '';
      }, 1000)
    } else {
      grid[colId][rowId] = target.value;
    }
  }

  function checkInGrid(rowId, colId, value) {
    const rowStart = (Math.ceil((parseInt(rowId)+1)/3) - 1) * 3;
    const colStart = (Math.ceil((parseInt(colId)+1)/3) - 1) * 3;
    for ( let i=colStart; i <colStart+3; i++){
      for(let j=rowStart; j < rowStart + 3; j++){
        if (grid[i][j] === value) {
          return true;
        }
      }
    }
    return false;
  }
})