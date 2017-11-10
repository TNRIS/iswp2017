{% extends 'layout/layout.swig' %}

{% block title %}
  <title>API | 2017 Texas State Water Plan</title>
{% endblock title %}

{% block content %}
  <section class="content">
    <div class="container">
      <div class="row panel-row">
        <div class="twelve columns">
          <h2>API Documentation</h2>
          <p>
            This page contains documentation for the application programming interface (API) that powers the interactive state water plan application. All methods are available via standard HTML requests and are <a title="W3C definition of CORS" href="http://www.w3.org/wiki/CORS_Enabled">CORS-enabled</a> so that cross-browser requests can be made. All water volumes are given in units of <code>acre-feet/year</code>. Unless otherwise specified, all methods return JSON responses.
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
