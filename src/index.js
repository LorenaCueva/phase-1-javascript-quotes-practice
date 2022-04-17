let sortAuthor = false
init()

function init(){
    fetchQuotes()
    document.getElementById("sort").addEventListener('click', e => {
        sortAuthor = !sortAuthor
        const quoteList = document.getElementById('quote-list').innerHTML = ""
        fetchQuotes()})
    document.getElementById("new-quote-form").addEventListener('submit', e => addNewQuote(e))
}

function addNewQuote(e){
    e.preventDefault()
    fetch('http://localhost:3000/quotes',{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "quote": e.target.new_quote.value,
            "author": e.target.author.value,
            "likes": []
        })
    })
    .then(response => response.json())
    .then(newQuote => renderQuote(newQuote))
}

function fetchQuotes(e){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
        if(sortAuthor === true){
            quotes.sort((a, b) => a.author.localeCompare(b.author))
        }
        quotes.forEach(q => renderQuote(q))})
    .catch(error => window.alert(error.message))
}

function renderQuote(q){
    const quoteList = document.getElementById('quote-list')
    const listElement = document.createElement('li')
    const bq = document.createElement('blockquote')
    const p = document.createElement('p')
    p.innerText = q.quote
    const foot = document.createElement('footer')
    foot.innerText = "-" + q.author
    const br = document.createElement('br')
    likeBtn = document.createElement('button')
    const s = document.createElement('span')
    s.innerText = q.likes.length
    likeBtn.innerText = "Likes:"
    likeBtn.append(s)
    likeBtn.addEventListener('click', (e, quote) => addLike(e,q))
    deleteBtn = document.createElement('button')
    deleteBtn.innerText = "Delete"
    deleteBtn.addEventListener('click', (e,quote) => deleteQuote(e,q))
    editBtn = document.createElement('button')
    editBtn.innerText = "Edit"
    editBtn.addEventListener('click', (e, quote) => editQuote(e, q))
    bq.append(p,foot,br,likeBtn,editBtn,deleteBtn)
    listElement.append(bq)
    quoteList.append(listElement)
}

function deleteQuote(e, q){
    fetch(`http://localhost:3000/quotes/${q.id}`,{
        method: "DELETE"
    })
    .then(response => response.json())
    .then(obj => e.target.parentElement.parentElement.remove())
    .catch(error => window.alert(error.message))
}

function addLike(e, q){
    fetch(`http://localhost:3000/likes`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "quoteId": parseInt(q.id, 10),
            "createdAt": Date.now()
        })
    })
    .then(result => result.json())
    .then(quote => {
        e.target.childNodes[1].innerText = parseInt(e.target.childNodes[1].innerText, 10) + 1
    })
    .catch(error => window.alert(error.message))
}

function editQuote(e, q){ 
    const newQuote = prompt("Edit Quote", e.target.parentElement.firstChild.innerText)
    if(newQuote == null){
        fetchQuotes()
    }
    else if(newQuote == ""){
        editQuote(e, q)}
    else{
        fetch(`http://localhost:3000/quotes/${q.id}`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "quote": newQuote
            })
        })
        .then(response => response.json())
        .then(obj => {
           const listElement = e.target.parentElement.firstChild
           listElement.innerText = obj.quote
        })
        
    }
}