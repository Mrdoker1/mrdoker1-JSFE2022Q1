let buttonsMain = {
    makeFriend: document.querySelector('.hero-content-section-button'),
    knowTheRest: document.querySelector('.friends-content-section-button'),
}

buttonsMain.knowTheRest.addEventListener('click', () => {
    window.location.href = "../pets";
    console.log('Redirect to' + key)
})


buttonsMain.makeFriend.addEventListener('click', () => {
    window.location.href = "#friends";
    console.log('Redirect to' + key)
})