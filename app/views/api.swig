{% extends 'layout/layout.swig' %}

{% block title %}
  <title>API | DRAFT 2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
  <a class="skip-link" href="#main-content" tabIndex="1" title="Skip to main content">Skip to Main Content</a>
  <header class="header" id="Top">
    <div class="header-title wrapper">
      <h1>
        <a href="/" title="Home"><span class="first-line">DRAFT 2017</span><br/>Texas State Water Plan</a>
      </h1>
      <span class="by-the show-medium">by the</span>
      <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
        <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" class="logo" />
      </a>
      <div class="nav-container">
        <a class="button button-home" href="/" title="Home">
          <svg version="1" viewBox="0 0 24 24" data-reactid=".0.1.0.3.0.0"><path d="M20 20v-8h2L12 3 2 12h2v8c0 .6.4 1 1 1h5v-7h4v7h5c.6 0 1-.4 1-1z" data-reactid=".0.1.0.3.0.0.0"></path></svg>
        </a>{#
        #}<a class="button" href="/about" title="About">About</a>
      </div>
    </div>
  </header>
  <section class="content">
    <div class="container">
      <div class="row panel-row">
        <div class="twelve columns" id="main-content">
          <h2>API Documentation</h2>
          <p>
            This page contains documentation for the application programming interface (API) that powers the interactive state water plan application. All methods are available via standard HTML requests and are <a title="W3C definition of CORS" href="http://www.w3.org/wiki/CORS_Enabled">CORS-enabled</a> so that cross-browser requests can be made. All water volums are given in units of <code>acre-feet/year</code>. Unless otherwise specified, all methods return JSON responses.
          </p>
          <p>
            For any questions regarding the data or how to apply it, please contact: <a href="mailto:WRPdatarequests@twdb.texas.gov">WRPdatarequests@twdb.texas.gov</a>.
          </p>
          {% for routeGroup in routeGroups %}
            <section class="route-section">
              <h3>{{ routeGroup.name }} Methods</h3>
              <p> {{ routeGroup.description }}
              <ul class="route-list">
              {% for route in routeGroup.routes %}
                <li>
                  <div class="route-method-path">
                    <code>
                      <span class="route-method">{{ route.method }}</span>
                      <span class="route-path"><a href={{route.path}}>{{ route.path }}</a></span>
                    </code>
                  </div>
                  <div class="route-info">
                    {% if route.config.description %}
                      <p class="route-description">{{ route.config.description | safe }}</p>
                    {% endif %}
                    {% if route.config.notes %}
                      <p class="route-notes"><strong>Notes:</strong> {{ route.config.notes | safe}}</p>
                    {% endif %}
                  </div>
                </li>
              {% endfor %}
              </ul>
            </section>
          {% endfor %}
        </div>
      </div>
    </div>
  </section>
{% endblock content %}