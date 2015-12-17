<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="icon" type="image/x-icon" href="/public/static/img/favicon.ico" />
    <!--[IF lte IE 9]>
      <script src="/public/static/js/matchMedia.js"></script>
    <![endif]-->
    {% block styles %}
      <link rel="stylesheet" type="text/css" href="/public/static/webfonts/gill-sans.css">
    {% endblock styles %}

    {% block title %}{% endblock title %}

  </head>
  <body>
    <div id="page-wrapper">
      <div id="content">
        {% block content %}{% endblock content %}
      </div>
      <footer id="footer">
        <p>This website is brought to you by the <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">Texas Water Development Board</a></p>
        <p>
          <a href="/about#SitePolicies" target="_self" title="Site Policies">Site Policies</a> |
          <a href="http://www.texas.gov/" title="Texas Online">Texas Online</a> |
          <a href="http://www.governor.texas.gov/homeland" title="Homeland Security">Homeland Security</a> |
          <a href="http://www2.tsl.state.tx.us/trail" title="TRAIL">TRAIL</a> |
          <a href="mailto:InteractiveSWP@twdb.texas.gov" title="Contact Us">Contact Us</a>
        </p>
        <a href="http://tnris.org">
          <img class="tnris-logo" src="/public/static/img/tnris_logo.svg" alt="TNRIS logo" />
        </a>
      </footer>
    </div>

    {% block bodyscripts %}{% endblock bodyscripts %}
  </body>
</html>
