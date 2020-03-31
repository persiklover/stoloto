function num2str(n, text_forms) {
  n = Math.abs(n) % 100; var n1 = n % 10;
  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 == 1) { return text_forms[0]; }
  return text_forms[2];
}

var formatNumber = (val) => (val + "").replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");

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
      autoHeight: true,
      responsive: {
        0: {
        },
        768: {
        }
      }
    })
    .on('initialized.owl.carousel', function (event) {
      updateSlider(event);
    })
    .on('changed.owl.carousel', function (event) {
      updateSlider(event);
    });

  // Столото API
  $.ajax({
    url:  "https://api.stoloto.ru/mobile/api/v28/service/games/info-new",
    success: function(content) {
      console.log(content);
      

      function num2text(num) {
        var text = formatNumber(num).split(" ");
        var result = "";

        for (var i = text.length; i--;) {
          var endings = [];

          if (text.length - 1 - i == 1) {
            endings = ["тысяча", "тысячи", "тысяч"];
          }
          else if (text.length - 1 - i == 2) {
            endings = ["миллион", "миллиона", "миллионов"];
          }
          else if (text.length - 1 - i == 3) {
            endings = ["миллиард", "миллиарда", "миллиардов"];
          }

          var realNum = +text[i];
          if (realNum != 0) {
            var suffix = "";
            if (i == text.length - 1) {
              result += realNum + result;
            }
            else {
              var suffix = " " + num2str(realNum, endings) + " ";
              result = (realNum + suffix) + result;
            }
          }
        }

        return result;
      }

      function updateLottery(selector, data) {
        console.log(data);

        $(selector).each(function(i, el) {
          
          var specialDraw = (data.specialDraws) ? data.specialDraws[0] : data.draw;

          $(el).find(".js-super-prize")
            .text(formatNumber(data.completedDraw.superPrize))
            .attr("aria-label", num2text(data.completedDraw.superPrize))
            .next()
            .attr("aria-label", num2str(data.completedDraw.superPrize, ["рубль", "рубля", "рублей"]))
            .attr("title", num2str(data.completedDraw.superPrize, ["рубль", "рубля", "рублей"]));

          var betCost = specialDraw.betCost;
          $(el).find(".js-bet-cost").each(function (_i, _el) {
            $(_el).text(betCost);
          });

          var start = specialDraw.startSalesDate;

          function msToTime(duration) {
            var milliseconds = parseInt((duration % 1000) / 100),
              seconds = Math.floor((duration / 1000) % 60),
              minutes = Math.floor((duration / (1000 * 60)) % 60),
              hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
          }
          start = msToTime(start).split(":").map(h => +Math.floor(Number(h)));
          $(el).find(".js-time")
            .text(`
              ${start[0]} ${num2str(start[0], ["час", "часа", "часов"])}
              ${start[1]} ${num2str(start[0], ["минута", "минуты", "минут"])}
            `);
        });
      }

      updateLottery(".js-ruslotto", content.games[5]);
      updateLottery(".js-4x20",     content.games[16]);
      updateLottery(".js-rapido",   content.games[2]);
      updateLottery(".js-6x45",     content.games[0]);
    },
  })
});
