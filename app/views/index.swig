{% extends 'layout/layout.swig' %}

{% block body %}
<div class="container">
  <section class="header">
    <img src="/public/static/img/twdb_logo_color.png" />
    <h1>Texas State Water Plan 2017</h1>
  </section>
  
  <section class="content" id="reactApp"></section>

  <section class="footer">
    <p>This website is brought to you by the <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">Texas Water Development Board</a></p>
    <p>
      <a href="/about#SitePolicies" target="_self" title="Site Policies">Site Policies</a> |
      <a href="http://www.texas.gov/" title="Texas Online">Texas Online</a> |
      <a href="http://www.governor.texas.gov/homeland" title="Homeland Security">Homeland Security</a> |
      <a href="http://www2.tsl.state.tx.us/trail" title="TRAIL">TRAIL</a> |
      <a href="mailto:InteractiveSWP@twdb.texas.gov" title="Contact Us">Contact Us</a>
    </p>
  </section>
</div>
    
<script type="text/javascript" src="/public/bundle.js" charset="utf-8"></script>
{% endblock body %}