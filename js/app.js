// Get elements
let submit_btn = document.getElementById('submit')
let long_link = document.getElementById('long-link')
let error_msg = document.getElementById('error-msg')
let original_btn = `<button type="button" class="btn btn-sm w-100 btn-success text-white fw-bold" id="submit">Shorten it</button>`
let copy_btn = document.getElementById('copy')

long_link.addEventListener("focus", () => {
    long_link.value = ''
    error_msg.classList.add('d-none')
})

submit_btn.addEventListener('click', () => {
    // if input is blank show error
    if (long_link.value == '') {
        error_msg.classList.remove('d-none')
        error_msg.innerHTML = 'Please enter a valid link'
        // long_link.focus()
    } else {
        // if valid link hide error, add spinner and fetch 
        if (validURL(long_link.value)) {
            error_msg.classList.add('d-none')
            submit_btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
            submit_btn.disabled = true

            fetch('https://api-ssl.bitly.com/v4/shorten', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer a2cd37f44be313f632721842a444f5d4e3b010fe',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "long_url": long_link.value
                    })
                })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    } else {
                        error_msg.classList.remove('d-none')
                        long_link.focus()
                        error_msg.innerHTML = 'Something is wrong with our server, ty again later'
                        submit_btn.innerHTML = 'Shorten it'
                    }
                })
                .then(data => {
                    console.log(data.link)
                    error_msg.classList.add('d-none')
                    // long_link.focus()
                    // submit_btn.innerHTML = 'Copy'
                    // submit_btn.style.cursor = 'pointer'
                    // submit_btn.classList.remove('btn-success')
                    // submit_btn.classList.add('btn-dark')
                    submit_btn.blur()
                    long_link.value = data.link
                    submit_btn.classList.add('d-none')
                    copy_btn.classList.remove('d-none')


                    copy_btn.addEventListener('click', () => {

                        if (simplecopy(long_link.value)) {
                            
                            submit_btn.classList.remove('d-none')
                            copy_btn.classList.add('d-none')
                            submit_btn.disabled = true
                            submit_btn.innerHTML = 'Done!'
                            long_link.focus()
                            setTimeout( () => {
                                submit_btn.innerHTML = 'Shorten it'
                                submit_btn.disabled = false
                            }, 2000)
                        }
                        
                    })
                })
                .catch(error => {
                    if (error == 'TypeError: NetworkError when attempting to fetch resource.') {
                        // console.log('network error')
                        error_msg.classList.remove('d-none')
                        error_msg.innerHTML = 'Please check your network connection!'
                        submit_btn.innerHTML = 'Shorten it'
                        submit_btn.blur()
                        submit_btn.style.cursor = 'pointer'
                    }

                });

        } else {
            // if link is invalid show error
            error_msg.classList.remove('d-none')
            error_msg.innerHTML = 'Please enter a valid link'
        }
    }
    // console.log(error_msg.innerHTML)
})

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}