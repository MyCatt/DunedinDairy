const productGroup = document.getElementById("product_group")
const productsearchInput = document.getElementById("search_product")
const contactDetails = document.getElementById("contact_details")
const commentSection = document.getElementById("comment_section")
const commentForm = document.getElementById("comment_form")
const commentInput = document.getElementById("guest_comment_box")
const usernameInput = document.getElementById("guest_username")
const newsSection = document.getElementById("news_page")

//Configure 'hot swap' pages
const homePage = document.getElementById("main_viewable")
const productPage = document.getElementById("products_page")
const locationPage = document.getElementById("location_page")
const guestBook = document.getElementById("guest_book")
const newsPage = document.getElementById("news_page")
const pages = [
    document.getElementById("main_viewable"), 
    document.getElementById("products_page"),
    document.getElementById("location_page"),
    document.getElementById("guest_book"),
    document.getElementById("news_page")
]

const changePage = key => {
    for(let i = 0; i < pages.length; i++) {
        if(i != key)
            pages[i].style.display = "none"
        else
            pages[i].style.display = "inline-block"
    }
}

const fetchOptions = {
    headers: {
        'Accept': 'application/json'
    }
}

const getProducts = () => {
    const url = 'http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items'
    const req = fetch(url, fetchOptions)
    .then(response => response.json())
    .then(data => {
        displayProducts(data)
    })
    .catch((error) => {
        console.error(error)
    })
}

const displayProducts = resp => {
    for(let i = 0; i < resp.length; i++) {
        const productRef = resp[i].ItemId
        //Setup cards
        const contain = document.createElement('div')
        contain.className = "product_card"

        const infoSection = document.createElement('div')

        const itemID = document.createElement('p')
        itemID.innerHTML = productRef
        itemID.id = "product_id"
        infoSection.appendChild(itemID)

        const itemImage = document.createElement('img')
        itemImage.setAttribute('src', `http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=${productRef}`)
        infoSection.appendChild(itemImage)

        const itemTitle = document.createElement('h4')
        itemTitle.innerHTML = resp[i].Title
        infoSection.appendChild(itemTitle)

        const itemPrice = document.createElement('p')
        itemPrice.innerHTML = `$${resp[i].Price}`
        itemPrice.id = "product_price"
        infoSection.appendChild(itemPrice)

        const itemOrigin = document.createElement('p')
        itemOrigin.innerHTML = resp[i].Origin
        itemOrigin.style.display = "none"
        infoSection.appendChild(itemOrigin)

        const itemType = document.createElement('p')
        itemType.innerHTML = resp[i].Type
        itemType.style.display = "none"
        infoSection.appendChild(itemType)

        contain.appendChild(infoSection)

        const cartBtn = document.createElement('button')
        cartBtn.innerHTML = "Add To Cart"
        contain.appendChild(cartBtn)

        productGroup.appendChild(contain)
    }
}

productsearchInput.addEventListener('keyup', e => {
    const cards = productGroup.querySelectorAll('.product_card')
    for(let i = 0; i < cards.length; i++) {
        const title = cards[i].children[0].children[2].innerText.toLowerCase()
        const searchTxt = e.target.value.toLowerCase()
        if(title.indexOf(searchTxt) == -1)
            cards[i].style.display = "none"
        else
            cards[i].style.display = "inline-block"
    }
})


const fetchDetails = () => {
    const url = 'http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard'
    const req = fetch(url, {headers: {'Accept': 'text/x-vcard'}})
    .then(response => response.text())
    .then(data => {
        const cData = data.split("\n")
        const addressInfo = document.createElement('p')
        addressInfo.innerText = cData[4].substring(16)
        contactDetails.appendChild(addressInfo)

        const phoneInfo = document.createElement('a')
        phoneInfo.innerText = cData[3].substring(15)
        phoneInfo.href = `tel:${cData[3].substring(15)}` 
        contactDetails.appendChild(phoneInfo)

        const emailInfo = document.createElement('a')
        emailInfo.innerText = cData[5].substring(6)
        emailInfo.href = `mailto:${cData[5].substring(6)}` 
        contactDetails.appendChild(emailInfo)
    })
    .catch((error) => {
        console.error(error)
    })
}

const fetchComments = () => {
    const url = 'http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments'
    const req = fetch(url, {headers: {'Accept': 'text/html'}})
    .then(response => {return response.text()})
    .then(data => {
        commentSection.innerHTML = (data)
    })
    .catch((error) => {
        console.error(error)
    })
}

const postComments = comment => {
    const user = usernameInput.value
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
        }
    fetch(`http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=${user}`, options)
    .then(response => response.json())
    .then(data => {
        fetchComments()
    })
    .catch((error) => {
        console.error('Error:', error)
    })
}

commentForm.addEventListener("submit", e => {
    e.preventDefault()
    postComments(commentInput.value)
})

const commentLoop = () => {
    setTimeout(() => {
        fetchComments()
        commentLoop()
    }, 500);
}

const getNews = () => {
    const url = 'http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news'
    const req = fetch(url, fetchOptions)
    .then(response => response.json())
    .then(data => {
        console.log(data[0])
        for(let i = 0; i < data.length; i++) {
            const blog = document.createElement('article')

            const blogImg = document.createElement('img')
            blogImg.setAttribute("src", data[i].enclosureField.urlField)
            blog.appendChild(blogImg)

            const blogText = document.createElement('div')

            const blogTitle = document.createElement('h3')
            blogTitle.innerText = data[i].titleField
            blogText.appendChild(blogTitle)

            const blogDate = document.createElement('p')
            blogDate.innerText = data[i].pubDateField
            blogText.appendChild(blogDate)

            const blogDesc = document.createElement('p')
            blogDesc.innerText = data[i].descriptionField
            blogText.appendChild(blogDesc)

            const linkWrap = document.createElement('a')
            linkWrap.href = data[i].linkField

            blog.appendChild(blogText)
            linkWrap.appendChild(blog)
            newsSection.appendChild(linkWrap)
        }
    })
    .catch((error) => {
        console.error(error)
    })
}

getProducts()
fetchDetails()
fetchComments()
commentLoop()
getNews()