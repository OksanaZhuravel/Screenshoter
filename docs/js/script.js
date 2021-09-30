// $(document).ready(function () {
//   $('.nav__lin').on('click', function (e) {
//     var anchor = $(this);
//     $('html, body')
//       .stop()
//       .animate(
//         {
//           scrollTop: $(anchor.attr('href')).offset().top,
//         },
//         777
//       );
//     e.preventDefault();
//     return false;
//   });
// });

// <div class="button-block">
//   <button class="button">Прокрутить вниз 👇</button>
// </div>
// <section class="section"></section>
// <footer class="footer" id="footer"></footer>

// body {
//   margin: 0;
//   font-family: sans-serif;
// }
// .button-block {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 10px;
// }
// .button {
//   padding: 10px 20px;
//   background-color: tomato;
//   border: none;
//   color: #fff;
// }
// .section {
//   height: 100vh;
//   background-color: pink;
// }
// .footer {
//   height: 100vh;
//   background-color: #333;
// }
// function scrollTo(element) {
//   window.scroll({
//     left: 0,
//     top: element.offsetTop,
//     behavior: 'smooth'
//   })
// }

// var button = document.querySelector('.button');
// var footer = document.querySelector('.footer');

// button.addEventListener('click', () => {
//   scrollTo(footer);
// })
