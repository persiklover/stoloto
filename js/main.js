function scrollTo(selector) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top - 20 + 'px'
  }, 500);
}

$(function() {

  $('a[href^="#"]').click(function(e) {
    e.preventDefault();

    scrollTo($(this).attr("href"));
  });

  function elemInViewport(elem, full) {
    var box = elem.getBoundingClientRect();
    var top = box.top;
    var left = box.left;
    var bottom = box.bottom;
    var right = box.right;
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var maxWidth = 0;
    var maxHeight = 0;
    if (full) { maxWidth = right - left; maxHeight = bottom - top };
    return Math.min(height, bottom) - Math.max(0, top) >= maxHeight && Math.min(width, right) - Math.max(0, left) >= maxWidth
  }

  // Disable parallax on mobile devices
  window.onresize = function() {
    if (window.innerWidth < 868) {
      $(".js-parallax").each(function () {
        var el = $(this)[0];
        el.style.transform = 'translateY(0px)';
      });
    }
  }

  $(document).on("scroll", function() {
    if (window.innerWidth < 868) {
      return;
    }
    
    var pageOffset = window.pageYOffset;

    $(".js-parallax").each(function() {
      var el = $(this)[0];

      var speed = el.getAttribute("data-parallax-speed");

      var y = -pageOffset / speed;
      el.style.transform = 'translateY('+ y +'px)';

    });
  });

  // =======
  // Tabs
  // =======
  $(".tabs").removeClass(".js-disabled");
  
  // Reset tabs (if JS is enabled)
  $(".tabs-content")
    .addClass("hidden")
    .filter(":first")
      .removeClass("hidden");  

  $(".tabs-nav__btn").click(function() {
    $(this).parent()
      .addClass("active")
      .siblings()
        .removeClass("active");

    var index = $(this).parent().index() + 2;
    $(".tabs-content")
      .addClass("hidden")
      .filter(":nth-child(" + index + ")")
        .removeClass("hidden");
  });

  // ====== 
  // QnA 
  // ====== 
  $(".qna")
    .removeClass("js-disabled")
    .addClass("owl-carousel")
    .owlCarousel({
      loop: true,
      items: 1,
      nav: true,
      navText: [
        `
          <img class="owl-prev-icon" src="img/arrow-down.svg" src="" >
          <span>
            Другой<br>
            вопрос
          </span>
        `,
        `
          <img class="owl-next-icon" src="img/arrow-down.svg" src="" >
          <span>
            Еще<br>
            вопрос!
          </span>
        `,
      ],
      mouseDrag: false,
      stagePadding: 0,
      
      responsive: {
        0: {
          autoHeight: true,
          dots: false,
          margin: 30
        },
        868: {
          dots: true,
          margin: 0,
        },
      }
    });

  function num2str(n, text_forms) {
    n = Math.abs(n) % 100; var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
  }

  // Slider
  $(".slider__input").on("input", function() {
    var val = this.value;
    $(this).next()
      .css("left", ((val - 1) * 4.85) + ((val) * .2) + "em")
      .find(".slider__val")
        .text(val);
    
    var $infoBox = $(this).siblings(".info-box"); 
    if (val >= 8) {
      $infoBox.addClass("reversed");
    }
    else {
      $infoBox.removeClass("reversed");
    }

    var $slider = $(".slider");
    if (val == 10) {
      console.log('!');
      $slider.addClass("final");
    }
    else {
      $slider.removeClass("final");
    }

    $(".slider__info-box")
      .css("left", ((val) * 8) - ((val-1) * 3) + "em");

    $(".js-friends-number")
      .html(`<b>${val}</b> ${num2str(val, ["друг", "друга", "друзей"])}`);
    var bonusNumber = val * 9;
    $(".js-bonus-number")
      .html(`<b>${bonusNumber}</b> ${num2str(bonusNumber, ["бонус", "бонуса", "бонусов"])}`);
      
    $(".js-megabonus-number")
      .html(`<b>${val}</b> ${num2str(val, ["спецбонус", "спецбонуса", "спецбонусов"])}`);
    
    // Clone megabonus icon
    $(".megabonus-icon-wrap").empty();
    for (var i = 0; i < val; i++) {
      $("<img>").attr("src", "img/barrel.svg").addClass("megabonus-icon")
        .appendTo(".megabonus-icon-wrap");
    }
  });

  var sliderMobileValueHTML = $(".slider-mobile__val");
  function updateThumbMobile(val) {
    sliderMobileValueHTML.text(val);
    $(".js-mobile-friends-number")
      .html(`<b>${val}</b> ${num2str(val, ["друг", "друга", "друзей"])}`);

    var bonusNumber = val * 9;
    $(".js-mobile-bonus-number")
      .html(`<b>${bonusNumber}</b> ${num2str(bonusNumber, ["бонус", "бонуса", "бонусов"])}`);

    $(".js-mobile-megabonus-number")
      .html(`<b>${val}</b> ${num2str(val, ["спецбонус", "спецбонуса", "спецбонусов"])}`);

    // Clone megabonus icon
    $(".megabonus-mobile-icon-wrap").empty();
    for (var i = 0; i < ((val >= 5) ? 5 : val); i++) {
      $("<img>").attr("src", "img/barrel.svg").addClass("megabonus-icon")
        .appendTo(".megabonus-mobile-icon-wrap");
    }
  }

  // Slider mobile
  $(".js-slider-mobile-next").click(function() {
    var val = +sliderMobileValueHTML.text() + 1;
    if (val > 10) {
      val = 10;
    }

    updateThumbMobile(val);
  });
  
  $(".js-slider-mobile-prev").click(function() {
    var val = +sliderMobileValueHTML.text() - 1;
    if (val < 1) {
      val = 1;
    }

    updateThumbMobile(val);
  });
});
