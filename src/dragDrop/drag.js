document.addEventListener("DOMContentLoaded", function() {
  let todos = {
    "todo": { name: 'To-do',list:[], pageNum: 1},
    "tasks": {name: "Tasks",list:[], pageNum: 1},
    "tasksFuture":{name: "Tasks future", list: [], pageNum: 1},
  };
  let transferringObject={};
  const tasksPerPage = 3;
  let tasksPageNum = 1;
  init();
  getElementById('dropTargets').onclick =  addTask;
  getElementById('dropTargets').ondragstart = dragStart;
  window.addEventListener('beforeunload', function(e) {
    window.localStorage.setItem('todosData', JSON.stringify(todos));
  });


  function init(){
    let list='';
    todos = JSON.parse(window.localStorage.getItem('todosData')) || todos;
    Object.keys(todos).forEach(task => {
      let items=`<div id=${task} class="taskSummary">`;
      items += renderTasks(task, 0, tasksPerPage);
      items += '</div>';
      list +=boxTemplate(items, task, todos[task]);
    });
    getElementById('dropTargets').innerHTML = list;

    const boxes = document.querySelectorAll('.box');
    boxes.forEach( box => {
      box.addEventListener('dragenter', dragEnter);
      box.addEventListener('dragover', dragOver);
      box.addEventListener('drop', drop);
      box.addEventListener('dragleave', dragLeave);
  });
  }

  function renderTasks(task, startIndex, endIndex) {
    let tasks = ''
    todos[task].list.map((t, index) => {
      if(index>=startIndex && index < endIndex){
        tasks += itemTemplate(t);
      }
    });
    return tasks;
  }

  function boxTemplate(items, propertyName, list) {
    const pagination = renderPaginationBtns(list, propertyName);
    return (
      '<div class="box">' +
        `<h3>${list.name}</h3>` +
        `<button id="addTask${propertyName}" class="addTasksBtn">Add</button>` +
        addForm(propertyName)+
        `<div>` +
        items +
        pagination +
        '</div>'+
      '</div>'
    );
  }

  function renderPaginationBtns(tasks, propertyName){
    if ( tasks.list.length > 2){
      return '<div class=pagination>' + 
      '<button class="previous"' + 
      `${tasksPageNum === 1 ? 'disabled ' : ''}` +
      `propAttr="${propertyName}" >Previous</button>` +
      `<button class="next"`+
      `${tasks.list.length - tasksPageNum * tasksPerPage <= 0 ? 'disabled ' : ''}` +
      `propAttr=${propertyName} >Next</button>` +
      '</div>'
    }
    return '';
  }


  function addForm(name){
    return(
      `<div id="addTask${name}Entry" class="hide addTasksForm">`+
        `<div style="clear:both;"><label for="">Title:</label><input type="text" id="titleEntry${name}" labelAttr="${name}" size="8" class="inputTitle"/></div>` +
        `<div style="clear:both;"><label for="">Description:</label><input type="text" id="descEntry${name}" labelAttr="${name}" size="8" class="inputDesc"/></div>` +
        `<button id=save${name} labelAttr=${name} class="saveBtn">Save</button>`+
      '</div>'
    );
  }

  function itemTemplate(data){
    return (
      `<div class='item' draggable="true" id=${data.id || ''}>
        <label>Title:</label>${data.title}</br><label>Description:</label>${data.description}
        <div><span class="deleteBtn" idAttr="${data.id}" >&#x274C;</span></div>
      </div>`
    );
  }

  function dragStart(e) {
    if (e.target.classList.contains('item')){  
      e.dataTransfer.setData('text/plain', e.target.id);
      const parentId = e.target.parentElement.id;
      const currentIndex = todos[parentId].list.findIndex( obj => obj.id === e.target.id);
      transferringObject = todos[parentId].list[currentIndex];
      todos[parentId].list.splice(currentIndex, 1);
    }
  }

  function dragEnter(e) {
      // e.preventDefault();
      e.target.classList.add('drag-over');
  }

  function dragOver(e) {
      e.preventDefault();
      e.target.classList.add('drag-over');
  }

  function dragLeave(e) {
      e.target.classList.remove('drag-over');
  }

  function drop(e){
    e.target.classList.remove('drag-over');
    if(!e.target.classList.contains('box')) return;
    const id = e.dataTransfer.getData('text/plain');
    const appendTarget = e.target.getElementsByClassName('taskSummary')[0];
    appendTarget.appendChild(getElementById(id));
    todos[appendTarget.id].list.push(transferringObject);
    transferringObject = {};
    e.dataTransfer.clearData();
  }

  function addTask(e){
    if(e.target.id.includes('addTask')) {
      console.log('add clicked');
      document.querySelectorAll('.addTasksForm').forEach( form => form.classList.add('hide'));
      document.querySelectorAll('.addTasksBtn').forEach(btn => btn.classList.remove('hide'));
      getElementById(e.target.id + 'Entry').classList.remove('hide');
      e.target.classList.add('hide');
    } else if (e.target.id.includes('save')) {
      const name = getElementById(e.target.id).getAttribute('labelAttr');
      const title = getElementById('titleEntry' + name).value;
      const desc = getElementById('descEntry' + name).value;
      const newTask = {
        title,
        description: desc,
        id: title.substring(0,2) + generateRandomId()
      }
      const itemHtml = itemTemplate(newTask);
      getElementById(name).innerHTML += (itemHtml);
      getElementById('titleEntry' + name).value = '';
      getElementById('descEntry' + name).value='';
      getElementById('addTask'+ name +'Entry').classList.add('hide');
      getElementById('addTask'+ name).classList.remove('hide');
      todos[name].list.push(newTask)
    } else if (e.target.classList.contains('next')){
      nextTasks(e);
    } else if (e.target.classList.contains('previous')){
      prevTasks(e);
    }
  }

  function getElementById(id) {return document.getElementById(id)};
  function generateRandomId() { return '-' + Math.floor(Math.random() * Math.pow(10,4)) + '-' + Math.floor(Math.random() * Math.pow(10,4)) };

  function nextTasks(event){
    const propName = event.target.getAttribute('propattr');
    const nextTasks = renderTasks(propName, tasksPerPage, tasksPerPage * tasksPerPage);
    document.getElementById(propName).innerHTML = nextTasks;

    //next and previous buttons re-render
    tasksPageNum += 1;
    const paginationNode = document.getElementById(propName).parentElement.getElementsByClassName('pagination');
    paginationNode[0].parentNode.removeChild(paginationNode[0])
    const pagination = renderPaginationBtns(todos[propName],propName);
    document.getElementById(propName).parentElement.innerHTML += pagination;
  }

  function prevTasks(event){
    const propName = event.target.getAttribute('propattr');
    const nextTasks = renderTasks(propName, tasksPageNum - tasksPerPage , tasksPerPage);
    document.getElementById(propName).innerHTML = nextTasks;

    //next and previous buttons re-render
    tasksPageNum -= 1;
    const paginationNode = document.getElementById(propName).parentElement.getElementsByClassName('pagination');
    paginationNode[0].parentNode.removeChild(paginationNode[0])
    const pagination = renderPaginationBtns(todos[propName],propName);
    document.getElementById(propName).parentElement.innerHTML += pagination;
  }

});
