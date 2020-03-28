function scrollTo(selector) {
  $("html, body").animate({
    scrollTop: $(selector).offset().top + 'px'
  }, 500);
}

$(function() {

  $('a[href^="#"]').click(function(e) {
    e.preventDefault();
    scrollTo($(this).attr("href"));
  });

  $(".js-show-info").click(function() {
    $(this).next(".loteries-item-overlay").addClass("visible");
  });
  
  $(".js-hide-info").click(function() {
    $(this).parents(".loteries-item-overlay").removeClass("visible");
  });

  var $slider = $(".js-slider"); 
  function updateSlider(event) {
    if (event.page.index > 0) {
      $slider.addClass("slider--black");
    }
    else {
      $slider.removeClass("slider--black");
    }
  }

  $(".slider")
    .addClass("enabled")
    .addClass("owl-carousel")
    .owlCarousel({
      items:     1,
      margin:    1,
      loop:      true,
      mouseDrag: false,
      dots:      true,
      nav:       true,
      navText: [
        "<img src='img/arrow.png' aria-label='Вперед'>",
        "<img src='img/arrow.png' aria-label='Назад'>"
      ],
      responsive: {
        0: {
          autoHeight: true
        },
        768: {
          autoHeight: false
        }
      }
    })
    .on('initialized.owl.carousel', function (event) {
      updateSlider(event);
    })
    .on('changed.owl.carousel', function (event) {
      updateSlider(event);
    });
});
