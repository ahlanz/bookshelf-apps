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
        bookUncomplete.append(bookElement);
        console.log('List book element');
        console.log(bookElement);
    }

    });

     // fungsi untuk menambahkan buku dan menampilkan buku
     function addBook(){ 
        const bookTitle = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = document.getElementById('inputBookYear').value;

        const generatedId = generateId();
        const booksObject = generateBooksObject(generatedId,bookTitle,bookAuthor,bookYear,false);

        console.log(booksObject);
        bookList.push(booksObject);

        document.dispatchEvent(new Event(RENDER_EVENT));

    }


    //Function untuk generate id
    function generateId(){
        return + new Date();
    }

    //Function untuk generate object buku
    function generateBooksObject(booksId,bookTitle,bookAuthor,bookYear,isComplete){
        return {
            booksId,
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


        //TODO sampe sini ya code nya !!!
        const article = document.createElement('article');
        article.classList.add('book_item');
        article.append(inputBookTitle,inputBookAuthor,inputBookYear);
        article.setAttribute('id', `books-${booksObject.booksId}`);

        return article;
    }


    
   

});