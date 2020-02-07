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

$("#contact-form").on("submit", function(evt) {
  evt.preventDefault();

  $.ajax({
    url: "/handle_contact_form.php",
    data: $(this).serialize(),
    type: "POST",
    success: function(data) {
      $("#mail-status").html(data);
      document.getElementById("contact-form").reset();
    },
    error: function() {
      $("#mail-status").html(
        "<p class='alert alert-danger'>An error occured.</p>"
      );
    }
  });
});

$("#job-form").on("submit", function(evt) {
  evt.preventDefault();

  $.ajax({
    url: "/handle_application_form.php",
    data: new FormData(this),
    type: "POST",
    processData: false,
    contentType: false,
    success: function(data) {
      $("#mail-status").html(data);
      document.getElementById("job-form").reset();
    },
    error: function() {
      $("#mail-status").html(
        "<p class='alert alert-danger'>An error occured.</p>"
      );
    }
  });
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

const getUrlVars = () => {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
};

const getUrlParam = (parameter, defaultvalue = "") => {
  var urlparameter = defaultvalue;
  if (window.location.href.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
};

const renderWorks = () => {
  const project = getUrlParam("project");
  const gallery = document.querySelector(".works-gallery");
  const headingTitle = document.querySelector(".title");
  const headingDescription = document.querySelector(".subtitle");

  let newDom = "";
  fetch("/works.json")
    .then(res => res.json())
    .then(works => {
      try {
        const projectTitle = works[project].title;
        const projectDescription = works[project].description;

        document.title = `${projectTitle} - Oak Exclusive`;
        headingTitle.innerHTML = projectTitle;
        headingDescription.innerHTML = projectDescription || "";

        newDom = works[project].images.reduce(
          (acc, image) =>
            (acc += `<figure class="work-item bg-light"><a href="/dist/img/portfolio/${image}" data-fancybox="works"><img class="work-image" src="/dist/img/portfolio/${image}"  /> </a> </figure>`),
          ""
        );
        gallery.innerHTML = newDom;
      } catch {
        window.location.href = "/portfolio";
      }
    })
    .catch(() => (window.location.href = "/portfolio"));
};

includeHTML();
