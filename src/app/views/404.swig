{% extends 'layout/layout.swig' %}

{% block title %}
  <title>Not Found | 2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
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
