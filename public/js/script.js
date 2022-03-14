    // $(document).ready(function(){

    //     $('#menu-bar').click(function(){
    //         $(this).toggleClass('fa-times');
    //         $('.navbar').toggleClass('nav-toggle');
    //     });

    //     $(window).on('load scroll',function(){

    //         $('#menu-bar').removeClass('fa-times');
    //         $('.navbar').removeClass('nav-toggle');

    //         $('section').each(function(){

    //             let top = $(window).scrollTop();
    //             let height = $(this).height();
    //             let id = $(this).attr('id');
    //             let offset = $(this).offset().top - 200;

    //             if(top > offset && top < offset + height){
    //                 $('.navbar ul li a').removeClass('active');
    //                 $('.navbar').find(`[href="#${id}"]`).addClass('active');
    //             }

    //         });

    //     });

    //     $('.list .btn').click(function(){
    //         $(this).addClass('active').siblings().removeClass('active');
    //         let src = $(this).attr('data-src');
    //         $('.menu .row .image img').attr('src',src);
    //     });

    // });

document.querySelectorAll('.faq .accordion-container .accordion').forEach(accordion =>{
    accordion.onclick = () =>{
        accordion.classList.toggle('active');
    }
})

let slides = document.querySelectorAll('.home .slides-container .slide');
let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

//quote api
    // let quote = document.getElementById("quote");
    // let author = document.getElementById("author");
    // let btn = document.getElementById("btn");

    // const url = "https://api.quotable.io/random";

    // let getQuote = () => {
    // fetch(url)
    //     .then((data) => data.json())
    //     .then((item) => {
    //     quote.innerText = item.content;
    //     author.innerText = item.author;
    //     });
    // };

    // window.addEventListener("load", getQuote);
    // btn.addEventListener("click", getQuote);