<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/public/static/img/favicon.ico" />

    {% block styles %}
      <link rel="stylesheet" type="text/css" href="/public/static/webfonts/gill-sans.css">
      <link rel="stylesheet" type="text/css" href="/public/{{cssBundleName}}">
    {% endblock styles %}

    {% block title %}{% endblock title %}
  </head>
  <body>
    <div id="page-wrapper">
      <div id="content">
        <!--[if lte IE 9]>
          <div class="browsehappy">
            <p>You are using an <strong>unsupported</strong> browser: <a href="https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support">https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support</a></p>
            <p>Please <a href="http://browsehappy.com/" title="browsehappy">upgrade your browser</a> to improve your experience.</p>
          </div>
        <![endif]-->
        <a class="skip-link" id="skip-link" href="#main-content" tabIndex="1" title="Skip to main content">Skip to Main Content</a>
        <header class="header" id="Top">
          <div class="header-title-container">
            <div class="header-title wrapper">
              <h1>
                <a href="/" title="Home"><span class="first-line">DRAFT 2017</span><br/>Texas State Water Plan</a>
              </h1>
              <span class="by-the show-medium">by the</span>
              <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
                <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" class="logo" />
              </a>
              <div class="nav-container">
                <a class="button button-home" aria-label="Home" href="/" title="Home">
                  <svg version="1" viewBox="0 0 24 24" data-reactid=".0.1.0.3.0.0"><path d="M20 20v-8h2L12 3 2 12h2v8c0 .6.4 1 1 1h5v-7h4v7h5c.6 0 1-.4 1-1z" data-reactid=".0.1.0.3.0.0.0"></path></svg>
                </a>{#
                #}<a class="button {% if current_page == 'about'%}active{% endif %}" href="/about" title="About">About</a>
              </div>
            </div>
          </div>
        </header>
        <div id="main-content">
          {% block content %}{% endblock content %}
        </div>
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

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', '{{ gaTrackingCode }}', 'auto');
    </script>

    <script>
      document.getElementById('skip-link').onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById('main-content').scrollIntoView();
        return;
      };
    </script>

    {% block bodyscripts %}
      {# Default to sending a pageview. Child templates can have a blank block to avoid the page track. #}
      <script>
        ga('send', 'pageview');
      </script>
    {% endblock bodyscripts %}
  </body>
</html>
