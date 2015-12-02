{% extends 'layout/layout.swig' %}

{% block styles %}
  {% parent %}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css" />
  <link rel="stylesheet" href="https://api.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.css" />
  <link rel="stylesheet" type="text/css" href="/public/styles.css">
{% endblock styles %}

{% block title %}
  <title>DRAFT 2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
  <div id="reactApp">
    {# This will get replaced once the react app loads #}
    <header class="header">
      <div class="header-title wrapper">
        <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
          <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" class="logo" />
        </a>
        <h1>DRAFT 2017 Texas State Water Plan</h1>
      </div>
    </header>
  </div>
{% endblock content %}


{% block bodyscripts %}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>
  <script src="https://api.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.js"></script>
  <script type="text/javascript" src="/public/bundle.js" charset="utf-8"></script>
{% endblock bodyscripts %}