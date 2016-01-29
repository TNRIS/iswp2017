{% extends 'layout/layout.swig' %}

{% block styles %}
  {% parent %}
  <link rel="stylesheet" type="text/css" href="/public/styles.css">
{% endblock styles %}

{% block title %}
  <title>Not Found | DRAFT 2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
  <header class="header" id="Top">
    <div class="header-title wrapper">
      <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
        <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" class="logo" />
      </a>
      <h1>DRAFT 2017 Texas State Water Plan</h1>
      <div class="nav-container">
        <a class="button" href="/" title="Home">Home</a><!-- fix inline-block space
        --><a class="button" href="/about" title="About">About</a>
      </div>
    </div>
  </header>
  <section class="content">
    <div class="container">
      <div class="row panel-row">
        <div class="twelve columns">
          <h2>Page Not Found</h2>
          <p>We're sorry, the page you requested cannot be found.</p>
          <p>Return to the <a title="Home" href="/">home page</a> to try again.</p>
        </div>
      </div>
    </div>
  </section>
{% endblock content %}

{% block bodyscripts %}
  {# empty block to avoid sending GA pageview #}
{% endblock bodyscripts %}