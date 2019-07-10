const input = document.querySelector('.todo-input');
const list = document.querySelector('.todo-list');
const btnAdd = document.querySelector('.todo-add');

btnAdd.addEventListener('click', function(){
    let value = input.value;
    let item = createElement(value);
    input.value = "";
    addTodo(item);
});

function addTodo(todoItem){
    list.appendChild(todoItem);
    input.textContent = "";
}

function createElement(value){
    let item = document.createElement('li');

    let itemText = document.createElement('p');
    itemText.classList.add('todo-text')
    itemText.textContent = value;

    let itemEdit = document.createElement('button');
    itemEdit.classList.add('todo-edit')
    
    let itemEditIcon = document.createElement('i');
    itemEditIcon.className = "fas fa-edit";
    itemEdit.appendChild(itemEditIcon)


    let itemDelete = document.createElement('button');
    itemDelete.classList.add('todo-delete')

    let itemDeleteIcon = document.createElement('i');
    itemDeleteIcon.className = "fas fa-trash-alt"
    itemDelete.appendChild(itemDeleteIcon)
    
    
    item.appendChild(itemText);
    item.appendChild(itemEdit);
    item.appendChild(itemDelete);

    return item;
}
