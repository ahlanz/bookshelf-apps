document.addEventListener('DOMContentLoaded', function() {

    // buat list kosong untuk nyimpen data buku yang berupa objek
    const bookList = [];
    const RENDER_EVENT = 'render-books';

    // submitForm untuk menangkap event submit
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    // form untuk search buku 
    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBook();
    });

    let searchQuery = '';

    document.addEventListener(RENDER_EVENT, function() {
        const bookUncomplete = document.getElementById('incompleteBookshelfList');
        bookUncomplete.innerHTML = '';

        const bookComplete = document.getElementById('completeBookshelfList');
        bookComplete.innerHTML = '';

        for (const bookItem of bookList) {
            if (searchQuery && !bookItem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                continue;
            }

            const bookElement = makeBooks(bookItem);
            if (!bookItem.isComplete) {
                bookUncomplete.append(bookElement);
            } else {
                bookComplete.append(bookElement);
            }
        }
        console.log(bookList);
    });

    // fungsi untuk menambahkan buku dan menampilkan buku
    function addBook() {
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        // convert year ke int
        const yearInt = parseInt(year);

        const generatedId = generateId();
        const booksObject = generateBooksObject(generatedId, title, author, yearInt, isComplete);

        bookList.push(booksObject);
        console.log(booksObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function searchBook() {
        searchQuery = document.getElementById('searchBookTitle').value;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // Function untuk generate id
    let idCounter = 0;
    function generateId() {
        return idCounter++;
    }

    // Function untuk generate object buku
    function generateBooksObject(id, title, author, year, isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete,
        }
    }

    // Function untuk render list buku/ bikin list buku untuk ditampilin
    function makeBooks(booksObject) {
        const inputBookTitle = document.createElement('h3');
        inputBookTitle.innerText = booksObject.title;
        const inputBookAuthor = document.createElement('p');
        inputBookAuthor.innerText = booksObject.author;
        const inputBookYear = document.createElement('p');
        inputBookYear.innerText = booksObject.year;

        const article = document.createElement('article');
        article.classList.add('book_item');
        article.append(inputBookTitle, inputBookAuthor, inputBookYear);
        article.setAttribute('id', `books-${booksObject.id}`);

        // Todo buat container div untuk action
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        article.append(actionContainer);

        // Todo buat button selesai dan button hapus
        const buttonSelesai = document.createElement('button');
        buttonSelesai.classList.add('green');
        buttonSelesai.innerText = booksObject.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        actionContainer.append(buttonSelesai);

        const buttonHapus = document.createElement('button');
        buttonHapus.classList.add('red');
        buttonHapus.innerText = 'Hapus buku';
        actionContainer.append(buttonHapus);

        // Todo buat event untuk button selesai 
        buttonSelesai.addEventListener('click', function() {
            if (booksObject.isComplete) {
                undoBukuBelumSelesai(booksObject.id);
            } else {
                addBooksToComplete(booksObject.id);
            }
        });

        buttonHapus.addEventListener('click', function() {
            removeBooks(booksObject.id);
            console.log('button hapus jalan');
        });

        return article;
    }

    function addBooksToComplete(id) {
        const bookTarget = findBookId(id);
        if (bookTarget === null) {
            return console.log('ID nya masih null');
        }

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function undoBukuBelumSelesai(id) {
        const bookTarget = findBookId(id);
        if (bookTarget === null) {
            return console.log('ID nya masih null');
        }

        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBookId(id) {
        for (const bookItem of bookList) {
            if (bookItem.id === id) {
                console.log('Found book with ID:', bookItem.id);
                return bookItem;
            }
        }
        return null;
    }

    function removeBooks(id) {
        const bookTarget = findBookIndex(id);
        if (bookTarget === -1) {
            return console.log('item buku dihapus dengan id null');
        }
        bookList.splice(bookTarget, 1);
        console.log('item buku dihapus dengan id:', id);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBookIndex(id) {
        for (const index in bookList) {
            if (bookList[index].id === id) {
                return index;
            }
        }
        return -1;
    }

    // Todo buat insialisasi local storage
    const SAVED_EVENT = 'saved-books';
    const STORAGE_KEY = 'bookshelf_apps';

    // TODO function jika storage tidak mendukung di web browser
    function ifStorageExist() {
        if (typeof(Storage) === undefined) {
            alert('Browser tidak mendukung storage');
            return false;
        }
        return true;
    }

    function saveData() {
        if (ifStorageExist()) {
            const parseJson = JSON.stringify(bookList);
            localStorage.setItem(STORAGE_KEY, parseJson);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    document.addEventListener(SAVED_EVENT, function() {
        localStorage.getItem(STORAGE_KEY);
        console.log('data berhasil masuk ke local storage');
    });

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const dataBook of data) {
                bookList.push(dataBook);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if (ifStorageExist()) {
        loadDataFromStorage();
    }

});
