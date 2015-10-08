{% extends 'layout/layout.swig' %}

{% block styles %}
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
<link rel="stylesheet" type="text/css" href="/public/styles.css">
{% endblock styles %}

{% block title %}
<title>2017 Texas State Water Plan</title>
{% endblock title %}

{% block body %}
<header class="header">
  <div class="header-title wrapper">
    <img src="/public/static/img/twdb_logo_color.png" class="logo" />
    <h1>Texas State Water Plan 2017</h1>
  </div>
</header>

<section class="content" id="reactApp"></section>

<footer class="footer">
  <p>This website is brought to you by the <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">Texas Water Development Board</a></p>
  <p>
    <a href="/about#SitePolicies" target="_self" title="Site Policies">Site Policies</a> |
    <a href="http://www.texas.gov/" title="Texas Online">Texas Online</a> |
    <a href="http://www.governor.texas.gov/homeland" title="Homeland Security">Homeland Security</a> |
    <a href="http://www2.tsl.state.tx.us/trail" title="TRAIL">TRAIL</a> |
    <a href="mailto:InteractiveSWP@twdb.texas.gov" title="Contact Us">Contact Us</a>
  </p>
</footer>

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/zepto/1.1.6/zepto.min.js" charset="utf-8"></script>
<script type="text/javascript" src="/public/bundle.js" charset="utf-8"></script>
{% endblock body %}