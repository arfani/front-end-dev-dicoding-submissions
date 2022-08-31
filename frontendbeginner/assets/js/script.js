let dataBuku = [];
const RENDER_EVENT = 'render-list';
const STORAGE_KEY = 'DATA_BUKU';

function generateDataBuku(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function isStorageExist() {
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

function searchBuku(title) {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const item of data) {
            if (item.title.includes(title))
                dataBuku.push(item);
        }
    }
}

function addBuku() {
    const inpJudul = document.querySelector('[name="judul"]').value
    const inpPenulis = document.querySelector('[name="penulis"]').value
    const inpTahun = document.querySelector('[name="tahun"]').value
    const isComplete = document.querySelector('[name="isComplete"]').checked

    const newData = generateDataBuku(+new Date(), inpJudul, inpPenulis, inpTahun, isComplete);
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

function findItem(idBuku) {
    for (const item of dataBuku) {
        if (item.id === idBuku) {
            return item;
        }
    }
    return null;
}

function findItemIndex(idBuku) {
    for (const index in dataBuku) {
        if (dataBuku[index].id === idBuku) {
            return index;
        }
    }
    return -1;
}

function addTaskToCompleted(idBuku) {
    const bukuTarget = findItem(idBuku);

    if (bukuTarget == null) return;

    bukuTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(idBuku) {
    const bukuTarget = findItemIndex(idBuku);

    if (bukuTarget === -1) return;

    dataBuku.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(idBuku) {

    const bukuTarget = findItem(idBuku);
    if (bukuTarget == null) return;

    bukuTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function BukuElement(bukuObject) {

    const { id, title, author, year, isComplete } = bukuObject;

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

    if (isComplete) {

        const undoButton = document.createElement('button');
        const undoIcon = document.createElement('i')
        undoIcon.classList.add('fa', 'fa-ban')
        undoButton.append(undoIcon)
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        const trashIcon = document.createElement('i')
        trashIcon.classList.add('fa', 'fa-trash')
        trashButton.append(trashIcon)
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            const ansConfirm = confirm('Are you sure want to remove this item ?')
            if (ansConfirm) {
                removeTaskFromCompleted(id);
            }
        });

        container.append(undoButton, trashButton);
    } else {

        const checkButton = document.createElement('button');
        const checkIcon = document.createElement('i')
        checkIcon.classList.add('fa', 'fa-check')
        checkButton.append(checkIcon)
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(id);
        });

        const trashButton = document.createElement('button');
        const trashIcon = document.createElement('i')
        trashIcon.classList.add('fa', 'fa-trash')
        trashButton.append(trashIcon)
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            const ansConfirm = confirm('Are you sure want to remove this item ?')
            if (ansConfirm) {
                removeTaskFromCompleted(id);
            }
        });

        container.append(checkButton, trashButton);
    }

    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    const unreadBook = document.getElementById('list-unread');
    const isReadBook = document.getElementById('list-isread');
    unreadBook.innerHTML = '';
    isReadBook.innerHTML = '';

    for (const item of dataBuku) {
        const listBuku = BukuElement(item);
        if (item.isComplete) {
            isReadBook.append(listBuku);
        } else {
            unreadBook.append(listBuku);
        }
    }
});

const btnSearch = document.querySelector('[name="search"]');
btnSearch.addEventListener('keyup', function (e) {
    dataBuku = [];

    if (this.value) {
        searchBuku(this.value);
    } else {
        if (isStorageExist()) {
            loadDataFromStorage();
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
})