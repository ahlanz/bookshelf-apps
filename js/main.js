document.addEventListener('DOMContentLoaded',function(){

    // buat list kosong untuk nyimpen data buku yang berupda objek
    const bookList = [];
    const RENDER_EVENT = 'render-books';

    // submitForm untuk menangkap event submit
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });


    document.addEventListener(RENDER_EVENT, function(){
    const bookUncomplete = document.getElementById('incompleteBookshelfList');
    bookUncomplete.innerHTML = '';

    const bookComplete = document.getElementById('completeBookshelfList');
    bookComplete.innerHTML = '';



    for(bookItem of bookList){
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
     function addBook(){ 
        const bookTitle = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        const generatedId = generateId();
        const booksObject = generateBooksObject(generatedId,bookTitle,bookAuthor,bookYear,isComplete);

        
        bookList.push(booksObject);
        console.log(booksObject);

        document.dispatchEvent(new Event(RENDER_EVENT));

    }


    //Function untuk generate id
    let idCounter = 0;
    function generateId(){
        return idCounter++;
    }

    //Function untuk generate object buku
    function generateBooksObject(id,bookTitle,bookAuthor,bookYear,isComplete){
        return {
            id,
            bookTitle,
            bookAuthor,
            bookYear,
            isComplete,
        }
    }

    //Function untuk render list buku/ bikin list buku untuk ditampilin
    function makeBooks(booksObject){
        const inputBookTitle = document.createElement('h3');
        inputBookTitle.innerText = booksObject.bookTitle;
        const inputBookAuthor = document.createElement('p');
        inputBookAuthor.innerText = booksObject.bookAuthor;
        const inputBookYear = document.createElement('p');
        inputBookYear.innerText = booksObject.bookYear;

        

        const article = document.createElement('article');
        article.classList.add('book_item');
        article.append(inputBookTitle,inputBookAuthor,inputBookYear,);
        article.setAttribute('id', `books-${booksObject.booksId}`);

        // Todo buat container div untuk action
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        article.append(actionContainer);

        // Todo buat button selesai dan button hapus
        const buttonSelesai = document.createElement('button');
        buttonSelesai.classList.add('green');
        buttonSelesai.innerText = 'Selesai dibaca';
        actionContainer.append(buttonSelesai);

        const buttonHapus = document.createElement('button');
        buttonHapus.classList.add('red');
        buttonHapus.innerText = 'Hapus buku';
        actionContainer.append(buttonHapus);


        // Todo buat event untuk button selesai 
        buttonSelesai.addEventListener('click', function(){
            addBooksToComplete(booksObject.id);
            console.log('button seelsai jalan');
        });

        buttonHapus.addEventListener('click',function(){
            removeBooks(booksObject.id);
            console.log('button hapus jalan');
        });
        
        return article;
    }



    function addBooksToComplete(id){
        const bookTarget = findBookId(id);
        if (bookTarget === null) {
            return console.log('ID nya masih null');
        }

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function findBookId(id){
        for(const bookItem of bookList){
            if (bookItem.id === id) {
                console.log('Found book with ID:', bookItem.id);
                return bookItem;
            }
        }
        return null;
    }

    function removeBooks(id){
        const bookTarget = findBookIndex(id);
        if (bookTarget === - 1) {
            return console.log('item buku dihapus dengan id null');
        }
        bookList.splice(bookTarget,1);
        console.log('item buku dihapus dengan id:', id);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function findBookIndex(id){
        for(const index in bookList){
            if (bookList[index].id === id) {
                return index;
            }
        }
        return -1;
    }
    
   

});