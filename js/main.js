//toggle menu
function togglemenu() {
  let menu = document.getElementById("about");
  let veil = document.getElementById("veil");
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    veil.classList.remove("show");
  } else {
    menu.classList.add("show");
    veil.classList.add("show");
  }
}
let menubutton = document.getElementById("menu-button");
menubutton.addEventListener("click",() => togglemenu());

//close menu
function closemenu() {
  let menu = document.getElementById("about");
  menu.classList.remove("show");
  let veil = document.getElementById("veil");
  veil.classList.remove("show");
}
document.addEventListener("keydown",(e) => {
  if (e.which === 27) {
    closemenu();
  }
});
let closebutton = document.getElementById("close-button");
closebutton.addEventListener("click",() => closemenu());
let veil = document.getElementById("veil");
veil.addEventListener("click",() => closemenu());


//deal with external links
    let externallinks = document.querySelectorAll('a[rel*="external"]');
    externallinks.forEach((link) => {
        link.classList.add("external-link");
        link.setAttribute('target', '_blank');
    });
