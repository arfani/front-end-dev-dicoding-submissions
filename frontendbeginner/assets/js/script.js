const dataBuku = [];
const RENDER_EVENT = 'render-list';
const STORAGE_KEY = 'DATA_BUKU';

function generateDataBuku(id, title, author, year, isRead) {
    return {
        id,
        title,
        author,
        year,
        isRead,
    }
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(dataBuku);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const item of data) {
            dataBuku.push(item);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBuku() {
    const inpJudul = document.querySelector('[name="judul"]').value
    const inpPenulis = document.querySelector('[name="penulis"]').value
    const inpTahun = document.querySelector('[name="tahun"]').value
    const isRead = document.querySelector('[name="isRead"]').checked

    const newData = generateDataBuku(inpJudul, inpPenulis, inpTahun, isRead);
    dataBuku.push(newData);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        addBuku();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function BukuElement(bukuObject) {

    const {id, title, author, year, isRead} = bukuObject;
  
    const textTitle = document.createElement('h2');
    textTitle.innerText = title;
  
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = year;
  
    const textAuthor = document.createElement('div');
    textAuthor.innerText = author;
  
    const textContainer = document.createElement('div');
    textContainer.append(textTitle, textTimestamp, textAuthor);
  
    const container = document.createElement('div');
    container.append(textContainer);
    container.setAttribute('id', `buku-${id}`);
  
    // if (isCompleted) {
  
    //   const undoButton = document.createElement('button');
    //   undoButton.classList.add('undo-button');
    //   undoButton.addEventListener('click', function () {
    //     undoTaskFromCompleted(id);
    //   });
  
    //   const trashButton = document.createElement('button');
    //   trashButton.classList.add('trash-button');
    //   trashButton.addEventListener('click', function () {
    //     removeTaskFromCompleted(id);
    //   });
  
    //   container.append(undoButton, trashButton);
    // } else {
  
    //   const checkButton = document.createElement('button');
    //   checkButton.classList.add('check-button');
    //   checkButton.addEventListener('click', function () {
    //     addTaskToCompleted(id);
    //   });
  
    //   container.append(checkButton);
    // }
  
    return container;
  }

document.addEventListener(RENDER_EVENT, function () {
    const unreadBook = document.getElementById('list-unread');
    const isReadBook = document.getElementById('list-isread');
    console.log(typeof unreadBook);
    // clearing list item
    unreadBook.innerHTML = '';
    isReadBook.innerHTML = '';

    for (const item of dataBuku) {
        const listBuku = BukuElement(item);
        // if (item.isCompleted) {
            // isReadBook.append(listBuku);
    //     } else {
            unreadBook.append(listBuku);
    //     }
    }
});