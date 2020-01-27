const DOMLoaded = () => {
  try {
    $("a[data-fancybox]").fancybox();
  } catch {}

  $(function() {
    const $page = window.location.pathname;

    if ($page === "/") {
      $(".navbar").addClass("transparent");
    }

    $(".navbar li a").each(function() {
      var $href = $(this).attr("href");
      if ($href == $page || $href == "") {
        $(this).addClass("active");
      } else {
        $(this).removeClass("active");
      }
    });
  });
};

$("#contact-form").submit(function(evt) {
  evt.preventDefault();

  const supportEmail = "info@oakexclusive.com";
  const inputs = $("#contact-form :input");

  const values = {};
  inputs.each(function() {
    values[this.name] = $(this).val();
  });

  values.body = `${values.body}\n\n Sent by: ${values.first_name} ${values.last_name}`;

  window.location = `mailto:${supportEmail}?subject=${values.subject}&body=${values.body}`;
});

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("include");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("src");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("src");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      DOMLoaded();
      /* Exit the function: */
      return;
    }
  }
}

includeHTML();
