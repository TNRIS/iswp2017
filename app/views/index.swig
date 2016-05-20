{% extends 'layout/layout.swig' %}

{% block styles %}
  {% parent %}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.css" />
{% endblock styles %}

{% block title %}
  <title>2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
  <div id="reactApp">
    <noscript>
      <div class="container">
        <div class="row panel-row">
          <div class="twelve columns">
            <h4>Error: Javascript is Required!</h4>
            Javascript is required to use the Interactive State Water Plan Application. <br />
            Please enable Javascript in your browser, or visit <a title="2016 Regional Water Plans" href="http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/index.asp">http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/index.asp</a>
            to view Regional Water Plan data in the traditional viewer.
          </div>
        </div>
      </div>
    </noscript>
  </div>
{% endblock content %}


{% block bodyscripts %}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/leaflet.js"></script>
  <script type="text/javascript" src="/public/{{jsBundleName}}" charset="utf-8"></script>
{% endblock bodyscripts %}
