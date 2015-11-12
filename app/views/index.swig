{% extends 'layout/layout.swig' %}

{% block styles %}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css" />
<link rel="stylesheet" href="https://api.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.css" />
<link rel="stylesheet" type="text/css" href="/public/styles.css">
{% endblock styles %}

{% block title %}
<title>DRAFT 2017 Texas State Water Plan</title>
{% endblock title %}

{% block body %}
<div id="reactApp"></div>

<footer class="footer">
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

<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>
<script src="https://api.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.js"></script>
<script type="text/javascript" src="/public/bundle.js" charset="utf-8"></script>
{% endblock body %}